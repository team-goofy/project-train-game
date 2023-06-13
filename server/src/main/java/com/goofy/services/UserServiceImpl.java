package com.goofy.services;

import com.goofy.controllers.EmailController;
import com.goofy.dtos.UserDTO;
import com.goofy.exceptions.UsernameExistsException;
import com.goofy.models.Achievement;
import com.goofy.models.Profile;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.UserRecord;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private final EmailController emailController;
    private final FirebaseAuth firebaseAuth;
    private final Firestore firestore;

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

            // Retrieve all achievements from Firebase
            List<Achievement> achievementList = this.firestore.collection("achievements").get().get().getDocuments()
                    .stream().map(document -> {
                        Achievement achievement = document.toObject(Achievement.class);
                        achievement.setUid(document.getId());
                        return achievement;
                    }).toList();
            List<Achievement.UserAchievementUpdate> userAchievementList = new ArrayList<>();

            for (Achievement achievement : achievementList) {
                Achievement.UserAchievementUpdate userAchievement = new Achievement.UserAchievementUpdate();

                userAchievement.setUid(achievement.getUid());
                userAchievement.setProgress(0);
                userAchievement.setDateAchieved("");
                userAchievement.setHasAchieved(false);
                userAchievementList.add(userAchievement);
            }

            // Create User-Document where username will be stored
            Map<String, Object> userData = Map.of(
                "username", user.getUsername(),
                "achievements", userAchievementList
            );
            this.firestore.collection("user").document(createdUser.getUid()).set(userData);

            // Create Stats-Document where the user's stats will be stored
            Map<String, Object> statsData = Map.of(
                    "totalStations", 0,
                    "totalMinutes", 0,
                    "mostVisitedStation", "",
                    "mostUsedStartLocation", "");
            this.firestore.collection("stats").document(createdUser.getUid()).set(statsData);

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

    public ResponseEntity<String> changeUsername(String newUsername, String uid) throws InterruptedException, ExecutionException {

        if (usernameExists(newUsername)) {
            return ResponseEntity.badRequest().build();
        } else {
            DocumentReference usernameReference = this.firestore.collection("user").document(uid);
            try {
                DocumentSnapshot docuSnap = usernameReference.get().get();
                Profile profile = docuSnap.toObject(Profile.class);

                if (profile != null) {
                    String currUsername = profile.getUsername();

                    if (!currUsername.equals(newUsername)) {
                        profile.setUsername(newUsername);
                        usernameReference.set(profile);

                        return ResponseEntity.ok(newUsername);
                    } else {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
                    }
                } else {
                    return ResponseEntity.notFound().build();
                }
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        }
    }
}
