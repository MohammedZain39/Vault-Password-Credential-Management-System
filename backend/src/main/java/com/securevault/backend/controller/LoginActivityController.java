package com.securevault.backend.controller;

import com.securevault.backend.dto.LoginActivityResponse;
import com.securevault.backend.service.LoginActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/login-activity")
@RequiredArgsConstructor

public class LoginActivityController {

    private final LoginActivityService loginActivityService;

    @GetMapping
    public ResponseEntity<List<LoginActivityResponse>>
    getLoginActivities() {

        return ResponseEntity.ok(
                loginActivityService.getMyLoginActivities()
        );
    }
}