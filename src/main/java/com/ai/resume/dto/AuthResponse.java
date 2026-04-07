package com.ai.resume.dto;

import lombok.Data;

@Data
public class AuthResponse {

    private String token;
    private String message;
    private String email;
    private String fullName;

    public AuthResponse() {
    }

    public AuthResponse(String token, String message, String email, String fullName) {
        this.token = token;
        this.message = message;
        this.email = email;
        this.fullName = fullName;
    }
}
