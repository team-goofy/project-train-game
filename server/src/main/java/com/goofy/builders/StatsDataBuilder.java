package com.goofy.builders;

import com.goofy.models.Stats;

public class StatsDataBuilder {
    private String mostUsedStartLocation;
    private String mostVisitedStation;
    private Integer totalStations;
    private Integer totalMinutes;

    public StatsDataBuilder withMostUsedStartLocation(String mostUsedStartLocation) {
        this.mostUsedStartLocation = mostUsedStartLocation;
        return this;
    }

    public StatsDataBuilder withMostVisitedStation(String mostVisitedStation) {
        this.mostVisitedStation = mostVisitedStation;
        return this;
    }

    public StatsDataBuilder withTotalStations(Integer totalStations) {
        this.totalStations = totalStations;
        return this;
    }

    public StatsDataBuilder withTotalMinutes(Integer totalMinutes) {
        this.totalMinutes = totalMinutes;
        return this;
    }

    public Stats buildStats() {
        return Stats.builder()
            .mostUsedStartLocation(this.mostUsedStartLocation)
            .mostVisitedStation(this.mostVisitedStation)
            .totalStations(this.totalStations)
            .totalMinutes(this.totalMinutes)
            .build();
    }
}