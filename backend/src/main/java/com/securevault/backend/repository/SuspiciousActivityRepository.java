package com.securevault.backend.repository;

import com.securevault.backend.entity.SuspiciousActivity;
import com.securevault.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SuspiciousActivityRepository
        extends JpaRepository<SuspiciousActivity, Long> {

    List<SuspiciousActivity>
    findByUserOrderByDetectedAtDesc(User user);
}