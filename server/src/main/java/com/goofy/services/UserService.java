package com.goofy.services;

import com.goofy.dtos.UserDTO;
import com.goofy.models.Profile;
import com.google.cloud.firestore.DocumentReference;
import com.google.firebase.auth.UserRecord;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;

import java.util.concurrent.ExecutionException;

public interface UserService {
    UserRecord saveUser(UserDTO user) throws Exception;

    boolean usernameExists(String username) throws InterruptedException, ExecutionException;


    Profile getProfile(String uid) throws InterruptedException, ExecutionException;

    ResponseEntity<String> changeUsername(@Valid String username, String uid) throws InterruptedException, ExecutionException;

    ResponseEntity<String> verify2FA( @Valid String secret, String uid) throws InterruptedException, ExecutionException;

    ResponseEntity<String> disable2FA(String uid) throws InterruptedException, ExecutionException;
}
