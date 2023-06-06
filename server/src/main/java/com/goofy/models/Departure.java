package com.goofy.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
@Getter
@Setter
public class Departure {
    private String direction;
    private String name;
    private String plannedDateTime;
    private String actualTrack;
    private String trainCategory;
    private List<RouteStation> routeStations;
    private List<Message> messages;
    private String departureStatus;

    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    @EqualsAndHashCode
    public static class RouteStation {
        private String uicCode;

        @EqualsAndHashCode.Exclude
        private String mediumName;

        @EqualsAndHashCode.Exclude
        private String departureTime;
    }

    @Getter
    @Setter
    public static class Message {
        @JsonProperty("message")
        private String infoMessage;

        private String style;
    }
}
