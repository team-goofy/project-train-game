package com.goofy.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
@Getter
@Setter
public class NsTrip {
    private List<TrainTrip> trainTrips;

    @Getter
    @Setter
    public static class TrainTrip {
        private String originUicCode;
        private String destinationUicCode;
        private String departureTime;
    }

    @Getter
    @Setter
    public static class TripDuration {
        private int plannedDurationInMinutes;
        private int actualDurationInMinutes;
    }
}
