package com.ai.resume.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class UserController {

    @GetMapping("/api/user/me")
    public Map<String, Object> currentUser(Authentication authentication) {
        return Map.of(
                "message", "Protected route accessed successfully",
                "email", authentication.getName()
        );
    }
}
