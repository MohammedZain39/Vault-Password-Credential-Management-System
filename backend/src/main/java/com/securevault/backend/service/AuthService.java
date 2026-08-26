package com.securevault.backend.service;

import com.securevault.backend.dto.AuthResponse;
import com.securevault.backend.dto.ForgotPasswordRequest;
import com.securevault.backend.dto.LoginRequest;
import com.securevault.backend.dto.RegisterRequest;
import com.securevault.backend.dto.ResetPasswordRequest;
import com.securevault.backend.dto.VerifyOtpRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request, String ipAddress);

    AuthResponse forgotPassword(ForgotPasswordRequest request);

    AuthResponse verifyOtp(VerifyOtpRequest request);

    AuthResponse resetPassword(ResetPasswordRequest request);
}