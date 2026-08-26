package com.securevault.backend.service;

import com.securevault.backend.dto.SecurityAlertResponse;
import com.securevault.backend.entity.SecurityAlert;
import com.securevault.backend.entity.SuspiciousActivity;
import com.securevault.backend.entity.User;
import com.securevault.backend.repository.SecurityAlertRepository;
import com.securevault.backend.repository.SuspiciousActivityRepository;
import com.securevault.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SecurityAlertServiceImpl
        implements SecurityAlertService {

    private final SecurityAlertRepository securityAlertRepository;
    private final SuspiciousActivityRepository suspiciousActivityRepository;
    private final UserRepository userRepository;

    @Override
    public void createAlertForSuspiciousActivity(
            Long suspiciousActivityId) {

        SuspiciousActivity activity =
                suspiciousActivityRepository
                        .findById(suspiciousActivityId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Suspicious activity not found"
                                ));

        User user = activity.getUser();

        SecurityAlert alert =
                SecurityAlert.builder()
                        .user(user)
                        .alertType(
                                activity.getActivityType()
                        )
                        .message(
                                activity.getDescription()
                        )
                        .severity("HIGH")
                        .status("UNREAD")
                        .build();

        securityAlertRepository.save(alert);
    }

    @Override
    public List<SecurityAlertResponse> getMyAlerts() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        ));

        return securityAlertRepository
                .findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(alert ->
                        SecurityAlertResponse.builder()
                                .id(alert.getId())
                                .alertType(
                                        alert.getAlertType()
                                )
                                .message(
                                        alert.getMessage()
                                )
                                .severity(
                                        alert.getSeverity()
                                )
                                .status(
                                        alert.getStatus()
                                )
                                .createdAt(
                                        alert.getCreatedAt()
                                )
                                .build()
                )
                .toList();
    }
}