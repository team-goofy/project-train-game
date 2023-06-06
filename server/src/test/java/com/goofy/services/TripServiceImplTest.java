package com.goofy.services;

import com.goofy.dtos.TripDTO;
import com.goofy.dtos.TripImageDTO;
import com.goofy.exceptions.NoContentTypeException;
import com.goofy.exceptions.TripImageAlreadyExistsException;
import com.goofy.exceptions.UnsupportedFileExtensionException;
import com.goofy.models.Departure.RouteStation;
import com.goofy.models.Trip;
import com.goofy.utils.UUIDGenerator;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.SetOptions;
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Bucket;
import com.google.firebase.cloud.StorageClient;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.io.InputStream;
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

    @Test
    public void saveImage_NoContentType_ThrowsNoContentTypeException() {
        // Arrange
        String uid = "testUid";
        TripImageDTO tripImageDTO = new TripImageDTO();
        MockMultipartFile image = new MockMultipartFile("image", "image.jpg", null, "image data".getBytes());
        tripImageDTO.setImage(image);
        tripImageDTO.setTripId("testTripId");
        tripImageDTO.setUicCode("testUicCode");

        // Act and Assert
        assertThrows(NoContentTypeException.class, () -> tripService.saveImage(tripImageDTO, uid));
        verifyNoInteractions(storage);
    }

    @Test
    public void saveImage_UnsupportedFileExtensions_ThrowsUnsupportedFileExtensionException() throws IOException {
        // Arrange
        String uid = "testUid";
        TripImageDTO tripImageDTO = new TripImageDTO();
        MockMultipartFile image = new MockMultipartFile("gif", "image.gif", "image/gif", "image data".getBytes());
        tripImageDTO.setImage(image);
        tripImageDTO.setTripId("testTripId");
        tripImageDTO.setUicCode("testUicCode");

        // Act and Assert
        assertThrows(UnsupportedFileExtensionException.class, () -> tripService.saveImage(tripImageDTO, uid));
        verifyNoInteractions(storage);
    }

    @Test
    public void saveImage_TripImageAlreadyExists_ThrowsTripImageAlreadyExistsException() throws IOException {
        // Arrange
        String uid = "testUid";
        TripImageDTO tripImageDTO = new TripImageDTO();
        MockMultipartFile image = new MockMultipartFile("image", "image.jpg", "image/jpeg", "image data".getBytes());
        tripImageDTO.setImage(image);
        tripImageDTO.setTripId("testTripId");
        tripImageDTO.setUicCode("testUicCode");

        // Mock
        Blob blob = mock(Blob.class);
        when(blob.exists()).thenReturn(true);
        when(storage.bucket()).thenReturn(mock(Bucket.class));
        when(storage.bucket().get(anyString())).thenReturn(blob);

        // Act and Assert
        assertThrows(
            TripImageAlreadyExistsException.class, () -> tripService.saveImage(tripImageDTO, uid), 
            "Image at at this station for this trip already exists"
        );
        verify(storage.bucket(), times(1)).get(anyString());     
        verify(blob, times(1)).exists();
        verify(storage.bucket(), times(0)).create(anyString(), any(byte[].class), anyString());
    }

    @Test
    public void saveImage_ValidInput_ReturnsBlobId() throws IOException {
        // Arrange
        String uid = "testUid";
        TripImageDTO tripImageDTO = new TripImageDTO();
        MockMultipartFile image = new MockMultipartFile("image", "image.jpg", "image/jpeg", "image data".getBytes());
        tripImageDTO.setImage(image);
        tripImageDTO.setTripId("testTripId");
        tripImageDTO.setUicCode("testUicCode");

        // Mock
        Blob blob = mock(Blob.class);
        when(blob.exists()).thenReturn(false);
        when(storage.bucket()).thenReturn(mock(Bucket.class));
        when(storage.bucket().get(anyString())).thenReturn(blob);
        when(storage.bucket().create(anyString(), any(InputStream.class), anyString())).thenReturn(blob);        
        
        BlobId blobId = BlobId.of("bucketName", "blobName");
        
        when(blob.getBlobId()).thenReturn(blobId);

        // Act
        BlobId returnedBlobId = tripService.saveImage(tripImageDTO, uid);

        // Assert
        assertEquals(blobId, returnedBlobId);
        verify(storage.bucket(), times(1)).get(anyString());
        verify(blob, times(1)).exists();
        verify(storage.bucket(), times(1)).create(anyString(), any(InputStream.class), anyString());
    }
}