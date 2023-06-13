package com.goofy.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@JsonIgnoreProperties(ignoreUnknown = true)
@Getter
@Setter
public class Achievement {
    private String uid;
    private String title;
    private String description;
    private int valueToReach;
    private String tag;

    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class UserAchievement {
        private String uid;
        private int progress;
        private String dateAchieved;
        private boolean hasAchieved;
    }
}
