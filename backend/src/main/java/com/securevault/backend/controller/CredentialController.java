package com.securevault.backend.controller;

import com.securevault.backend.dto.AuthResponse;
import com.securevault.backend.dto.CreateCredentialRequest;
import com.securevault.backend.dto.CredentialResponse;
import com.securevault.backend.dto.RevealPasswordRequest;
import com.securevault.backend.dto.RevealPasswordResponse;
import com.securevault.backend.dto.SharedCredentialResponse;
import com.securevault.backend.entity.PermissionLevel;
import com.securevault.backend.service.CredentialService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/credentials")
@RequiredArgsConstructor

public class CredentialController {

    private final CredentialService credentialService;


    // ==========================
    // ADD CREDENTIAL
    // ==========================

    @PostMapping
    public ResponseEntity<AuthResponse> addCredential(
            @Valid @RequestBody CreateCredentialRequest request) {

        return ResponseEntity.ok(
                credentialService.addCredential(request)
        );
    }


    // ==========================
    // GET ALL CREDENTIALS
    // ==========================

    @GetMapping
    public ResponseEntity<List<CredentialResponse>> getAllCredentials() {

        return ResponseEntity.ok(
                credentialService.getAllCredentials()
        );
    }


    // ==========================
    // GET SHARED CREDENTIALS
    // IMPORTANT: Keep this BEFORE /{id}
    // ==========================

    @GetMapping("/shared")
    public ResponseEntity<List<SharedCredentialResponse>> getSharedCredentials() {

        return ResponseEntity.ok(
                credentialService.getSharedCredentials()
        );
    }


    // ==========================
    // GET ONE CREDENTIAL
    // ==========================

    @GetMapping("/{id}")
    public ResponseEntity<CredentialResponse> getCredential(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                credentialService.getCredential(id)
        );
    }


    // ==========================
    // UPDATE CREDENTIAL
    // ==========================

    @PutMapping("/{id}")
    public ResponseEntity<AuthResponse> updateCredential(
            @PathVariable Long id,
            @Valid @RequestBody CreateCredentialRequest request) {

        return ResponseEntity.ok(
                credentialService.updateCredential(id, request)
        );
    }


    // ==========================
    // DELETE CREDENTIAL
    // ==========================

    @DeleteMapping("/{id}")
    public ResponseEntity<AuthResponse> deleteCredential(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                credentialService.deleteCredential(id)
        );
    }


    // ==========================
    // REVEAL PASSWORD
    // ==========================

    @PostMapping("/{id}/reveal")
    public ResponseEntity<RevealPasswordResponse> revealPassword(
            @PathVariable Long id,
            @RequestBody RevealPasswordRequest request) {

        return ResponseEntity.ok(
                credentialService.revealPassword(id, request)
        );
    }


    // ==========================
    // SHARE CREDENTIAL
    // ==========================

    @PostMapping("/{id}/share")
    public ResponseEntity<AuthResponse> shareCredential(
            @PathVariable Long id,
            @RequestParam String email,
            @RequestParam(required = false) LocalDateTime expiresAt,
            @RequestParam(required = false) PermissionLevel permissionLevel) {

        return ResponseEntity.ok(
                credentialService.shareCredential(
                        id,
                        email,
                        expiresAt,
                        permissionLevel
                )
        );
    }

}