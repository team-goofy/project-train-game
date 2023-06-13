package com.goofy.controllers;

import com.goofy.services.UserService;
import com.goofy.services.UserServiceImpl;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.Map;

@RestController
@AllArgsConstructor
@RequestMapping("/auth")
public class AuthenticationController {

    private final UserService userService;
    private final UserServiceImpl userServiceImpl;
    @PutMapping("/verify2FA")
    public ResponseEntity<String> verify2FA(@RequestBody @Valid Map<String, String> requestBody, Principal principal) throws Exception {
        String secret = requestBody.get("secret");
        String code = requestBody.get("code");

        return userService.verify2FA(secret, code, principal.getName());
    }

    @PutMapping("/disable2FA")
    public ResponseEntity<String> disable2FA(@RequestBody() String uid) throws Exception {
        return userService.disable2FA(uid);
    }
}
