package com.goofy.services;

import java.io.IOException;
import java.util.concurrent.ExecutionException;

import com.goofy.dtos.TripDTO;
import com.goofy.dtos.TripImageDTO;
import com.goofy.models.Trip;
import com.google.cloud.storage.BlobId;

public interface TripService {
    BlobId saveImageToStorage(TripImageDTO image, String userId) throws IOException;

    String saveTripToDatabase(TripDTO trip, String uid);

    Trip getTripById(String tripId) throws ExecutionException, InterruptedException;
}
