package com.securevault.backend.service;

import com.securevault.backend.dto.LoginActivityReportResponse;
import com.securevault.backend.dto.PasswordHealthResponse;
import com.securevault.backend.entity.Credential;
import com.securevault.backend.entity.LoginActivity;
import com.securevault.backend.entity.User;
import com.securevault.backend.repository.CredentialRepository;
import com.securevault.backend.repository.LoginActivityRepository;
import com.securevault.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final CredentialRepository credentialRepository;
    private final LoginActivityRepository loginActivityRepository;
    private final UserRepository userRepository;

    @Override
    public PasswordHealthResponse getPasswordHealthReport() {

        User user = getCurrentUser();

        List<Credential> credentials =
                credentialRepository.findByUser(user);

        long total = credentials.size();

        long strong = 0;
        long medium = 0;
        long weak = 0;

        for (Credential credential : credentials) {

            String password = credential.getPassword();

            int score = calculatePasswordStrength(password);

            if (score >= 80) {
                strong++;
            } else if (score >= 50) {
                medium++;
            } else {
                weak++;
            }
        }

        int healthScore = 0;

        if (total > 0) {

            /*
             * Strong = 100%
             * Medium = 60%
             * Weak = 0%
             */

            double score =
                    ((strong * 100.0)
                            + (medium * 60.0))
                            / total;

            healthScore = (int) Math.round(score);
        }

        return PasswordHealthResponse.builder()
                .totalCredentials(total)
                .strongPasswords(strong)
                .mediumPasswords(medium)
                .weakPasswords(weak)
                .healthScore(healthScore)
                .build();
    }


    @Override
    public LoginActivityReportResponse getLoginActivityReport() {

        User user = getCurrentUser();

        List<LoginActivity> activities =
                loginActivityRepository
                        .findByUserOrderByLoginTimeDesc(user);

        long totalAttempts = activities.size();

        long successfulLogins =
                activities.stream()
                        .filter(LoginActivity::getSuccessful)
                        .count();

        long failedLogins =
                activities.stream()
                        .filter(activity ->
                                !activity.getSuccessful())
                        .count();

        return LoginActivityReportResponse.builder()
                .totalAttempts(totalAttempts)
                .successfulLogins(successfulLogins)
                .failedLogins(failedLogins)
                .build();
    }


    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }


    /*
     * Password strength calculation.
     *
     * 80+  = Strong
     * 50-79 = Medium
     * below 50 = Weak
     */
    private int calculatePasswordStrength(String password) {

        if (password == null || password.isEmpty()) {
            return 0;
        }

        int score = 0;

        // Length
        if (password.length() >= 8) {
            score += 20;
        }

        if (password.length() >= 12) {
            score += 10;
        }

        // Lowercase
        if (password.matches(".*[a-z].*")) {
            score += 15;
        }

        // Uppercase
        if (password.matches(".*[A-Z].*")) {
            score += 15;
        }

        // Number
        if (password.matches(".*[0-9].*")) {
            score += 15;
        }

        // Special character
        if (password.matches(".*[^a-zA-Z0-9].*")) {
            score += 25;
        }

        return Math.min(score, 100);
    }
}