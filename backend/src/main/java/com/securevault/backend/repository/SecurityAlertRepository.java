package com.securevault.backend.repository;

import com.securevault.backend.entity.SecurityAlert;
import com.securevault.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SecurityAlertRepository
        extends JpaRepository<SecurityAlert, Long> {

    List<SecurityAlert> findByUserOrderByCreatedAtDesc(User user);
}