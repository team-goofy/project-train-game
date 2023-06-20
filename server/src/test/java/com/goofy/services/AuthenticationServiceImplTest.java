package com.goofy.services;


import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
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
    void verify2FA_with_validCode() throws ExecutionException, InterruptedException {
        // Arrange
        String secret = "SROZTAFQGXTARUUZ";
        String code = "690700"; //input the authenticator code here
        String uid = "123456789";

        // Mock Firestore and its dependencies
        DocumentReference userReference = mock(DocumentReference.class);
        CollectionReference collectionReference = mock(CollectionReference.class);

        when(firestore.collection("user")).thenReturn(collectionReference);
        when(collectionReference.document(uid)).thenReturn(userReference);
        when(userReference.update("secret", secret, "is2FaActivated", true)).thenReturn(mock(ApiFuture.class));

        // Act
        ResponseEntity<String> response = authenticationService.verify2FA(secret, code, uid);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("2FA activated", response.getBody());
        // Additional assertions or verifications as needed
        verify(firestore, times(1)).collection("user");
        verify(collectionReference, times(1)).document(uid);
        verify(userReference, times(1)).update("secret", secret, "is2FaActivated", true);
    }


    @Test
    void verify2fa_with_invalid_code() throws ExecutionException, InterruptedException {
        // Arrange
        String secret = "SROZTAFQGXTARUUZ";
        String code = "559990";
        String uid = "123456789";

        // Mock Firestore and its dependencies
        DocumentReference userReference = mock(DocumentReference.class);
        CollectionReference collectionReference = mock(CollectionReference.class);

        when(firestore.collection("user")).thenReturn(collectionReference);
        when(collectionReference.document(uid)).thenReturn(userReference);
        when(userReference.update("secret", secret, "is2FaActivated", true)).thenReturn(mock(ApiFuture.class));

        // Act
        ResponseEntity<String> response = authenticationService.verify2FA(secret, code, uid);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Invalid verification code", response.getBody());
    }

    @Test
    void verify2fa_with_invalid_secret() throws ExecutionException, InterruptedException {
        // Arrange
        String secret = "INVALID_SECRET";
        String code = "559990";
        String uid = "123456789";

        // Mock Firestore and its dependencies
        DocumentReference userReference = mock(DocumentReference.class);
        CollectionReference collectionReference = mock(CollectionReference.class);

        when(firestore.collection("user")).thenReturn(collectionReference);
        when(collectionReference.document(uid)).thenReturn(userReference);
        when(userReference.update("secret", secret, "is2FaActivated", true)).thenReturn(mock(ApiFuture.class));

        // Act
        ResponseEntity<String> response = authenticationService.verify2FA(secret, code, uid);

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
    }

    @Test
    void verify2fa_with_emptyCode() throws ExecutionException, InterruptedException {
        // Arrange
        String secret = "SROZTAFQGXTARUUZ";
        String code = "";
        String uid = "123456789";

        // Mock Firestore and its dependencies
        DocumentReference userReference = mock(DocumentReference.class);
        CollectionReference collectionReference = mock(CollectionReference.class);

        when(firestore.collection("user")).thenReturn(collectionReference);
        when(collectionReference.document(uid)).thenReturn(userReference);
        when(userReference.update("secret", secret, "is2FaActivated", true)).thenReturn(mock(ApiFuture.class));

        // Act
        ResponseEntity<String> response = authenticationService.verify2FA(secret, code, uid);

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
    }

    @Test
    void verify2fa_with_NULLcode() throws ExecutionException, InterruptedException {
        // Arrange
        String secret = "SROZTAFQGXTARUUZ";
        String code = null;
        String uid = "123456789";

        // Mock Firestore and its dependencies
        DocumentReference userReference = mock(DocumentReference.class);
        CollectionReference collectionReference = mock(CollectionReference.class);

        when(firestore.collection("user")).thenReturn(collectionReference);
        when(collectionReference.document(uid)).thenReturn(userReference);
        when(userReference.update("secret", secret, "is2FaActivated", true)).thenReturn(mock(ApiFuture.class));

        // Act
        ResponseEntity<String> response = authenticationService.verify2FA(secret, code, uid);

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
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


