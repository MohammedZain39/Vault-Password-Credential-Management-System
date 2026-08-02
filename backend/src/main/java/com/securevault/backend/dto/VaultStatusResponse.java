package com.securevault.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class VaultStatusResponse {

    private boolean hasPin;

}