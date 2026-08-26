package com.securevault.backend.service;

import com.securevault.backend.dto.LoginActivityResponse;

import java.util.List;

public interface LoginActivityService {

    void recordLogin(
            String email,
            boolean successful,
            String ipAddress
    );

    List<LoginActivityResponse> getMyLoginActivities();
}