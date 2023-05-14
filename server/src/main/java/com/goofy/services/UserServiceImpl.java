package com.goofy.services;

import com.goofy.dtos.UserDTO;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
    private final FirebaseAuth firebaseAuth;

    public UserServiceImpl(FirebaseAuth firebaseAuth) {
        this.firebaseAuth = firebaseAuth;
    }

    public UserRecord createUser(UserDTO user) throws FirebaseAuthException {
        UserRecord.CreateRequest request = new UserRecord.CreateRequest()
                .setEmail(user.getEmail())
                .setEmailVerified(false)
                .setPassword(user.getPassword())
                .setDisplayName(user.getUsername())
                .setDisabled(false);

        return this.firebaseAuth.createUser(request);
    }

}
