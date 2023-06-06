package com.goofy.services;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.ExecutionException;

import com.goofy.dtos.TripDTO;
import com.goofy.dtos.TripImageDTO;
import com.goofy.models.Departure;
import com.goofy.models.Trip;
import com.goofy.models.TripFilter;
import com.google.cloud.storage.BlobId;

public interface TripService {
    BlobId saveImage(TripImageDTO image, String userId) throws IOException;

    String saveTrip(TripDTO trip, String uid);

    List<Trip> getTrips(TripFilter filter, String uid);

    Trip getTripById(String tripId) throws ExecutionException, InterruptedException;

    String getMostFrequentStationName(List<Departure.RouteStation> stations);
}
