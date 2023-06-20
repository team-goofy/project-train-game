package com.goofy.services;


import com.goofy.builders.User2FaTestDataBuilder;
import com.goofy.builders.UserTestDataBuilder;
import com.goofy.controllers.EmailController;
import com.goofy.models.Profile;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.auth.FirebaseAuth;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.concurrent.ExecutionException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(org.springframework.test.context.junit.jupiter.SpringExtension.class)
@SpringBootTest
class AuthenticationServiceImplTest {

    private final Firestore firestore = mock(Firestore.class);
    private final AuthenticationService authenticationService = new AuthenticationServiceImpl(firestore);

    @Test
    void verify2fa_with_valid_code(){

    }

    @Test
    void verify2fa_with_invalid_code(){

    }

    @Test
    void disable2fa_success() throws ExecutionException, InterruptedException {
        // Arrange
        String uid = "123456789";

        // Mock Firestore and its dependencies
        CollectionReference collectionReference = mock(CollectionReference.class);
        DocumentReference documentReference = mock(DocumentReference.class);
        ApiFuture<WriteResult> updateFuture = mock(ApiFuture.class);
        WriteResult writeResult = mock(WriteResult.class);

        when(firestore.collection("user")).thenReturn(collectionReference);
        when(collectionReference.document(uid)).thenReturn(documentReference);
        when(documentReference.update("secret", "", "is2FaActivated", false)).thenReturn(updateFuture);
        when(updateFuture.get()).thenReturn(writeResult);

        // Act
        ResponseEntity<String> response = authenticationService.disable2FA(uid);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(firestore, times(1)).collection("user");
        verify(collectionReference, times(1)).document(uid);
        verify(documentReference, times(1)).update("secret", "", "is2FaActivated", false);
    }





}


