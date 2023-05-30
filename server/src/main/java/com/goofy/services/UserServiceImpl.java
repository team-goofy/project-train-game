package com.goofy.services;

import com.goofy.controllers.EmailController;
import com.goofy.dtos.UserDTO;
import com.goofy.exceptions.UsernameExistsException;
import com.goofy.models.Profile;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.UserRecord;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ExecutionException;

@Service
public class UserServiceImpl implements UserService {

    private EmailController emailController;
    private final FirebaseAuth firebaseAuth;
    private final Firestore firestore;

    public UserServiceImpl(EmailController emailController, FirebaseAuth firebaseAuth, Firestore firestore) {
        this.emailController = emailController;
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

            emailController.sendEmailVerification(user.getEmail());
            return createdUser;
        } catch (InterruptedException | ExecutionException e) {
            throw new Exception("Something went wrong while creating the user");
        }
    }

    public Profile getProfile(String uid) throws InterruptedException, ExecutionException {
        ApiFuture<DocumentSnapshot> apiFuture = this.firestore.collection("user").document(uid).get();

        return apiFuture.get().toObject(Profile.class);
    }

    public boolean usernameExists(String username) throws InterruptedException, ExecutionException {
        ApiFuture<QuerySnapshot> apiFuture = this.firestore.collection("user").whereEqualTo("username", username).get();

        return !apiFuture.get().isEmpty();
    }

}
