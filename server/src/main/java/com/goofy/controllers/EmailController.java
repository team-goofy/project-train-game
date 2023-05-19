package com.goofy.controllers;

import com.goofy.services.EmailService;
import com.google.firebase.auth.ActionCodeSettings;
import com.google.firebase.auth.FirebaseAuth;
import jakarta.transaction.Transactional;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@Transactional
@RequestMapping("/mail")
public class EmailController {
    private final Environment env;

    private final EmailService emailService;
    private final FirebaseAuth firebaseAuth;

    public EmailController(Environment env, EmailService emailService, FirebaseAuth firebaseAuth) {
        this.env = env;
        this.emailService = emailService;
        this.firebaseAuth = firebaseAuth;
    }

    @PostMapping("/send-verification")
    public ResponseEntity<String> sendEmailVerification(@RequestBody String email) throws Exception {
        String subject = "WanderTrains - Verify your email";

        ActionCodeSettings actionCodeSettings = ActionCodeSettings.builder()
                .setUrl(env.getProperty("angular.base.url") + "login")
                .build();

        String verificationLink = this.firebaseAuth.generateEmailVerificationLink(email, actionCodeSettings);

        String messageText =
                "Dear WanderTrain-user,\n\n" +

                "In order to get access to your account and play the train game, follow this link below to verify your email. \n\n" +
                verificationLink + "\n\n" +

                "Kind regards, \n" +
                "WanderTrains";

        emailService.sendEmail(email, subject, messageText);
        return new ResponseEntity<>("Verification mail send successfully", HttpStatus.OK);
    }
}
