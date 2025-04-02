package be.kdg.webbackend.dtos.dto;

import be.kdg.webbackend.domain.GameVersion;

import java.util.UUID;

public record GameVersionDto(
        UUID id,
        String versionName,
        double versionNumber,
        String versionRules,
        long baseGameId
) {
    public static GameVersionDto mapToDto(GameVersion gameVersion) {
        return new GameVersionDto(
                gameVersion.getId(),
                gameVersion.getVersionName(),
                gameVersion.getVersionNumber(),
                gameVersion.getVersionRules(),
                gameVersion.getBaseGame().getId()
        );
    }
}