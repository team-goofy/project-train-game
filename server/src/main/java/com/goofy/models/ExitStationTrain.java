package com.goofy.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import com.goofy.models.Departure.RouteStation;

@Getter
@Setter
@AllArgsConstructor
public class ExitStationTrain {
    private Departure departure;
    private RouteStation exitStation;
}
