package com.goofy.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class Stats {
    private String mostUsedStartLocation;
    private String mostVisitedStation;
    private Integer totalStations;
    private Integer totalMinutes;

    @Builder
    Stats(String mostUsedStartLocation, String mostVisitedStation, Integer totalStations, Integer totalMinutes) {
        this.mostUsedStartLocation = mostUsedStartLocation;
        this.mostVisitedStation = mostVisitedStation;
        this.totalStations = totalStations;
        this.totalMinutes = totalMinutes;
    }
}
