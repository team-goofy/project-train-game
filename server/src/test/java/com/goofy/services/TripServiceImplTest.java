package com.goofy.services;

import com.goofy.dtos.TripDTO;
import com.goofy.models.Departure.RouteStation;
import com.goofy.utils.UUIDGenerator;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.SetOptions;
import com.google.firebase.cloud.StorageClient;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
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
        when(docRef.getId()).thenReturn(uuidTrip); // Specify behavior of getId method
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
        when(docRef.getId()).thenReturn(trip.getTripId()); // Specify behavior of getId method
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
}