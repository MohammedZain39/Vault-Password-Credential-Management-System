package com.securevault.backend.controller;

import com.securevault.backend.dto.AuthResponse;
import com.securevault.backend.dto.CreateCredentialRequest;
import com.securevault.backend.dto.CredentialResponse;
import com.securevault.backend.service.CredentialService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.securevault.backend.dto.RevealPasswordRequest;
import com.securevault.backend.dto.RevealPasswordResponse;



import java.util.List;

@RestController
@RequestMapping("/api/credentials")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class CredentialController {

    private final CredentialService credentialService;

    @PostMapping
    public ResponseEntity<AuthResponse> addCredential(
            @Valid @RequestBody CreateCredentialRequest request) {

        return ResponseEntity.ok(
                credentialService.addCredential(request)
        );
    }

    @GetMapping
    public ResponseEntity<List<CredentialResponse>> getAllCredentials() {

        return ResponseEntity.ok(
                credentialService.getAllCredentials()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<CredentialResponse> getCredential(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                credentialService.getCredential(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<AuthResponse> updateCredential(
            @PathVariable Long id,
            @Valid @RequestBody CreateCredentialRequest request) {

        return ResponseEntity.ok(
                credentialService.updateCredential(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<AuthResponse> deleteCredential(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                credentialService.deleteCredential(id)
        );
    }
    
    @PostMapping("/{id}/reveal")
    public ResponseEntity<RevealPasswordResponse> revealPassword(
            @PathVariable Long id,
            @RequestBody RevealPasswordRequest request
    ) {

        return ResponseEntity.ok(
                credentialService.revealPassword(id, request)
        );

    }

}