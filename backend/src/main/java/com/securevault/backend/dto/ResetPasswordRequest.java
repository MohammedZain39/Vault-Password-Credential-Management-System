package com.securevault.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class ResetPasswordRequest {

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String newPassword;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}