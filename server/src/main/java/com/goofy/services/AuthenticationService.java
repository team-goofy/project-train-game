package com.goofy.services;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;

import java.util.concurrent.ExecutionException;

public interface AuthenticationService {

    ResponseEntity<String> verify2FA(@Valid String secret, String code, String uid) throws InterruptedException, ExecutionException;

    ResponseEntity<String> disable2FA(String uid) throws InterruptedException, ExecutionException;
}
