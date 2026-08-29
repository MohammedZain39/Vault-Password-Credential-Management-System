package com.securevault.backend.service;

import com.securevault.backend.dto.SecurityAnalyticsResponse;
import com.securevault.backend.entity.LoginActivity;
import com.securevault.backend.entity.SuspiciousActivity;
import com.securevault.backend.entity.SecurityAlert;
import com.securevault.backend.entity.User;
import com.securevault.backend.repository.LoginActivityRepository;
import com.securevault.backend.repository.SuspiciousActivityRepository;
import com.securevault.backend.repository.SecurityAlertRepository;
import com.securevault.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SecurityAnalyticsServiceImpl
        implements SecurityAnalyticsService {

    private final UserRepository userRepository;

    private final LoginActivityRepository
            loginActivityRepository;

    private final SuspiciousActivityRepository
            suspiciousActivityRepository;

    private final SecurityAlertRepository
            securityAlertRepository;


    @Override
    public SecurityAnalyticsResponse
    getMySecurityAnalytics() {

        // ==========================================
        // GET LOGGED-IN USER
        // ==========================================

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email =
                authentication.getName();


        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        ));


        // ==========================================
        // LOGIN ACTIVITIES
        // ==========================================

        List<LoginActivity> loginActivities =
                loginActivityRepository
                        .findByUserOrderByLoginTimeDesc(
                                user
                        );


        long totalLogins =
                loginActivities.size();


        long successfulLogins =
                loginActivities.stream()
                        .filter(
                                LoginActivity::getSuccessful
                        )
                        .count();


        long failedLogins =
                loginActivities.stream()
                        .filter(activity ->
                                !activity.getSuccessful()
                        )
                        .count();


        // ==========================================
        // SUSPICIOUS ACTIVITIES
        // ==========================================

        long suspiciousActivities =
                suspiciousActivityRepository
                        .findByUserOrderByDetectedAtDesc(
                                user
                        )
                        .size();


        // ==========================================
        // SECURITY ALERTS
        // ==========================================

        List<SecurityAlert> alerts =
                securityAlertRepository
                        .findByUserOrderByCreatedAtDesc(
                                user
                        );


        long securityAlerts =
                alerts.size();


        long unreadAlerts =
                alerts.stream()
                        .filter(alert ->
                                "UNREAD".equals(
                                        alert.getStatus()
                                )
                        )
                        .count();


        // ==========================================
        // RETURN ANALYTICS
        // ==========================================

        return SecurityAnalyticsResponse
                .builder()
                .totalLogins(totalLogins)
                .successfulLogins(successfulLogins)
                .failedLogins(failedLogins)
                .suspiciousActivities(
                        suspiciousActivities
                )
                .securityAlerts(
                        securityAlerts
                )
                .unreadAlerts(
                        unreadAlerts
                )
                .build();
    }
}