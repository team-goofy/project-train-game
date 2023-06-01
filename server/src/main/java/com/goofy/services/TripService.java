package com.goofy.services;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import com.goofy.dtos.TripDTO;
import com.goofy.dtos.TripImageDTO;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.storage.BlobId;

public interface TripService {
    BlobId saveImageToStorage(TripImageDTO image, String userId) throws IOException;

    String saveTripToDatabase(TripDTO trip, String uid);

    Map<String, Object> getTripById(String tripId) throws ExecutionException, InterruptedException;
}
