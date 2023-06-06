package com.goofy.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class Stats {
    private String mostUsedStartLocation;
    private String mostVisitedStation;
    private Integer totalStations;
    private Integer totalMinutes;
}
