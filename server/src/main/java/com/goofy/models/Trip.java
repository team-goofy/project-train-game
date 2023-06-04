package com.goofy.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@JsonIgnoreProperties(ignoreUnknown = true)
@Getter
@Setter
public class Trip {
    private int plannedDurationInMinutes;
    private int actualDurationInMinutes;
}
