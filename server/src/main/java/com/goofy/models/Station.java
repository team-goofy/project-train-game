package com.goofy.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
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

    // GETTER
    @JsonProperty("UICCode")
    public String getUICCode() {
        return uicCode;
    }

    @JsonProperty("EVACode")
    public String getEVACode() {
        return evaCode;
    }

    public String getStationType() {
        return stationType;
    }
    public String getCode() {
        return code;
    }
    public List<Track> getTracks() {
        return tracks;
    }
    public Name getNames() {
        return names;
    }
    public double getLat() {
        return lat;
    }
    public double getLng() {
        return lng;
    }

    // SETTER
    public void setUICCode(String uicCode) {
        this.uicCode = uicCode;
    }
    public void setStationType(String stationType) {
        this.stationType = stationType;
    }
    public void setEVACode(String evaCode) {
        this.evaCode = evaCode;
    }
    public void setCode(String code) {
        this.code = code;
    }
    public void setTracks(List<Track> tracks) {
        this.tracks = tracks;
    }
    public void setNames(Name names) {
        this.names = names;
    }
    public void setLat(double lat) {
        this.lat = lat;
    }
    public void setLng(double lng) {
        this.lng = lng;
    }

    public static class Name {
        @JsonProperty("lang")
        private String longName;

        @JsonProperty("middel")
        private String medName;

        @JsonProperty("kort")
        private String shortName;

        // GETTER
        public String getLongName() {
            return longName;
        }
        public String getMedName() {
            return medName;
        }
        public String getShortName() {
            return shortName;
        }

        // SETTER
        public void setLongName(String longName) {
            this.longName = longName;
        }
        public void setMedName(String medName) {
            this.medName = medName;
        }
        public void setShortName(String shortName) {
            this.shortName = shortName;
        }
    }

    public static class Track {
        @JsonProperty("spoorNummer")
        private String trackNumber;

        // GETTER
        public String getTrackNumber() {
            return trackNumber;
        }

        // SETTER
        public void setTrackNumber(String trackNumber) {
            this.trackNumber = trackNumber;
        }
    }
}
