package com.goofy.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.goofy.dtos.TripDTO;
import com.goofy.models.*;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

import java.io.IOException;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

import org.springframework.core.env.Environment;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import com.goofy.dtos.TripImageDTO;
import com.goofy.services.TripService;
import com.google.cloud.storage.BlobId;
import org.springframework.web.client.RestTemplate;

@Transactional
@RestController
@RequestMapping("/trip")
@AllArgsConstructor
public class TripController {
    private final TripService tripService;
    private final Environment env;
    private final RestTemplate restTemplate;
    private final HttpEntity<Object> httpEntity;
    private final ObjectMapper objectMapper;

    @PostMapping
    public ResponseEntity<TripResponse> saveTrip(@RequestBody() @Valid TripDTO trip, Principal principal) {
        String tripId = this.tripService.saveTrip(trip, principal.getName());
        TripResponse response = new TripResponse(tripId);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<Trip>> getTrips(@ModelAttribute TripFilter filter, Principal principal) {
        List<Trip> trips = tripService.getTrips(filter, principal.getName());
        return ResponseEntity.ok(trips);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<Object> getTripById(@PathVariable String id)
            throws ExecutionException, InterruptedException {
        Trip trip = this.tripService.getTripById(id);
        return ResponseEntity.ok(trip);
    }

    @PostMapping(value = "/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BlobId> saveImage(@ModelAttribute() @Valid TripImageDTO image, Principal principal)
            throws IOException {
        BlobId blobId = tripService.saveImage(image, principal.getName());
        return ResponseEntity.ok(blobId);
    }

    @GetMapping(value = "/{tripId}/images")
    public ResponseEntity<List<TripImage>> getTripImages(@PathVariable String tripId, Principal principal) {
        List<TripImage> images = this.tripService.getTripImages(tripId, principal.getName());
        return ResponseEntity.ok(images);
    }

    @PostMapping("/duration")
    @ResponseBody
    public ResponseEntity<Integer> getTripsDuration(@RequestBody List<NsTrip> nsTrips) throws JsonProcessingException {
        List <NsTrip.TripDuration> tripDurationList = new ArrayList<>();
        int totalTripDuration = 0;

        for (NsTrip trainTrip : nsTrips) {
            ResponseEntity<String> response = restTemplate.exchange(
                    env.getProperty("ns.api.base.url.v3") + "/trips?originUicCode=" + trainTrip.getOriginUicCode()
                            + "&destinationUicCode=" + trainTrip.getDestinationUicCode() + "&dateTime=" + trainTrip.getDepartureTime(),
                    HttpMethod.GET, httpEntity, String.class);

            JsonNode jsonNode = objectMapper.readTree(response.getBody());
            tripDurationList.add(objectMapper.readValue(jsonNode.get("trips").get(0).toString(), NsTrip.TripDuration.class));
        }

        for (NsTrip.TripDuration tripDuration : tripDurationList) {
            totalTripDuration += tripDuration.getActualDurationInMinutes();
        }

        return ResponseEntity.ok(totalTripDuration);
    }
}
