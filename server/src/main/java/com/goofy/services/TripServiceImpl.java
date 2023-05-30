package com.goofy.services;

import com.goofy.dtos.TripImageDTO;
import com.goofy.exceptions.NoContentTypeException;
import com.goofy.exceptions.TripImageAlreadyExistsException;
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.BlobId;
import com.google.firebase.cloud.StorageClient;

import lombok.AllArgsConstructor;

import java.io.IOException;
import java.io.InputStream;

import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class TripServiceImpl implements TripService {
    private final StorageClient storage;

    @Override
    public BlobId saveImageToStorage(TripImageDTO image, String uid) throws IOException {
        InputStream inputStream = image.getImage().getInputStream();
        String contentType = image.getImage().getContentType();

        Long tripId = image.getTripId();
        String stationUic = image.getUicCode();

        if (contentType == null) {
            throw new NoContentTypeException("Content type has not been specified");
        }

        String extension = getFileExtension(contentType);

        String blobId = String.format("trip-%d_station-%s_user-%s%s", tripId, stationUic, uid, extension);
        Blob blob = storage.bucket().get(blobId);

        if (blob != null && blob.exists()) {
            throw new TripImageAlreadyExistsException(String.format(
                    "Image at station %s for trip %d by user %s already exists", stationUic, tripId, uid)
            );
        }

        return storage.bucket().create(blobId, inputStream, contentType).getBlobId();
    }

    private static String getFileExtension(String contentType) {
        return switch (contentType) {
            case "image/jpeg" -> ".jpg";
            case "image/png" -> ".png";
            default -> "";
        };
    }
}
