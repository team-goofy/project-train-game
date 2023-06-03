package com.goofy.services;

import com.goofy.dtos.TripDTO;
import com.goofy.dtos.TripImageDTO;
import com.goofy.exceptions.NoContentTypeException;
import com.goofy.exceptions.TripImageAlreadyExistsException;
import com.goofy.models.Trip;
import com.goofy.models.TripFilter;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.BlobId;
import com.google.firebase.cloud.StorageClient;

import java.util.UUID;

import lombok.AllArgsConstructor;

import java.io.IOException;
import java.io.InputStream;
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

    @Override
    public BlobId saveImage(TripImageDTO image, String uid) throws IOException {
        InputStream inputStream = image.getImage().getInputStream();
        String contentType = image.getImage().getContentType();

        String tripId = image.getTripId();
        String stationUic = image.getUicCode();

        if (contentType == null) {
            throw new NoContentTypeException("Content type has not been specified");
        }

        String extension = getFileExtension(contentType);

        String blobId = String.format("trip-%s_station-%s_user-%s%s", tripId, stationUic, uid, extension);
        Blob blob = storage.bucket().get(blobId);

        if (blob != null && blob.exists()) {
            throw new TripImageAlreadyExistsException(String.format(
                    "Image at at this station for this trip already exists", stationUic, tripId, uid));
        }

        return storage.bucket().create(blobId, inputStream, contentType).getBlobId();
    }

    @Override
    public String saveTrip(TripDTO trip, String uid) {
        boolean hasTripId = trip.getTripId() != null;
        String tripId = hasTripId ? trip.getTripId() : UUID.randomUUID().toString();

        Map<String, Object> saveTrip = Map.of(
                "tripId", tripId,
                "uid", uid,
                "isEnded", trip.getIsEnded(),
                "routeStations", trip.getRouteStations());

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

    private static String getFileExtension(String contentType) {
        return switch (contentType) {
            case "image/jpeg" -> ".jpg";
            case "image/png" -> ".png";
            default -> "";
        };
    }
}
