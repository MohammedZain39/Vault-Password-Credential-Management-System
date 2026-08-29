package com.securevault.backend.service;

import com.securevault.backend.dto.PasswordHealthResponse;

public interface PasswordHealthService {

    PasswordHealthResponse getMyPasswordHealth();
}