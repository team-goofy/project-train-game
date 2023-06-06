package com.goofy.dtos;

import com.goofy.models.Departure.RouteStation;
import lombok.Data;
import java.util.List;

@Data
public class TripDTO {
    private String tripId;
    private List<RouteStation> routeStations;
    private Boolean isEnded;
    private String tripEndDate;
}