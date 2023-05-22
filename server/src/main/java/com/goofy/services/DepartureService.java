package com.goofy.services;

import com.goofy.exceptions.NoDeparturesFoundException;
import com.goofy.exceptions.NoStationFoundException;
import com.goofy.models.Departure;
import com.goofy.models.ExitStationTrain;

import java.util.List;

public interface DepartureService {
    ExitStationTrain getRandomExitStationTrain(List<Departure> trains) throws NoDeparturesFoundException, NoStationFoundException;

    List<Departure> filterByFutureDepartures(List<Departure> departures);
}
