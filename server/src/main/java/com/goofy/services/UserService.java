package com.goofy.services;

import com.goofy.dtos.UserDTO;
import com.google.firebase.auth.UserRecord;

import java.util.concurrent.ExecutionException;

public interface UserService {
    UserRecord saveUser(UserDTO user) throws Exception;

    boolean usernameExists(String username) throws InterruptedException, ExecutionException;
}
