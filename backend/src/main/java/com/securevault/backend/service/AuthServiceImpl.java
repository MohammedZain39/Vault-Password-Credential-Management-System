package com.securevault.backend.service;

import com.securevault.backend.dto.*;
import com.securevault.backend.entity.Role;
import com.securevault.backend.entity.User;
import com.securevault.backend.repository.UserRepository;
import com.securevault.backend.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.util.Random;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final JwtService jwtService;
    private final LoginActivityService loginActivityService;
    

    public AuthServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            EmailService emailService,
            JwtService jwtService,
            LoginActivityService loginActivityService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.jwtService = jwtService;
        this.loginActivityService = loginActivityService;
    }

    // ================= OTP Generator =================

    private String generateOtp() {

        Random random = new Random();

        return String.format(
                "%06d",
                random.nextInt(1000000)
        );
    }

    // ================= Register =================

    @Override
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {

            throw new RuntimeException(
                    "Email already registered"
            );
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )
                .role(Role.USER)
                .build();

        userRepository.save(user);

        return new AuthResponse(
                "User registered successfully"
        );
    }

    // ================= Login =================

    @Override
    public AuthResponse login(
            LoginRequest request,
            String ipAddress) {

        String email = request.getEmail();

        // Find user
        User user = userRepository
                .findByEmail(email)
                .orElse(null);

        // =========================
        // EMAIL NOT FOUND
        // =========================

        if (user == null) {

            loginActivityService.recordLogin(
                    email,
                    false,
                    ipAddress
            );

            throw new RuntimeException(
                    "Invalid email or password"
            );
        }

        // =========================
        // WRONG PASSWORD
        // =========================

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            loginActivityService.recordLogin(
                    email,
                    false,
                    ipAddress
            );

            throw new RuntimeException(
                    "Invalid email or password"
            );
        }

        // =========================
        // SUCCESSFUL LOGIN
        // =========================

        loginActivityService.recordLogin(
                email,
                true,
                ipAddress
        );

        String token =
                jwtService.generateToken(
                        user.getEmail()
                );

        return new AuthResponse(
                "Login successful",
                token
        );
    }

    // ================= Forgot Password =================

    @Override
    public AuthResponse forgotPassword(
            ForgotPasswordRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException(
                                "No account found with this email"
                        ));

        String otp = generateOtp();

        // Store hashed OTP
        user.setOtp(
                passwordEncoder.encode(otp)
        );

        user.setOtpExpiry(
                LocalDateTime.now().plusMinutes(5)
        );

        user.setOtpVerified(false);

        userRepository.save(user);

        // Send original OTP via email
        emailService.sendOtpEmail(
                user.getEmail(),
                otp
        );

        return new AuthResponse(
                "OTP sent successfully"
        );
    }

    // ================= Verify OTP =================

    @Override
    public AuthResponse verifyOtp(
            VerifyOtpRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invalid email"
                        ));

        if (user.getOtp() == null) {

            throw new RuntimeException(
                    "OTP not generated"
            );
        }

        if (user.getOtpExpiry()
                .isBefore(LocalDateTime.now())) {

            throw new RuntimeException(
                    "OTP has expired"
            );
        }

        // Compare hashed OTP
        if (!passwordEncoder.matches(
                request.getOtp(),
                user.getOtp())) {

            throw new RuntimeException(
                    "Invalid OTP"
            );
        }

        user.setOtpVerified(true);

        userRepository.save(user);

        return new AuthResponse(
                "OTP verified successfully"
        );
    }

    // ================= Reset Password =================

    @Override
    public AuthResponse resetPassword(
            ResetPasswordRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invalid email"
                        ));

        if (!Boolean.TRUE.equals(
                user.getOtpVerified())) {

            throw new RuntimeException(
                    "Please verify OTP first."
            );
        }

        user.setPassword(
                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );

        // Clear OTP data
        user.setOtp(null);
        user.setOtpExpiry(null);
        user.setOtpVerified(false);

        userRepository.save(user);

        return new AuthResponse(
                "Password reset successfully"
        );
    }
}