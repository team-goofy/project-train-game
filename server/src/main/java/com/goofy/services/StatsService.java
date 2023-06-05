package com.goofy.services;

import com.goofy.models.Stats;
import java.util.concurrent.ExecutionException;

public interface StatsService {
    Stats getStatsById(String uid) throws ExecutionException, InterruptedException;

    String updateStats(Stats stats, String uid) throws ExecutionException, InterruptedException;
}
