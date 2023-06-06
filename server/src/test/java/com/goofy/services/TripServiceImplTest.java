package com.goofy.services;

import com.goofy.dtos.TripDTO;
import com.goofy.models.Departure.RouteStation;
import com.goofy.models.Trip;
import com.goofy.utils.UUIDGenerator;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.StorageClient;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ExecutionException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@SpringBootTest
class TripServiceImplTest {
    private final StorageClient storage = mock(StorageClient.class);
    private final Firestore firestore = mock(Firestore.class);
    private final UUIDGenerator uuidGenerator = mock(UUIDGenerator.class);
    private final TripService tripService = new TripServiceImpl(storage, firestore, uuidGenerator);

    @Test
    public void saveTrip_NoTripId_GeneratesAndReturnsNewTripId() {
        // Arrange
        RouteStation station = new RouteStation();
        station.setUicCode("station1_uic_code");
        station.setMediumName("Station 1");
        station.setDepartureTime("2021-01-01T12:00:00.000Z");

        String uid = "testUid";
        TripDTO trip = new TripDTO();
        trip.setIsEnded(false);
        trip.setRouteStations(List.of(station));
        trip.setTripEndDate("2021-01-01T12:00:00.000Z");

        String uuidTrip = "123e4567-e89b-12d3-a456-426614174000";

        // Mock
        DocumentReference docRef = mock(DocumentReference.class);
        when(docRef.getId()).thenReturn(uuidTrip);
        when(firestore.collection("trip")).thenReturn(mock(CollectionReference.class));
        when(firestore.collection("trip").document(anyString())).thenReturn(docRef);
        when(docRef.set(any(Map.class))).thenReturn(mock(ApiFuture.class));
        when(uuidGenerator.generateUUID()).thenReturn(UUID.fromString(uuidTrip));

        // Act
        String returnedTripId = tripService.saveTrip(trip, uid);

        // Assert
        assertNotNull(returnedTripId);
        assertEquals(uuidTrip, returnedTripId);
        verify(firestore.collection("trip"), times(1)).document(uuidTrip);
        verify(docRef, times(1)).set(any(Map.class));
    }

    @Test
    public void saveTrip_ValidTripDTO_ReturnsTripId() {
        // Arrange
        RouteStation station = new RouteStation();
        station.setUicCode("station1_uic_code");
        station.setMediumName("Station 1");
        station.setDepartureTime("2021-01-01T12:00:00.000Z");

        String uid = "testUid";
        TripDTO trip = new TripDTO();
        trip.setTripId("test");
        trip.setIsEnded(false);
        trip.setRouteStations(List.of(station));
        trip.setTripEndDate("2021-01-01T12:00:00.000Z");


        // Mock
        DocumentReference docRef = mock(DocumentReference.class);
        when(docRef.getId()).thenReturn(trip.getTripId());
        when(firestore.collection("trip")).thenReturn(mock(CollectionReference.class));
        when(firestore.collection("trip").document(anyString())).thenReturn(docRef);
        when(docRef.set(any(Map.class), any(SetOptions.class))).thenReturn(mock(ApiFuture.class));

        // Act
        String returnedTripId = tripService.saveTrip(trip, uid);

        // Assert
        assertNotNull(returnedTripId);
        assertEquals(trip.getTripId(), returnedTripId);
        verify(firestore.collection("trip"), times(1)).document(trip.getTripId());
        verify(docRef, times(1)).set(any(Map.class), any(SetOptions.class));
    }

    @Test
    void getTripById_ExistingTripId_ReturnsTrip() throws ExecutionException, InterruptedException {
        // Arrange
        String tripId = "trip-123";

        Trip trip = new Trip();
        trip.setTripId(tripId);

        // Mock
        DocumentReference docRef = mock(DocumentReference.class);
        when(firestore.collection("trip")).thenReturn(mock(CollectionReference.class));
        when(firestore.collection("trip").document(anyString())).thenReturn(docRef);
        ApiFuture<DocumentSnapshot> future = mock(ApiFuture.class);
        when(docRef.get()).thenReturn(future);
        DocumentSnapshot snapshot = mock(DocumentSnapshot.class);
        when(future.get()).thenReturn(snapshot);
        when(snapshot.exists()).thenReturn(true);
        when(snapshot.toObject(Trip.class)).thenReturn(trip);

        // Act
        Trip result = tripService.getTripById(tripId);

        // Assert
        assertNotNull(result);
        assertEquals(tripId, result.getTripId());
        verify(firestore.collection("trip"), times(1)).document(tripId);
        verify(docRef, times(1)).get();
    }

    @Test
    void getTripById_NonExistingTripId_ReturnsNull() throws ExecutionException, InterruptedException {
        // Arrange
        String tripId = "trip-123";

        // Mock
        DocumentReference docRef = mock(DocumentReference.class);
        when(firestore.collection("trip")).thenReturn(mock(CollectionReference.class));
        when(firestore.collection("trip").document(anyString())).thenReturn(docRef);
        ApiFuture<DocumentSnapshot> future = mock(ApiFuture.class);
        when(docRef.get()).thenReturn(future);
        DocumentSnapshot snapshot = mock(DocumentSnapshot.class);
        when(future.get()).thenReturn(snapshot);
        when(snapshot.exists()).thenReturn(false);

        // Act
        Trip result = tripService.getTripById(tripId);

        // Assert
        assertNull(result);
        verify(firestore.collection("trip"), times(1)).document(tripId);
        verify(docRef, times(1)).get();
    }
}