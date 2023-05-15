package com.goofy.services;

import com.goofy.dtos.UserDTO;
import com.goofy.exceptions.UsernameExistsException;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.UserRecord;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ExecutionException;

@Service
public class UserServiceImpl implements UserService {
    private final FirebaseAuth firebaseAuth;
    private final Firestore firestore;

    public UserServiceImpl(FirebaseAuth firebaseAuth, Firestore firestore) {
        this.firebaseAuth = firebaseAuth;
        this.firestore = firestore;
    }

    public UserRecord saveUser(UserDTO user) throws Exception {
        try {
            boolean usernameExists = this.usernameExists(user.getUsername());

            UserRecord.CreateRequest request = new UserRecord.CreateRequest()
                    .setEmail(user.getEmail())
                    .setEmailVerified(false)
                    .setPassword(user.getPassword())
                    .setDisabled(false);

            if (usernameExists) {
                throw new UsernameExistsException("This username is not available");
            }

            UserRecord createdUser = this.firebaseAuth.createUser(request);
            Map<String, String> data = Map.of("username", user.getUsername());
            this.firestore.collection("user").document(createdUser.getUid()).set(data);

            return createdUser;
        } catch (InterruptedException | ExecutionException e) {
            throw new Exception("Something went wrong while creating the user");
        }
    }

    public boolean usernameExists(String username) throws InterruptedException, ExecutionException {
        ApiFuture<QuerySnapshot> apiFuture = this.firestore.collection("user").whereEqualTo("username", username).get();

        return !apiFuture.get().isEmpty();
    }
}