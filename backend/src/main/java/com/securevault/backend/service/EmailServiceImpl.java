package com.securevault.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Override
    public void sendOtpEmail(String to, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(to);
        message.setSubject("SecureVault Password Reset OTP");

        message.setText(
                "Hello,\n\n"
                        + "Your OTP for resetting your SecureVault password is:\n\n"
                        + otp
                        + "\n\nThis OTP is valid for 5 minutes."
                        + "\n\nIf you didn't request this, please ignore this email."
                        + "\n\nRegards,\nSecureVault Team"
        );

        mailSender.send(message);
    }
}