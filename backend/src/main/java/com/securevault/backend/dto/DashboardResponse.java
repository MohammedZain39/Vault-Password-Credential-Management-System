package com.securevault.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class DashboardResponse {

    private int credentialCount;

    private int categoryCount;

    private int weakPasswordCount;

    private boolean vaultProtected;

    private List<String> recentCredentials;

}