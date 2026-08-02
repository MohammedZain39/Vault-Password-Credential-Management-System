package com.securevault.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateCredentialRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String website;

    @NotBlank
    private String username;

    @NotBlank
    private String password;

    private String category;

    private String notes;

}