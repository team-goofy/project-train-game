package com.goofy.controllers;
import com.goofy.models.*;
import com.goofy.services.StatsService;
import com.goofy.services.TripService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Transactional
@RestController
@RequestMapping("/stats")
@AllArgsConstructor
public class StatsController {
    private final TripService tripService;
    private final StatsService statsService;

    @PostMapping
    public ResponseEntity<String> updateStats(@RequestBody Stats stats, Principal principal) throws ExecutionException, InterruptedException {
        TripFilter filter = new TripFilter();
        filter.setOnGoing(false);

        List<Trip> trips = this.tripService.getTrips(filter, principal.getName());

        List<Departure.RouteStation> startStations = trips.stream()
                .map(Trip::getRouteStations)
                .filter(routeStations -> !routeStations.isEmpty())
                .map(routeStations -> routeStations.get(0))
                .toList();
        String mostUsedStartStation = this.tripService.getMostFrequentStationName(startStations);

        List<Departure.RouteStation> stationsVisited = trips.stream()
                .flatMap(trip -> trip.getRouteStations().stream().skip(1))
                .toList();
        String mostVisitedStation = this.tripService.getMostFrequentStationName(stationsVisited);

        long totalUniqueStationsVisited = stationsVisited.stream()
                .distinct()
                .count();

        stats.setMostUsedStartLocation(mostUsedStartStation);
        stats.setMostVisitedStation(mostVisitedStation);
        stats.setTotalStations((int) totalUniqueStationsVisited);

        String statsId = this.statsService.updateStats(stats, principal.getName());
        return ResponseEntity.ok(statsId);
    }

    @GetMapping
    public ResponseEntity<Object> getStatsById(@RequestParam String uid)
            throws ExecutionException, InterruptedException {
        Stats stats = this.statsService.getStatsById(uid);
        return ResponseEntity.ok(stats);
    }
}
