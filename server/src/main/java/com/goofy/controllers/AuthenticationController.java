package com.goofy.controllers;

import com.goofy.services.AuthenticationService;
import com.goofy.services.AuthenticationServiceImpl;
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

    private final AuthenticationService authService;
    private final AuthenticationServiceImpl authServiceImpl;
    @PutMapping("/verify2FA")
    public ResponseEntity<String> verify2FA(@RequestBody @Valid Map<String, String> requestBody, Principal principal) throws Exception {
        String secret = requestBody.get("secret");
        String code = requestBody.get("code");

        return authService.verify2FA(secret, code, principal.getName());
    }

    @PutMapping("/disable2FA")
    public ResponseEntity<String> disable2FA(@RequestBody() String uid) throws Exception {
        return authService.disable2FA(uid);
    }
}
