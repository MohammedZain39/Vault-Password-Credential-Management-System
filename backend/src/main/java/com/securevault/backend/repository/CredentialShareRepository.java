package com.securevault.backend.repository;

import com.securevault.backend.entity.CredentialShare;
import com.securevault.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CredentialShareRepository
        extends JpaRepository<CredentialShare, Long> {

    List<CredentialShare> findBySharedWith(User user);

    List<CredentialShare> findBySharedBy(User user);

    Optional<CredentialShare> findByCredentialIdAndSharedWith(
            Long credentialId,
            User sharedWith
    );
    boolean existsByCredentialIdAndSharedWith(
            Long credentialId,
            User sharedWith
    );
}