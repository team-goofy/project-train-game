package com.goofy.builders;

import com.goofy.models.Stats;

public class StatsTestDataBuilder {
    public Stats buildStats() {
        String mostUsedStartLocation = "Zaandam";
        String mostVisitedStation = "Amsterdam C.";
        Integer totalStations = 8;
        Integer totalMinutes = 125;

        return Stats.builder()
                .mostUsedStartLocation(mostUsedStartLocation)
                .mostVisitedStation(mostVisitedStation)
                .totalStations(totalStations)
                .totalMinutes(totalMinutes)
                .build();
    }
}