package com.securevault.backend.controller;

import com.securevault.backend.dto.AuthResponse;
import com.securevault.backend.dto.CreatePinRequest;
import com.securevault.backend.dto.VerifyPinRequest;
import com.securevault.backend.service.VaultService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.securevault.backend.dto.VaultStatusResponse;

@RestController
@RequestMapping("/api/vault")
@RequiredArgsConstructor
public class VaultController {

    private final VaultService vaultService;

    @PostMapping("/create-pin")
    public ResponseEntity<AuthResponse> createPin(
            @Valid @RequestBody CreatePinRequest request
    ) {
        return ResponseEntity.ok(vaultService.createPin(request));
    }

    @PostMapping("/verify-pin")
    public ResponseEntity<AuthResponse> verifyPin(
            @Valid @RequestBody VerifyPinRequest request
    ) {
        return ResponseEntity.ok(vaultService.verifyPin(request));
    }
    @GetMapping("/status")
    public ResponseEntity<VaultStatusResponse> getVaultStatus() {

        return ResponseEntity.ok(
                vaultService.getVaultStatus()
        );

    }
}