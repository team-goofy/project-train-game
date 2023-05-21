package com.goofy.services;

import com.goofy.models.Departure;
import com.goofy.models.Departure.RouteStation;
import com.goofy.models.ExitStationTrain;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;

@Service
public class DepartureServiceImpl implements DepartureService {
    private final Random random = new Random();

    @Override
    public List<Departure> filterByFutureDepartures(List<Departure> departures) {
        LocalDateTime timeNow = LocalDateTime.now().plusMinutes(5);
        LocalDateTime timeMax = timeNow.plusMinutes(30);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ssX");

        return departures.stream()
                .filter(departure -> {
                    LocalDateTime timestamp = LocalDateTime.parse(departure.getPlannedDateTime(), formatter);
                    return timestamp.isBefore(timeMax) && timestamp.isAfter(timeNow);
                })
                .toList();
    }

    @Override
    public ExitStationTrain getRandomExitStationTrain(List<Departure> departures) {
        List<Departure> filteredDepartures = this.filterByFutureDepartures(departures);
        int randomDepartureIndex = this.random.nextInt(filteredDepartures.size());

        Departure randomDeparture = filteredDepartures.get(randomDepartureIndex);

        List<RouteStation> stations = randomDeparture.getRouteStations();

        int randomExitStationIndex = this.random.nextInt(stations.size());

        RouteStation randomExitStation = stations.get(randomExitStationIndex);

        return new ExitStationTrain(randomDeparture, randomExitStation);
    }


}
