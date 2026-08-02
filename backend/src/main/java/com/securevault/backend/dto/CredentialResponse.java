package com.securevault.backend.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class CredentialResponse {

    private Long id;

    private String title;

    private String website;

    private String username;

    private String password;

    private String category;

    private String notes;

}