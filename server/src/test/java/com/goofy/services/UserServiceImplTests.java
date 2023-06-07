package com.goofy.services;

import com.goofy.builders.UserTestDataBuilder;
import com.goofy.controllers.EmailController;
import com.goofy.dtos.UserDTO;
import com.goofy.exceptions.UsernameExistsException;
import com.goofy.models.Profile;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.UserRecord;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Map;
import java.util.concurrent.ExecutionException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;


@ExtendWith(org.springframework.test.context.junit.jupiter.SpringExtension.class)
@SpringBootTest
class UserServiceImplTests {

    private final Firestore firestore = mock(Firestore.class);
    private final FirebaseAuth firebaseAuth = mock(FirebaseAuth.class);
    private final EmailController emailController = mock(EmailController.class);
    private final UserService userService = new UserServiceImpl(emailController, firebaseAuth, firestore);

    // get profile tests
    @Test
    void can_get_user_profile() throws ExecutionException, InterruptedException {
        // Arrange
        String uid = "123456789";
        UserTestDataBuilder userTestDataBuilder = new UserTestDataBuilder();
        Profile profile = userTestDataBuilder.buildProfile();
        Profile expectedProfile = userTestDataBuilder.buildProfile();

        // Mock
        CollectionReference collectionReference = mock(CollectionReference.class);
        DocumentReference documentReference = mock(DocumentReference.class);
        ApiFuture<DocumentSnapshot> future = mock(ApiFuture.class);
        DocumentSnapshot snapshot = mock(DocumentSnapshot.class);

        when(firestore.collection("user")).thenReturn(collectionReference);
        when(collectionReference.document(uid)).thenReturn(documentReference);
        when(documentReference.get()).thenReturn(future);
        when(future.get()).thenReturn(snapshot);
        when(snapshot.toObject(Profile.class)).thenReturn(expectedProfile);

        // Act
        Profile result = userService.getProfile(uid);

        // Assert
        assertEquals(expectedProfile.getUsername(), result.getUsername());
        verify(firestore, times(1)).collection("user");
        verify(collectionReference, times(1)).document(uid);
        verify(documentReference, times(1)).get();
    }

    @Test
    void can_not_get_profile_when_user_not_existing() throws ExecutionException, InterruptedException {
        // Arrange
        String uid = "123456789";
        UserTestDataBuilder userTestDataBuilder = new UserTestDataBuilder();
        Profile profile = userTestDataBuilder.buildProfile();
        Profile expectedProfile = userTestDataBuilder.buildProfile();

        // Mock
        CollectionReference collectionReference = mock(CollectionReference.class);
        DocumentReference documentReference = mock(DocumentReference.class);
        ApiFuture<DocumentSnapshot> future = mock(ApiFuture.class);
        DocumentSnapshot snapshot = mock(DocumentSnapshot.class);

        when(firestore.collection("user")).thenReturn(collectionReference);
        when(collectionReference.document(uid)).thenReturn(documentReference);
        when(documentReference.get()).thenReturn(future);
        when(future.get()).thenReturn(snapshot);
        when(snapshot.exists()).thenReturn(false);

        // Act
        Profile result = userService.getProfile(uid);

        // Assert
        assertNull(result);
        verify(firestore, times(1)).collection("user");
        verify(collectionReference, times(1)).document(uid);
        verify(documentReference, times(1)).get();
    }

    // change username tests
    @Test
    void can_not_change_username_to_existing_username() throws InterruptedException, ExecutionException {
        // Arrange
        String existingUsername = "existingUser";
        String newUsername = existingUsername;
        String uid = "123456789";
        UserTestDataBuilder userTestDataBuilder = new UserTestDataBuilder();
        Profile profile = userTestDataBuilder.buildProfile();
        Profile expectedProfile = userTestDataBuilder.buildProfile();

        // Mock
        CollectionReference collectionReference = mock(CollectionReference.class);
        when(firestore.collection("user")).thenReturn(collectionReference);
        Query query = mock(Query.class);
        when(collectionReference.whereEqualTo("username", existingUsername)).thenReturn(query);
        ApiFuture<QuerySnapshot> future = mock(ApiFuture.class);
        when(query.get()).thenReturn(future);
        QuerySnapshot snapshot = mock(QuerySnapshot.class);
        when(future.get()).thenReturn(snapshot);
        when(snapshot.isEmpty()).thenReturn(false);

        // Act
        ResponseEntity<String> response = userService.changeUsername(newUsername, uid);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void can_change_username_when_username_does_not_exist() throws ExecutionException, InterruptedException {
        // Arrange
        String existingUsername = "existingUser";
        String newUsername = existingUsername;
        String uid = "123456789";
        UserTestDataBuilder userTestDataBuilder = new UserTestDataBuilder();
        Profile profile = userTestDataBuilder.buildProfile();

        // Mock
        CollectionReference collectionReference = mock(CollectionReference.class);
        when(firestore.collection("user")).thenReturn(collectionReference);
        DocumentReference documentReference = mock(DocumentReference.class);
        when(collectionReference.document(uid)).thenReturn(documentReference);
        ApiFuture<DocumentSnapshot> future = mock(ApiFuture.class);
        DocumentSnapshot snapshot = mock(DocumentSnapshot.class);
        when(documentReference.get()).thenReturn(future);
        when(future.get()).thenReturn(snapshot);
        when(snapshot.exists()).thenReturn(true);
        when(snapshot.toObject(Profile.class)).thenReturn(profile);
        when(documentReference.set(any(Profile.class))).thenReturn(null);

        Query query = mock(Query.class);
        when(collectionReference.whereEqualTo("username", existingUsername)).thenReturn(query);
        ApiFuture<QuerySnapshot> queryFuture = mock(ApiFuture.class);
        when(query.get()).thenReturn(queryFuture);
        QuerySnapshot querySnapshot = mock(QuerySnapshot.class);
        when(queryFuture.get()).thenReturn(querySnapshot);
        when(querySnapshot.isEmpty()).thenReturn(true);

        // Act
        ResponseEntity<String> response = userService.changeUsername(newUsername, uid);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(newUsername, response.getBody());

    }

    @Test
    void can_not_change_username_to_empty() throws InterruptedException, ExecutionException {
        // Arrange
        String newUsername = "";
        String uid = "123456789";

        // Mock UserService
        UserService userService = mock(UserService.class);

        // Set up the mock behavior
        ResponseEntity<String> badRequestResponse = ResponseEntity.badRequest().build();
        when(userService.changeUsername(eq(newUsername), eq(uid))).thenReturn(badRequestResponse);

        // Act
        ResponseEntity<String> response = userService.changeUsername(newUsername, uid);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        verify(userService).changeUsername(eq(newUsername), eq(uid));
    }

    @Test
    void can_add_username_with_unconventional_characters() throws InterruptedException, ExecutionException {
        // Arrange
        String existingUsername = "ユーザー名";
        String newUsername = existingUsername;
        String uid = "123456789";
        UserTestDataBuilder userTestDataBuilder = new UserTestDataBuilder();
        Profile profile = userTestDataBuilder.buildProfile();

        // Mock
        CollectionReference collectionReference = mock(CollectionReference.class);
        when(firestore.collection("user")).thenReturn(collectionReference);
        DocumentReference documentReference = mock(DocumentReference.class);
        when(collectionReference.document(uid)).thenReturn(documentReference);
        ApiFuture<DocumentSnapshot> future = mock(ApiFuture.class);
        DocumentSnapshot snapshot = mock(DocumentSnapshot.class);
        when(documentReference.get()).thenReturn(future);
        when(future.get()).thenReturn(snapshot);
        when(snapshot.exists()).thenReturn(true);
        when(snapshot.toObject(Profile.class)).thenReturn(profile);
        when(documentReference.set(any(Profile.class))).thenReturn(null);

        Query query = mock(Query.class);
        when(collectionReference.whereEqualTo("username", existingUsername)).thenReturn(query);
        ApiFuture<QuerySnapshot> queryFuture = mock(ApiFuture.class);
        when(query.get()).thenReturn(queryFuture);
        QuerySnapshot querySnapshot = mock(QuerySnapshot.class);
        when(queryFuture.get()).thenReturn(querySnapshot);
        when(querySnapshot.isEmpty()).thenReturn(true);

        // Act
        ResponseEntity<String> response = userService.changeUsername(newUsername, uid);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(newUsername, response.getBody());
    }

    @Test
    public void saveUser_existingUsername_throwsUsernameExistException() throws Exception {
        // Arrange
        UserDTO user = new UserDTO();
        user.setUsername("testUsername");
        user.setEmail("test@example.com");
        user.setPassword("testPassword");

        // Mock
        // Check if username exists
        CollectionReference collectionReference = mock(CollectionReference.class);
        when(firestore.collection("user")).thenReturn(collectionReference);
        Query query = mock(Query.class);
        when(collectionReference.whereEqualTo("username", user.getUsername())).thenReturn(query);
        ApiFuture<QuerySnapshot> future = mock(ApiFuture.class);
        when(query.get()).thenReturn(future);
        QuerySnapshot snapshot = mock(QuerySnapshot.class);
        when(future.get()).thenReturn(snapshot);
        when(snapshot.isEmpty()).thenReturn(false);

        // Create the user
        UserRecord createdUser = mock(UserRecord.class);
        when(firebaseAuth.createUser(any(UserRecord.CreateRequest.class))).thenReturn(createdUser);

        // Assert & Act
        assertThrows(UsernameExistsException.class, () -> this.userService.saveUser(user));
        verify(firestore, times(1)).collection("user");
        verify(collectionReference, times(1)).whereEqualTo("username", user.getUsername());
        verify(query, times(1)).get();
        verify(future, times(1)).get();
        verify(snapshot, times(1)).isEmpty();
        verifyNoInteractions(firebaseAuth);
    }

    @Test
    public void saveUser_validUser_returnsCreatedUser() throws Exception {
        // Arrange
        UserDTO user = new UserDTO();
        user.setUsername("testUsername");
        user.setEmail("test@example.com");
        user.setPassword("testPassword");

        // Mock
        // Check if username exists
        CollectionReference collectionReference = mock(CollectionReference.class);
        when(firestore.collection("user")).thenReturn(collectionReference);
        Query query = mock(Query.class);
        when(collectionReference.whereEqualTo("username", user.getUsername())).thenReturn(query);
        ApiFuture<QuerySnapshot> future = mock(ApiFuture.class);
        when(query.get()).thenReturn(future);
        QuerySnapshot snapshot = mock(QuerySnapshot.class);
        when(future.get()).thenReturn(snapshot);
        when(snapshot.isEmpty()).thenReturn(true);

        // Create the user
        UserRecord createdUser = mock(UserRecord.class);
        when(firebaseAuth.createUser(any(UserRecord.CreateRequest.class))).thenReturn(createdUser);
        when(firestore.collection("user")).thenReturn(collectionReference);
        DocumentReference documentReference = mock(DocumentReference.class);
        when(collectionReference.document(createdUser.getUid())).thenReturn(documentReference);
        ApiFuture<WriteResult> writeResultApiFuture = mock(ApiFuture.class);
        when(documentReference.set(any(Map.class))).thenReturn(writeResultApiFuture);

        // Create Stats-Document where the user's stats will be stored
        CollectionReference statsCollectionReference = mock(CollectionReference.class);
        when(firestore.collection("stats")).thenReturn(statsCollectionReference);
        DocumentReference statsDocumentReference = mock(DocumentReference.class);
        when(statsCollectionReference.document(createdUser.getUid())).thenReturn(statsDocumentReference);
        ApiFuture<WriteResult> statsWriteResultApiFuture = mock(ApiFuture.class);
        when(statsDocumentReference.set(any(Map.class))).thenReturn(statsWriteResultApiFuture);

        // Send email verification
        when(emailController.sendEmailVerification(user.getEmail())).thenReturn(null);

        // Act
        UserRecord result = userService.saveUser(user);

        // Assert
        assertEquals(createdUser, result);
        verify(firestore, times(2)).collection("user");
        verify(collectionReference, times(1)).whereEqualTo("username", user.getUsername());
        verify(firebaseAuth, times(1)).createUser(any(UserRecord.CreateRequest.class));
        verify(collectionReference, times(1)).document(createdUser.getUid());
        verify(firestore, times(1)).collection("stats");
        verify(statsCollectionReference, times(1)).document(createdUser.getUid());
        verify(statsDocumentReference, times(1)).set(any(Map.class));
        verify(emailController, times(1)).sendEmailVerification(user.getEmail());
    }

    @Test
    public void usernameExists_existingUsername_returnsTrue() throws ExecutionException, InterruptedException {
        // Arrange
        String username = "testUsername";

        // Mock
        CollectionReference collectionReference = mock(CollectionReference.class);
        when(firestore.collection("user")).thenReturn(collectionReference);
        Query query = mock(Query.class);
        when(collectionReference.whereEqualTo("username", username)).thenReturn(query);
        ApiFuture<QuerySnapshot> future = mock(ApiFuture.class);
        when(query.get()).thenReturn(future);
        QuerySnapshot snapshot = mock(QuerySnapshot.class);
        when(future.get()).thenReturn(snapshot);
        when(snapshot.isEmpty()).thenReturn(false);

        // Act
        boolean usernameExists = this.userService.usernameExists(username);

        // Assert
        assertTrue(usernameExists);
        verify(firestore, times(1)).collection("user");
        verify(collectionReference, times(1)).whereEqualTo("username", username);
    }

    @Test
    public void usernameExists_nonExistingUsername_returnsFalse() throws ExecutionException, InterruptedException {
        // Arrange
        String username = "testUsername";

        // Mock
        CollectionReference collectionReference = mock(CollectionReference.class);
        when(firestore.collection("user")).thenReturn(collectionReference);
        Query query = mock(Query.class);
        when(collectionReference.whereEqualTo("username", username)).thenReturn(query);
        ApiFuture<QuerySnapshot> future = mock(ApiFuture.class);
        when(query.get()).thenReturn(future);
        QuerySnapshot snapshot = mock(QuerySnapshot.class);
        when(future.get()).thenReturn(snapshot);
        when(snapshot.isEmpty()).thenReturn(true);

        // Act
        boolean usernameExists = this.userService.usernameExists(username);

        // Assert
        assertFalse(usernameExists);
        verify(firestore, times(1)).collection("user");
        verify(collectionReference, times(1)).whereEqualTo("username", username);
    }
}
