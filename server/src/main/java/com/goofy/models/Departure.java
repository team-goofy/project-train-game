package com.goofy.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
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
    public static class RouteStation {
        private String uicCode;
        private String mediumName;
    }

    @Getter
    @Setter
    public static class Message {
        @JsonProperty("message")
        private String infoMessage;

        private String style;
    }
}
