package com.goofy.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
@Getter
@Setter
public class Station {
    @JsonProperty("UICCode")
    private String uicCode;

    @JsonProperty("stationType")
    private String stationType;

    @JsonProperty("EVACode")
    private String evaCode;

    @JsonProperty("code")
    private String code;

    @JsonProperty("sporen")
    private List<Track> tracks;

    @JsonProperty("namen")
    private Name names;

    @JsonProperty("lat")
    private double lat;

    @JsonProperty("lng")
    private double lng;

    @Getter
    @Setter
    public static class Name {
        @JsonProperty("lang")
        private String longName;

        @JsonProperty("middel")
        private String medName;

        @JsonProperty("kort")
        private String shortName;
    }

    @Getter
    @Setter
    public static class Track {
        @JsonProperty("spoorNummer")
        private String trackNumber;
    }
}
