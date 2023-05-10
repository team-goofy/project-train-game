package com.goofy.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Departure {
    private String direction;
    private String name;
    private String plannedDateTime;
    private String actualTrack;
    private String trainCategory;
    private List<RouteStation> routeStations;
    private String departureStatus;
    
    // GETTER
    public String getDirection() {
        return direction;
    }
    public String getName() {
        return name;
    }
    public String getPlannedDateTime() {
        return plannedDateTime;
    }
    public String getActualTrack() {
        return actualTrack;
    }
    public String getTrainCategory() {
        return trainCategory;
    }
    public List<RouteStation> getRouteStations() {
        return routeStations;
    }
    public String getDepartureStatus() {
        return departureStatus;
    }

    // SETTER
    public void setDirection(String direction) {
        this.direction = direction;
    }
    public void setName(String name) {
        this.name = name;
    }
    public void setPlannedDateTime(String plannedDateTime) {
        this.plannedDateTime = plannedDateTime;
    }
    public void setActualTrack(String actualTrack) {
        this.actualTrack = actualTrack;
    }
    public void setTrainCategory(String trainCategory) {
        this.trainCategory = trainCategory;
    }
    public void setRouteStations(List<RouteStation> routeStations) {
        this.routeStations = routeStations;
    }
    public void setDepartureStatus(String departureStatus) {
        this.departureStatus = departureStatus;
    }

    public static class RouteStation {
        private String uicCode;
        private String mediumName;

        // GETTERS
        public String getUicCode() {
            return uicCode;
        }
        public String getMediumName() {
            return mediumName;
        }

        // SETTERS
        public void setUicCode(String uicCode) {
            this.uicCode = uicCode;
        }
        public void setMediumName(String mediumName) {
            this.mediumName = mediumName;
        }
    }
}
