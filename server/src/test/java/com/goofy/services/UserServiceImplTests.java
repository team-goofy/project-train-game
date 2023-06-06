package com.goofy.services;

import com.goofy.controllers.EmailController;
import com.goofy.dtos.UserDTO;
import com.goofy.models.Profile;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.auth.FirebaseAuth;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.concurrent.ExecutionException;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(org.springframework.test.context.junit.jupiter.SpringExtension.class)
@SpringBootTest
class UserServiceImplTests {
    @MockBean
    private UserServiceImpl userService;

    @BeforeEach
    public void setup() throws ExecutionException, InterruptedException {
        String userName = "mandylbbh";
        String email = "test@test.nl";
        String password = "password";
        String uid = "123456789";

        UserDTO user = UserDTO.builder()
                .username(userName)
                .email(email)
                .password(password)
                .build();

        Profile profile = new Profile();
        profile.setUsername(user.getUsername());

//        Mockito.when(userService.save(Mockito.any(User.class))).thenReturn(user);
        Mockito.when(userService.getProfile(uid)).thenReturn(profile);
        Mockito.when(userService.usernameExists(userName)).thenReturn(true);
    }

    // check username tests
    @Test
    void check_if_username_exists() throws ExecutionException, InterruptedException {
        // Arrange
        String username = "mandylbbh";
        boolean expectedExists = true;

        // Act
        boolean exists = userService.usernameExists(username);

        // Assert
        assertEquals(expectedExists, exists);
    }

    @Test
    void check_if_username_does_not_exist() throws ExecutionException, InterruptedException {
        // Arrange
        String username = "mandylbbh17";
        boolean expectedExists = false;

        // Act
        boolean exists = userService.usernameExists(username);

        // Assert
        assertEquals(expectedExists, exists);
    }

    //Save user tests
    @Test
    void can_save_correct_user(){

    }

    @Test
    void can_not_save_user_with_existing_username(){

    }

    @Test
    void can_not_save_user_without_username(){

    }

    @Test
    void can_not_save_user_with_existing_email(){

    }

    @Test
    void can_not_save_user_without_email(){

    }

    @Test
    void can_not_save_user_with_faulty_password(){

    }

    @Test
    void can_not_save_user_without_password(){

    }

    // get profile tests
    @Test
    void can_get_user_profile() throws ExecutionException, InterruptedException {
        // Arrange
        String uid = "123456789";
        String expectedUsername = "mandylbbh";

        // Act
        Profile result = userService.getProfile(uid);

        // Assert
        assertEquals(expectedUsername, result.getUsername());
    }

    @Test
    void can_not_get_profile_when_user_not_existing() throws ExecutionException, InterruptedException {
        // Arrange
        String uid = "nonexistinguid";

        // Act
        Profile result = userService.getProfile(uid);

        // Assert
        assertNull(result);
    }


    // change username tests
    @Test
    void can_not_change_username_to_existing_username(){

    }

    @Test
    void can_change_username_to_non_existing_username(){

    }

    @Test
    void can_not_change_username_to_empty(){

    }

    @Test
    void can_add_username_with_unconventional_characters(){
        //like japanese
    }


}
