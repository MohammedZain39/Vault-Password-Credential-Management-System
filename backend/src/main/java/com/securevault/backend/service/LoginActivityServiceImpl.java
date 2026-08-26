package com.securevault.backend.service;

import com.securevault.backend.dto.LoginActivityResponse;
import com.securevault.backend.entity.LoginActivity;
import com.securevault.backend.entity.User;
import com.securevault.backend.repository.LoginActivityRepository;
import com.securevault.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LoginActivityServiceImpl
        implements LoginActivityService {

    private final LoginActivityRepository loginActivityRepository;
    private final UserRepository userRepository;
    private final SuspiciousActivityService suspiciousActivityService;
    private final AuditLogService auditLogService;
    @Override
    public void recordLogin(
            String email,
            boolean successful,
            String ipAddress
    ) {

        User user = userRepository
                .findByEmail(email)
                .orElse(null);

        LoginActivity activity = LoginActivity.builder()
                .email(email)
                .user(user)
                .successful(successful)
                .ipAddress(ipAddress)
                .build();

        loginActivityRepository.save(activity);
        if (successful) {

            auditLogService.recordAudit(
                    email,
                    "LOGIN_SUCCESS",
                    "User logged in successfully."
            );

        } else {

            auditLogService.recordAudit(
                    email,
                    "LOGIN_FAILED",
                    "Failed login attempt."
            );
        }

        // Analyze login activity
        suspiciousActivityService.analyzeLoginAttempt(
                email,
                successful
        );
    }

    @Override
    public List<LoginActivityResponse> getMyLoginActivities() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return loginActivityRepository
                .findByUserOrderByLoginTimeDesc(user)
                .stream()
                .map(activity ->
                        LoginActivityResponse.builder()
                                .id(activity.getId())
                                .email(activity.getEmail())
                                .successful(activity.getSuccessful())
                                .loginTime(activity.getLoginTime())
                                .ipAddress(activity.getIpAddress())
                                .build()
                )
                .toList();
    }
}