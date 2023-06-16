package com.goofy.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.NoArgsConstructor;
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
    private String matIcon;
    private String bgColor;

    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    @NoArgsConstructor
    public static class UserAchievementUpdate {
        private String uid;
        private int progress;
        private String dateAchieved;
        private boolean hasAchieved;
    }

    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    @NoArgsConstructor
    public static class UserAchievement {
        private String uid;
        private String title;
        private String description;
        private int valueToReach;
        private String tag;
        private String matIcon;
        private String bgColor;
        private int progress;
        private String dateAchieved;
        private boolean hasAchieved;
    }

    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AchievementStats {
        private int totalTripDuration;
        private int totalVisitedStations;
    }
}
