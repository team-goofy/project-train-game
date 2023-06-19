package com.goofy.services;

import com.goofy.dtos.TripDTO;
import com.goofy.dtos.TripImageDTO;
import com.goofy.exceptions.NoContentTypeException;
import com.goofy.exceptions.TripImageAlreadyExistsException;
import com.goofy.exceptions.UnsupportedFileExtensionException;
import com.goofy.models.Departure;
import com.goofy.models.Trip;
import com.goofy.models.TripFilter;
import com.goofy.models.TripImage;
import com.goofy.utils.UUIDGenerator;
import com.google.api.gax.paging.Page;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.BlobId;
import com.google.firebase.cloud.StorageClient;

import lombok.AllArgsConstructor;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class TripServiceImpl implements TripService {
    private final StorageClient storage;
    private final Firestore firestore;
    private final UUIDGenerator uuidGenerator;

    @Override
    public BlobId saveImage(TripImageDTO image, String uid) throws IOException {
        InputStream inputStream = image.getImage().getInputStream();
        String contentType = image.getImage().getContentType();

        String tripId = image.getTripId();
        String stationUic = image.getUicCode();
        String ltd = image.getLtd();
        String lng = image.getLng();

        if (contentType == null) {
            throw new NoContentTypeException("Content type has not been specified");
        }

        String extension = getFileExtension(contentType);

        String blobId = String.format("trip-%s_station-%s_user-%s_ltd-%s_lng-%s%s", tripId, stationUic, uid, ltd, lng,
                extension);
        Blob blob = storage.bucket().get(blobId);

        if (blob != null && blob.exists()) {
            throw new TripImageAlreadyExistsException("Image at at this station for this trip already exists");
        }

        return storage.bucket().create(blobId, inputStream, contentType).getBlobId();
    }

    @Override
    public List<TripImage> getTripImages(String tripId, String uid) {
        List<TripImage> results = new ArrayList<>();
        Page<Blob> blobs = storage.bucket().list();

        for (Blob blob : blobs.iterateAll()) {
            if (blob.getName().contains(uid) && blob.getName().contains(tripId)) {
                String[] split = blob.getName().split("_");
                double ltd = Double.parseDouble(split[3].split("-")[1]);
                String lngWithExtension = split[4].split("-")[1];
                double lng = Double.parseDouble(lngWithExtension.substring(0, lngWithExtension.lastIndexOf(".")));
                results.add(new TripImage(blob.getContent(), ltd, lng));
            }
        }

        return results;
    }

    @Override
    public String saveTrip(TripDTO trip, String uid) {
        boolean hasTripId = trip.getTripId() != null;
        String tripId = hasTripId ? trip.getTripId() : uuidGenerator.generateUUID().toString();

        Map<String, Object> saveTrip = Map.of(
                "tripId", tripId,
                "uid", uid,
                "isEnded", trip.getIsEnded(),
                "routeStations", trip.getRouteStations(),
                "tripEndDate", trip.getTripEndDate());

        DocumentReference tripRef = firestore.collection("trip").document(tripId);

        ApiFuture<WriteResult> writeResult;
        if (hasTripId) {
            writeResult = tripRef.set(saveTrip, SetOptions.merge());
        } else {
            writeResult = tripRef.set(saveTrip);
        }

        // Block until the write operation is complete and the result is available.
        try {
            writeResult.get();
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException("Error writing trip to Firestore", e);
        }

        return tripRef.getId();
    }

    @Override
    public List<Trip> getTrips(TripFilter filter, String uid) {
        CollectionReference tripsRef = firestore.collection("trip");
        Query query = tripsRef;

        if (filter.getOnGoing() != null) {
            query = query.whereNotEqualTo("isEnded", filter.getOnGoing());
        } else {
            query = query.whereEqualTo("isEnded", true);
        }

        query = query.whereEqualTo("uid", uid);

        ApiFuture<QuerySnapshot> future = query.get();
        try {
            List<QueryDocumentSnapshot> documents = future.get().getDocuments();
            return documents.stream().map(doc -> doc.toObject(Trip.class)).collect(Collectors.toList());
        } catch (InterruptedException | ExecutionException e) {

            throw new RuntimeException("Error getting trips from Firestore", e);
        }
    }

    @Override
    public Trip getTripById(String tripId) throws ExecutionException, InterruptedException {
        DocumentReference tripRef = this.firestore.collection("trip").document(tripId);
        ApiFuture<DocumentSnapshot> future = tripRef.get();
        DocumentSnapshot trip = future.get();

        return trip.exists() ? trip.toObject(Trip.class) : null;
    }

    private static String getFileExtension(String contentType) throws UnsupportedFileExtensionException {
        return switch (contentType) {
            case "image/jpeg" -> ".jpg";
            case "image/png" -> ".png";
            default -> throw new UnsupportedFileExtensionException("File extension is not supported");
        };
    }

    @Override
    public String getMostFrequentStationName(List<Departure.RouteStation> stations) {
        return stations.stream()
                .collect(Collectors.groupingBy(Departure.RouteStation::getUicCode, Collectors.counting()))
                .entrySet()
                .stream()
                .max(Map.Entry.comparingByValue())
                .flatMap(entry -> stations.stream()
                        .filter(station -> station.getUicCode().equals(entry.getKey()))
                        .findFirst()
                        .map(Departure.RouteStation::getMediumName))
                .orElse(null);
    }
}
