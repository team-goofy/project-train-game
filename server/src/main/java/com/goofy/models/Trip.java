package com.goofy.models;

import com.goofy.models.Departure.RouteStation;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Trip {
    private String tripId;
    private List<RouteStation> routeStations;
    private Boolean isEnded;
    private String tripEndDate;
}