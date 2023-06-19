package com.goofy.services;

import com.goofy.security.CustomTotp;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.auth.FirebaseAuth;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutionException;

@Service
@AllArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService{
    private final Firestore firestore;

    public ResponseEntity<String> verify2FA(String secret, String code, String uid) {
        try {
            CustomTotp totp = new CustomTotp(secret);
            if (totp.verify(code, 2, 2).isValid()) {
                DocumentReference userReference = this.firestore.collection("user").document(uid);
                userReference.update("secret", secret, "is2FaActivated", true);

                return ResponseEntity.ok("2FA activated");
            }
            return ResponseEntity.badRequest().body("Invalid verification code");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred. Please try again later.");
        }
    }


    public ResponseEntity<String> disable2FA(String uid) throws InterruptedException, ExecutionException {
        DocumentReference userReference = this.firestore.collection("user").document(uid);
        userReference.update("secret", "", "is2FaActivated", false);

        return ResponseEntity.ok("2FA disabled");
    }
}
