package com.goofy.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Trip {
    private int plannedDurationInMinutes;
    private int actualDurationInMinutes;

    // GETTERS
    public int getPlannedDurationInMinutes() {
        return plannedDurationInMinutes;
    }
    public int getActualDurationInMinutes() {
        return actualDurationInMinutes;
    }
}
