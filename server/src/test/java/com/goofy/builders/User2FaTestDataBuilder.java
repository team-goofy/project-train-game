package com.goofy.builders;

import com.goofy.models.Profile;

public class User2FaTestDataBuilder {
    public Profile buildProfile() {
        String userName = "mandylbbh";
        String secret = "OJSRESDIFKQREY47";

        Profile profile = new Profile();
        profile.setUsername(userName);
        profile.setSecret(secret);
        profile.setIs2FaActivated(true);

        return profile;
    }
}
