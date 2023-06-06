package com.goofy.services;

import com.goofy.dtos.UserDTO;
import com.goofy.models.Profile;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

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
//        Mockito.when(userService.changeUsername(userName, uid)).thenReturn(ResponseEntity.ok().build());
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
    void can_not_change_username_to_existing_username() throws InterruptedException, ExecutionException {
        // Arrange
        String existingUsername = "existingUser";
        String newUsername = existingUsername;
        String uid = "123456789";

        // Set up the mock behavior
        Mockito.when(userService.usernameExists(newUsername)).thenReturn(true);
        Mockito.when(userService.changeUsername(newUsername, uid)).thenReturn(ResponseEntity.badRequest().build());

        // Act
        ResponseEntity<String> response = userService.changeUsername(newUsername, uid);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void can_change_username_when_username_does_not_exist() throws InterruptedException, ExecutionException {
        // Arrange
        String existingUsername = "existingUser";
        String newUsername = "newUsername";
        String uid = "123456789";

        // Set up the mock behavior
        Mockito.when(userService.usernameExists(newUsername)).thenReturn(false);
        Mockito.when(userService.changeUsername(newUsername, uid)).thenReturn(ResponseEntity.ok(newUsername));

        // Act
        ResponseEntity<String> response = userService.changeUsername(newUsername, uid);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(newUsername, response.getBody());
    }

    @Test
    void can_not_change_username_to_empty() throws InterruptedException, ExecutionException {
        // Arrange
        String existingUsername = "existingUser";
        String newUsername = "";
        String uid = "123456789";

        // Set up the mock behavior
        Mockito.when(userService.changeUsername(newUsername, uid)).thenReturn(ResponseEntity.badRequest().build());

        // Act
        ResponseEntity<String> response = userService.changeUsername(newUsername, uid);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void can_add_username_with_unconventional_characters() throws InterruptedException, ExecutionException {
        // Arrange
        String newUsername = "ユーザー名";
        String uid = "123456789";

        // Set up the mock behavior
        Mockito.when(userService.usernameExists(newUsername)).thenReturn(false);
        Mockito.when(userService.changeUsername(newUsername, uid)).thenReturn(ResponseEntity.ok(newUsername));

        // Act
        ResponseEntity<String> response = userService.changeUsername(newUsername, uid);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(newUsername, response.getBody());
    }


}
