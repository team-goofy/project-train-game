package com.goofy.controllers;

import com.goofy.dtos.UserDTO;
import com.goofy.models.Profile;
import com.goofy.services.UserService;
import com.goofy.services.UserServiceImpl;
import com.google.firebase.auth.UserRecord;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import java.net.URI;
import java.security.Principal;
import java.util.concurrent.ExecutionException;

@RestController
@AllArgsConstructor
@RequestMapping("/user")
public class UserController {

    private final UserService userService;
    private final UserServiceImpl userServiceImpl;

    @PostMapping("/register")
    public ResponseEntity<UserRecord> createUser(@RequestBody() @Valid UserDTO user) throws Exception {
        UserRecord savedUser = userService.saveUser(user);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(savedUser.getUid()).toUri();

        return ResponseEntity.created(location).body(savedUser);
    }

    @GetMapping("/username")
    public ResponseEntity<Boolean> checkUsername(@RequestParam String username) throws Exception {
        return ResponseEntity.ok(userService.usernameExists(username));
    }

    @PostMapping("/profile")
    public Profile getProfile(@RequestBody() @Valid String uid) throws InterruptedException, ExecutionException {
        return userService.getProfile(uid);
    }

    @PutMapping("/profileUsername")
    public ResponseEntity<String> updateUserName(@RequestBody() @Valid String username, Principal principal) throws Exception {
        return userService.changeUsername(username, principal.getName());
    }

    @PutMapping("/verify2FA")
    public ResponseEntity<String> verify2FA(@RequestBody() @Valid String secret, String uid) throws Exception {
        return userService.verify2FA(secret, uid);
    }
}
