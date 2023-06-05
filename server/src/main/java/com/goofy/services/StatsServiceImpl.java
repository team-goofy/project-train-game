package com.goofy.services;

import com.goofy.models.Profile;
import com.goofy.models.Stats;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ExecutionException;

@Service
@AllArgsConstructor
public class StatsServiceImpl implements StatsService {
    private final Firestore firestore;

    @Override
    public Stats getStatsById(String uid) throws ExecutionException, InterruptedException {
        DocumentReference statsRef = this.firestore.collection("stats").document(uid);
        ApiFuture<DocumentSnapshot> future = statsRef.get();
        DocumentSnapshot stats = future.get();

        return stats.exists() ? stats.toObject(Stats.class) : null;
    }

    @Override
    public String updateStats(Stats stats, String uid) throws ExecutionException, InterruptedException {
        DocumentReference statsRef = firestore.collection("stats").document(uid);
        ApiFuture<DocumentSnapshot> apiFuture = statsRef.get();

        Stats documentSnapshotFuture = apiFuture.get().toObject(Stats.class);
        Integer currentTotalMinutes = 0;

        if (documentSnapshotFuture != null) {
            currentTotalMinutes = documentSnapshotFuture.getTotalMinutes();
        }

        Map<String, Object> saveStats = Map.of(
                "mostUsedStartLocation", stats.getMostUsedStartLocation(),
                "mostVisitedStation", stats.getMostVisitedStation(),
                "totalMinutes", currentTotalMinutes + stats.getTotalMinutes(),
                "totalStations", stats.getTotalStations());

        ApiFuture<WriteResult> writeResult;
        writeResult = statsRef.set(saveStats, SetOptions.merge());

        // Block until the write operation is complete and the result is available.
        try {
            writeResult.get();
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException("Error writing stats to Firestore", e);
        }

        return statsRef.getId();
    }
}
