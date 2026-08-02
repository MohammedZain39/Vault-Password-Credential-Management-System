package com.securevault.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class CreatePinRequest {

    @NotBlank
    @Pattern(regexp = "\\d{4}", message = "PIN must contain exactly 4 digits")
    private String pin;

    public String getPin() {
        return pin;
    }

    public void setPin(String pin) {
        this.pin = pin;
    }
}