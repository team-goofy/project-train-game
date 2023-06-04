package com.goofy.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.goofy.models.NsTrip;
import lombok.AllArgsConstructor;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Transactional
@Controller
@RequestMapping("/trip")
@AllArgsConstructor
public class TripController {
    private final Environment env;
    private final RestTemplate restTemplate;
    private final HttpEntity<Object> httpEntity;
    private final ObjectMapper objectMapper;

//    @GetMapping("/duration")
//    @ResponseBody
//    public ResponseEntity<NsTrip> getTripDuration(
//            @RequestParam String originUicCode, @RequestParam String destUicCode, @RequestParam String dateTime
//    ) throws JsonProcessingException {
//
//
//        ResponseEntity<String> response = restTemplate.exchange(
//                env.getProperty("ns.api.base.url.v3") + "/trips?originUicCode=" + originUicCode
//                        + "&destinationUicCode=" + destUicCode + "&dateTime=" + dateTime,
//                HttpMethod.GET, httpEntity, String.class);
//
//        JsonNode jsonNode = objectMapper.readTree(response.getBody());
//        NsTrip nsTripInfo = objectMapper.readValue(jsonNode.get("trips").get(0).toString(), NsTrip.class);
//
//        return ResponseEntity.ok(nsTripInfo);
//    }

    @PostMapping("/duration")
    @ResponseBody
    public ResponseEntity<Integer> getTripsDuration(@RequestBody NsTrip nsTrips) throws JsonProcessingException {
        List <NsTrip.TripDuration> tripDurationList = new ArrayList<>();
        int totalTripDuration = 0;

        for (NsTrip.TrainTrip trainTrip : nsTrips.getTrainTrips()) {
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
