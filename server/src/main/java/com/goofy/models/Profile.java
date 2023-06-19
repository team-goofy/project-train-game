package com.goofy.models;


public class Profile {
    private String username;
    private Boolean is2FaActivated;
    private String secret;

    public Boolean getIs2FaActivated() {
        return is2FaActivated;
    }

    public void setIs2FaActivated(Boolean is2FaActivated) {
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
