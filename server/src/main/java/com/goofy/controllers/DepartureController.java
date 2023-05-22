package com.goofy.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.goofy.models.Departure;
import com.goofy.models.ExitStationTrain;
import com.goofy.services.DepartureService;
import lombok.AllArgsConstructor;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Transactional
@Controller
@RequestMapping("/departures")
@AllArgsConstructor
public class DepartureController {
    private final Environment env;
    private final RestTemplate restTemplate;
    private final HttpEntity<Object> httpEntity;
    private final ObjectMapper objectMapper;
    private final DepartureService departureService;

    @GetMapping
    @ResponseBody
    public ResponseEntity<List<Departure>> getDepartures(@RequestParam String station) throws JsonProcessingException {
        ResponseEntity<String> response = restTemplate.exchange(
                env.getProperty("ns.api.base.url") + "/departures?station=" + station,
                HttpMethod.GET, httpEntity, String.class);

        JsonNode jsonNode = objectMapper.readTree(response.getBody());
        JsonNode unsortedStations = jsonNode.get("payload").get("departures");

        List<Departure> departures = objectMapper.readValue(unsortedStations.toString(),
                objectMapper.getTypeFactory().constructCollectionType(List.class, Departure.class));

        return ResponseEntity.ok(departures);
    }

    @GetMapping("/random")
    @ResponseBody
    public ResponseEntity<ExitStationTrain> getRandomDeparture(@RequestParam String uicCode) throws JsonProcessingException {
        ResponseEntity<String> response = restTemplate.exchange(
                env.getProperty("ns.api.base.url") + "/departures?uicCode=" + uicCode,
                HttpMethod.GET, httpEntity, String.class);

        JsonNode jsonNode = objectMapper.readTree(response.getBody());
        JsonNode unsortedStations = jsonNode.get("payload").get("departures");

        List<Departure> departures = objectMapper.readValue(unsortedStations.toString(),
                objectMapper.getTypeFactory().constructCollectionType(List.class, Departure.class));

        ExitStationTrain exitStationTrain = this.departureService.getRandomExitStationTrain(departures);

        return ResponseEntity.ok(exitStationTrain);
    }
}
