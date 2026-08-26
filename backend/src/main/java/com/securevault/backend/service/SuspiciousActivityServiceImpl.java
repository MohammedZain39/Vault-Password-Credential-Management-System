package com.securevault.backend.service;

import com.securevault.backend.dto.SuspiciousActivityResponse;
import com.securevault.backend.entity.LoginActivity;
import com.securevault.backend.entity.SuspiciousActivity;
import com.securevault.backend.entity.User;
import com.securevault.backend.repository.LoginActivityRepository;
import com.securevault.backend.repository.SuspiciousActivityRepository;
import com.securevault.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SuspiciousActivityServiceImpl
        implements SuspiciousActivityService {

    private static final int FAILED_ATTEMPT_THRESHOLD = 5;

    private static final int TIME_WINDOW_MINUTES = 10;

    private final LoginActivityRepository loginActivityRepository;

    private final SuspiciousActivityRepository suspiciousActivityRepository;

    private final UserRepository userRepository;

    private final SecurityAlertService securityAlertService;

    private final AuditLogService auditLogService;


    // =========================================================
    // ANALYZE LOGIN ATTEMPT
    // =========================================================

    @Override
    public void analyzeLoginAttempt(
            String email,
            boolean successful) {

        // Only failed login attempts are suspicious
        if (successful) {
            return;
        }

        // Find the user
        User user = userRepository
                .findByEmail(email)
                .orElse(null);

        /*
         * If the email does not belong to a registered
         * account, there is no user to associate the
         * suspicious activity with.
         */
        if (user == null) {
            return;
        }

        LocalDateTime now = LocalDateTime.now();

        LocalDateTime windowStart =
                now.minusMinutes(
                        TIME_WINDOW_MINUTES
                );


        // =====================================================
        // GET LOGIN ACTIVITIES
        // =====================================================

        List<LoginActivity> activities =
                loginActivityRepository
                        .findByUserOrderByLoginTimeDesc(user);


        // =====================================================
        // COUNT FAILED ATTEMPTS
        // =====================================================

        long failedAttempts =
                activities.stream()

                        .filter(activity ->
                                !activity.getSuccessful()
                        )

                        .filter(activity ->
                                activity.getLoginTime()
                                        .isAfter(windowStart)
                        )

                        .count();


        // =====================================================
        // CHECK SUSPICIOUS ACTIVITY THRESHOLD
        // =====================================================

        if (failedAttempts >=
                FAILED_ATTEMPT_THRESHOLD) {

            createSuspiciousActivity(user);
        }
    }


    // =========================================================
    // CREATE SUSPICIOUS ACTIVITY
    // =========================================================

    private void createSuspiciousActivity(
            User user) {

        LocalDateTime now = LocalDateTime.now();


        /*
         * Prevent creating the same suspicious activity
         * repeatedly within the same 10-minute window.
         */

        List<SuspiciousActivity> existing =
                suspiciousActivityRepository
                        .findByUserOrderByDetectedAtDesc(user);


        boolean alreadyFlagged =
                existing.stream()
                        .anyMatch(activity ->

                                "MULTIPLE_FAILED_LOGINS"
                                        .equals(
                                                activity
                                                        .getActivityType()
                                        )

                                        && activity
                                        .getDetectedAt()
                                        .isAfter(
                                                now.minusMinutes(
                                                        TIME_WINDOW_MINUTES
                                                )
                                        )
                        );


        if (alreadyFlagged) {
            return;
        }


        // =====================================================
        // CREATE SUSPICIOUS ACTIVITY
        // =====================================================

        SuspiciousActivity suspiciousActivity =
                SuspiciousActivity.builder()
                        .user(user)
                        .activityType(
                                "MULTIPLE_FAILED_LOGINS"
                        )
                        .description(
                                "Multiple failed login attempts "
                                        + "detected within "
                                        + TIME_WINDOW_MINUTES
                                        + " minutes."
                        )
                        .detectedAt(now)
                        .status("FLAGGED")
                        .build();


        // Save suspicious activity

        SuspiciousActivity savedActivity =
                suspiciousActivityRepository.save(
                        suspiciousActivity
                );


        // =====================================================
        // CREATE SECURITY ALERT
        // =====================================================

        securityAlertService
                .createAlertForSuspiciousActivity(
                        savedActivity.getId()
                );


        // =====================================================
        // CREATE AUDIT LOG
        // =====================================================

        auditLogService.recordAudit(
                user.getEmail(),
                "SUSPICIOUS_ACTIVITY",
                "Multiple failed login attempts detected. "
                        + "Security alert created."
        );
    }


    // =========================================================
    // GET MY SUSPICIOUS ACTIVITIES
    // =========================================================

    @Override
    public List<SuspiciousActivityResponse>
    getMySuspiciousActivities() {

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


        return suspiciousActivityRepository
                .findByUserOrderByDetectedAtDesc(user)

                .stream()

                .map(activity ->

                        SuspiciousActivityResponse
                                .builder()

                                .id(
                                        activity.getId()
                                )

                                .activityType(
                                        activity
                                                .getActivityType()
                                )

                                .description(
                                        activity
                                                .getDescription()
                                )

                                .detectedAt(
                                        activity
                                                .getDetectedAt()
                                )

                                .status(
                                        activity
                                                .getStatus()
                                )

                                .build()

                )

                .toList();
    }
}