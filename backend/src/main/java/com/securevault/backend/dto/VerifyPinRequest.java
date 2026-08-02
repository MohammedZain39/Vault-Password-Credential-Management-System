package com.securevault.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class VerifyPinRequest {

    @NotBlank
    private String pin;

    public String getPin() {
        return pin;
    }

    public void setPin(String pin) {
        this.pin = pin;
    }
}