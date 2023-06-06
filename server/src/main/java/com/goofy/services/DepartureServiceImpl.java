package com.goofy.services;

import com.goofy.exceptions.NoDeparturesFoundException;
import com.goofy.exceptions.NoStationFoundException;
import com.goofy.models.Departure;
import com.goofy.models.Departure.RouteStation;
import com.goofy.models.ExitStationTrain;
import org.springframework.stereotype.Service;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;

@Service
public class DepartureServiceImpl implements DepartureService {
    private final Random random = new Random();

    @Override
    public List<Departure> filterByFutureDepartures(List<Departure> departures) {
        ZonedDateTime timeNow = ZonedDateTime.now(ZoneId.of("Europe/Paris")).plusMinutes(5);
        ZonedDateTime timeMax = timeNow.plusMinutes(30);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ssX");

        return departures.stream()
                .filter(departure -> {
                    ZonedDateTime timestamp = ZonedDateTime.parse(departure.getPlannedDateTime(), formatter);
                    return timestamp.isBefore(timeMax) && timestamp.isAfter(timeNow)
                            && departure.getMessages().stream().noneMatch(message -> "WARNING".equals(message.getStyle()));
                })
                .toList();
    }

    @Override
    public ExitStationTrain getRandomExitStationTrain(List<Departure> departures) throws NoDeparturesFoundException, NoStationFoundException {
        List<Departure> filteredDepartures = this.filterByFutureDepartures(departures);

        if(filteredDepartures.isEmpty()){
            throw new NoDeparturesFoundException("There are no departures within the next 30 minutes.");
        }

        int randomDepartureIndex = this.random.nextInt(filteredDepartures.size());
        Departure randomDeparture = filteredDepartures.get(randomDepartureIndex);
        List<RouteStation> stations = randomDeparture.getRouteStations();

        if(stations.isEmpty()) {
            throw new NoStationFoundException("This station has no route stations.");
        }

        int randomExitStationIndex = this.random.nextInt(stations.size());
        RouteStation randomExitStation = stations.get(randomExitStationIndex);
        return new ExitStationTrain(randomDeparture, randomExitStation);
    }


}
