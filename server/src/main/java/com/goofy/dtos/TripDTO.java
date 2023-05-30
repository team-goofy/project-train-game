package com.goofy.dtos;

import lombok.Data;
import java.util.List;

@Data
public class TripDTO {
    private String tripId;
    private List<String> routeStations;
    private Boolean isEnded;
}