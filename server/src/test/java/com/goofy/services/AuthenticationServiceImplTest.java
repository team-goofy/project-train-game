package com.goofy.services;


import com.goofy.builders.User2FaTestDataBuilder;
import com.goofy.builders.UserTestDataBuilder;
import com.goofy.controllers.EmailController;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.auth.FirebaseAuth;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.concurrent.ExecutionException;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

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
    void disable2fa()  throws ExecutionException, InterruptedException{
        // Arrange
        String uid = "123456789";
        Boolean is2FaActivated = true;

        User2FaTestDataBuilder userTestDataBuilder = new User2FaTestDataBuilder();
        Profile profile = userTestDataBuilder.buildProfile();
        Profile expectedProfile = userTestDataBuilder.buildProfile();

//        // Mock
//        CollectionReference collectionReference = mock(CollectionReference.class);
//        DocumentReference documentReference = mock(DocumentReference.class);
//        ApiFuture<DocumentSnapshot> future = mock(ApiFuture.class);
//        DocumentSnapshot snapshot = mock(DocumentSnapshot.class);
//
//        when(firestore.collection("user")).thenReturn(collectionReference);
//        when(collectionReference.document(uid)).thenReturn(documentReference);
//        when(documentReference.get()).thenReturn(future);
//        when(future.get()).thenReturn(snapshot);
//        when(snapshot.exists()).thenReturn(false);





    }
}
