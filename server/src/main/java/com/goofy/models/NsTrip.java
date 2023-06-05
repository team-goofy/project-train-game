package com.goofy.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@JsonIgnoreProperties(ignoreUnknown = true)
@Getter
@Setter
public class NsTrip {
    private String originUicCode;
    private String destinationUicCode;
    private String departureTime;

    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class TripDuration {
        private int plannedDurationInMinutes;
        private int actualDurationInMinutes;
    }
}
