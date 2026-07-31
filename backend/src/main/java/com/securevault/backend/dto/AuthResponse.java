package com.securevault.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String message;

    // Add this single-parameter constructor manually if not using Lombok
    public AuthResponse(String message) {
        this.message = message;
    }
}