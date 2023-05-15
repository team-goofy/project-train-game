package com.goofy.controllers;

import com.goofy.dtos.UserDTO;
import com.goofy.services.UserService;
import com.google.firebase.auth.UserRecord;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import java.net.URI;

@RestController
@AllArgsConstructor
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

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
}
