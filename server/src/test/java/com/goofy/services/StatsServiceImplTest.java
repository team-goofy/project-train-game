package com.goofy.services;

import com.goofy.builders.StatsTestDataBuilder;
import com.goofy.models.Stats;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.concurrent.ExecutionException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.when;

@ExtendWith(org.springframework.test.context.junit.jupiter.SpringExtension.class)
@SpringBootTest
class StatsServiceImplTest {
    private final StatsTestDataBuilder statsTestDataBuilder = new StatsTestDataBuilder();
    private final Firestore firestore = mock(Firestore.class);
    private final StatsService statsService = new StatsServiceImpl(firestore);

    // Test: Retrieve stats from a user
    @Test
    void test_retrieve_stats() throws ExecutionException, InterruptedException {
        // Arrange
        String uid = "generalUid";
        Stats statsToBeExpected = statsTestDataBuilder.buildStats();

        // Mock
        DocumentReference documentReference = mock(DocumentReference.class);
        ApiFuture<DocumentSnapshot> future = mock(ApiFuture.class);
        DocumentSnapshot snapshot = mock(DocumentSnapshot.class);

        // (Mock) When
        when(firestore.collection("stats")).thenReturn(mock(CollectionReference.class));
        when(firestore.collection("stats").document(anyString())).thenReturn(documentReference);
        when(documentReference.get()).thenReturn(future);
        when(future.get()).thenReturn(snapshot);
        when(snapshot.exists()).thenReturn(true);
        when(snapshot.toObject(Stats.class)).thenReturn(statsToBeExpected);

        // Act
        Stats result = statsService.getStatsById(uid);

        // Assert
        assertNotNull(result);
        assertEquals(statsToBeExpected.getTotalMinutes(), result.getTotalMinutes());
        assertEquals(statsToBeExpected.getTotalStations(), result.getTotalStations());
        assertEquals(statsToBeExpected.getMostVisitedStation(), result.getMostVisitedStation());
        assertEquals(statsToBeExpected.getMostUsedStartLocation(), result.getMostUsedStartLocation());

        // Verify
        verify(firestore.collection("stats"), times(1)).document(uid);
        verify(documentReference, times(1)).get();
    }

    // Test: Retrieve stats from a user that does not exist
    @Test
    void test_retrieve_stats_of_non_existing_user() throws ExecutionException, InterruptedException {
        // Arrange
        String uid = "generalUid";

        // Mock
        DocumentReference documentReference = mock(DocumentReference.class);
        ApiFuture<DocumentSnapshot> future = mock(ApiFuture.class);
        DocumentSnapshot snapshot = mock(DocumentSnapshot.class);

        // When
        when(firestore.collection("stats")).thenReturn(mock(CollectionReference.class));
        when(firestore.collection("stats").document(anyString())).thenReturn(documentReference);
        when(documentReference.get()).thenReturn(future);
        when(future.get()).thenReturn(snapshot);
        when(snapshot.exists()).thenReturn(false);

        // Act
        Stats result = statsService.getStatsById(uid);

        // Assert
        assertNull(result);

        // Verify
        verify(firestore.collection("stats"), times(1)).document(uid);
        verify(documentReference, times(1)).get();
    }

    // Test: Update stats of a user
    @Test
    void test_update_stats() throws ExecutionException, InterruptedException {
        // Arrange
        String uid = "generalUid";
        Stats statsToBeExpected = statsTestDataBuilder.buildStats();

        // Mock
        DocumentReference documentReference = mock(DocumentReference.class);
        ApiFuture<DocumentSnapshot> future = mock(ApiFuture.class);
        DocumentSnapshot snapshot = mock(DocumentSnapshot.class);
        ApiFuture<WriteResult> writeResult = mock(ApiFuture.class);

        // (Mock) When
        when(firestore.collection("stats")).thenReturn(mock(CollectionReference.class));
        when(firestore.collection("stats").document(anyString())).thenReturn(documentReference);
        when(documentReference.getId()).thenReturn(uid);
        when(documentReference.get()).thenReturn(future);
        when(future.get()).thenReturn(snapshot);
        when(snapshot.exists()).thenReturn(true);
        when(snapshot.toObject(Stats.class)).thenReturn(statsToBeExpected);
        when(documentReference.set(anyMap(), any())).thenReturn(writeResult);
        when(writeResult.get()).thenReturn(mock(WriteResult.class));

        // Act
        String statsId = statsService.updateStats(statsToBeExpected, uid);

        // Assert
        assertNotNull(statsId);
        assertEquals(uid, statsId);

        // Verify
        verify(firestore.collection("stats"), times(1)).document(uid);
        verify(documentReference, times(1)).get();
        verify(documentReference, times(1)).set(anyMap(), any());
    }

    @Test
    void test_update_stats_of_non_existing_user_exception() throws ExecutionException, InterruptedException {
        // Arrange
        String uid = "generalUid";
        Stats statsToBeExpected = statsTestDataBuilder.buildStats();

        // Mock
        DocumentReference documentReference = mock(DocumentReference.class);
        ApiFuture<DocumentSnapshot> future = mock(ApiFuture.class);
        DocumentSnapshot snapshot = mock(DocumentSnapshot.class);
        ApiFuture<WriteResult> writeResult = mock(ApiFuture.class);

        // (Mock) When
        when(firestore.collection("stats")).thenReturn(mock(CollectionReference.class));
        when(firestore.collection("stats").document(anyString())).thenReturn(documentReference);
        when(documentReference.getId()).thenReturn(uid);
        when(documentReference.get()).thenReturn(future);
        when(future.get()).thenReturn(snapshot);
        when(snapshot.exists()).thenReturn(false);
        when(documentReference.set(anyMap(), any())).thenReturn(writeResult);
        when(writeResult.get()).thenThrow(mock(RuntimeException.class));

        // Act + Assert
        assertThrows(RuntimeException.class, () -> statsService.updateStats(statsToBeExpected, uid));
    }
}
