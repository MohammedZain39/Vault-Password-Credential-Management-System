package com.securevault.backend.service;

import com.securevault.backend.dto.LoginActivityReportResponse;
import com.securevault.backend.dto.PasswordHealthResponse;

public interface ReportService {

    PasswordHealthResponse getPasswordHealthReport();

    LoginActivityReportResponse getLoginActivityReport();
}