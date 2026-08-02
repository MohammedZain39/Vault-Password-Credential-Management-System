package com.securevault.backend.repository;

import com.securevault.backend.entity.User;
import com.securevault.backend.entity.VaultPin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VaultPinRepository extends JpaRepository<VaultPin, Long> {

    Optional<VaultPin> findByUser(User user);

    boolean existsByUser(User user);

}