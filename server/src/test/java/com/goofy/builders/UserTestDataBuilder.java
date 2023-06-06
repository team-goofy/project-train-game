package com.goofy.builders;

import com.goofy.dtos.UserDTO;
import com.goofy.models.Profile;

public class UserTestDataBuilder {
    public Profile buildProfile() {
        String userName = "mandylbbh";
        String email = "test@test.nl";
        String password = "password";

        UserDTO user = UserDTO.builder()
                .username(userName)
                .email(email)
                .password(password)
                .build();

        Profile profile = new Profile();
        profile.setUsername(user.getUsername());

        return profile;
    }
}