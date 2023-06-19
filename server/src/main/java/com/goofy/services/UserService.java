package com.goofy.services;

import com.goofy.dtos.UserDTO;
import com.goofy.models.Profile;
import com.google.firebase.auth.UserRecord;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;

import java.util.Map;
import java.util.concurrent.ExecutionException;

public interface UserService {
    UserRecord saveUser(UserDTO user) throws Exception;

    boolean usernameExists(String username) throws InterruptedException, ExecutionException;


    Profile getProfile(String uid) throws InterruptedException, ExecutionException;

    ResponseEntity<String> changeUsername(@Valid String username, String uid) throws InterruptedException, ExecutionException;

    Map<String, String> getUidByEmail(String email) throws Exception;

}
