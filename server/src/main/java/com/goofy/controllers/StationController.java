package com.goofy.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.goofy.models.Station;
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
@RequestMapping("/station")
public class StationController {

    private final Environment env;
    private final RestTemplate restTemplate;
    private final HttpEntity<Object> httpEntity;
    private final ObjectMapper objectMapper;

    public StationController(Environment env, RestTemplate restTemplate, HttpEntity<Object> httpEntity, ObjectMapper objectMapper) {
        this.env = env;
        this.restTemplate = restTemplate;
        this.httpEntity = httpEntity;
        this.objectMapper = objectMapper;
    }

    // GET HTTP-ROUTES \\
        // GET ALL STATIONS
        @GetMapping("/all")
        @ResponseBody
        public List<Station> getStations() throws JsonProcessingException {
            ResponseEntity<String> response = restTemplate.exchange(
                    env.getProperty("ns.api.base.url") + "/stations", HttpMethod.GET, httpEntity, String.class);

            JsonNode jsonNode = objectMapper.readTree(response.getBody());
            JsonNode unsortedStations = jsonNode.get("payload");

            return objectMapper.readValue(unsortedStations.toString(),
                    objectMapper.getTypeFactory().constructCollectionType(List.class, Station.class));
        }

        // GET THE NEAREST STATION BASED ON LOCATION
        @GetMapping("/nearest")
        @ResponseBody
        public Station getNearestStation(@RequestParam Number lat, @RequestParam Number lng) throws JsonProcessingException {
            ResponseEntity<String> response = restTemplate.exchange(
                    env.getProperty("ns.api.base.url") + "/stations/nearest?lat=" + lat + "&lng=" + lng,
                    HttpMethod.GET, httpEntity, String.class);

            JsonNode jsonNode = objectMapper.readTree(response.getBody());
            JsonNode unsortedStations = jsonNode.get("payload").get(0);

            return objectMapper.readValue(unsortedStations.toString(), Station.class);
        }
}
