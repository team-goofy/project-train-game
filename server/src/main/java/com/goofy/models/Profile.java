package com.goofy.models;


public class Profile {
    private String username;
    private String is2FaActivated;
    private String secret;

    public String getIs2FaActivated() {
        return is2FaActivated;
    }

    public void setIs2FaActivated(String is2FaActivated) {
        this.is2FaActivated = is2FaActivated;
    }

    public String getSecret() {
        return secret;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
