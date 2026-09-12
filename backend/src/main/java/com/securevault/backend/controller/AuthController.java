package com.securevault.backend.controller;

import com.securevault.backend.dto.AuthResponse;
import com.securevault.backend.dto.ForgotPasswordRequest;
import com.securevault.backend.dto.LoginRequest;
import com.securevault.backend.dto.RegisterRequest;
import com.securevault.backend.dto.ResetPasswordRequest;
import com.securevault.backend.dto.VerifyOtpRequest;
import com.securevault.backend.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor

public class AuthController {

    private final AuthService authService;

    // ---------------- Register ----------------

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request) {

        return ResponseEntity.ok(
                authService.register(request)
        );
    }

    // ---------------- Login ----------------

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest) {

        String ipAddress = httpRequest.getRemoteAddr();

        return ResponseEntity.ok(
                authService.login(
                        request,
                        ipAddress
                )
        );
    }

    // ---------------- Forgot Password ----------------

    @PostMapping("/forgot-password")
    public ResponseEntity<AuthResponse> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {

        return ResponseEntity.ok(
                authService.forgotPassword(request)
        );
    }

    // ---------------- Verify OTP ----------------

    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> verifyOtp(
            @Valid @RequestBody VerifyOtpRequest request) {

        return ResponseEntity.ok(
                authService.verifyOtp(request)
        );
    }

    // ---------------- Reset Password ----------------

    @PostMapping("/reset-password")
    public ResponseEntity<AuthResponse> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        return ResponseEntity.ok(
                authService.resetPassword(request)
        );
    }
}