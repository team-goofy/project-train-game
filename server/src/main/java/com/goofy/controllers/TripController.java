package com.goofy.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.goofy.models.Trip;
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

@Transactional
@Controller
@RequestMapping("/trip")
@AllArgsConstructor
public class TripController {
    private final Environment env;
    private final RestTemplate restTemplate;
    private final HttpEntity<Object> httpEntity;
    private final ObjectMapper objectMapper;

    @GetMapping("/duration")
    @ResponseBody
    public ResponseEntity<Trip> getTripDuration(
            @RequestParam String originUicCode, @RequestParam String destUicCode, @RequestParam String dateTime) throws JsonProcessingException {
        ResponseEntity<String> response = restTemplate.exchange(
                env.getProperty("ns.api.base.url.v3") + "/trips?originUicCode=" + originUicCode
                        + "&destinationUicCode=" + destUicCode + "&dateTime=" + dateTime,
                HttpMethod.GET, httpEntity, String.class);

        JsonNode jsonNode = objectMapper.readTree(response.getBody());
        Trip tripInfo = objectMapper.readValue(jsonNode.get("trips").get(0).toString(), Trip.class);

        return ResponseEntity.ok(tripInfo);
    }
}
