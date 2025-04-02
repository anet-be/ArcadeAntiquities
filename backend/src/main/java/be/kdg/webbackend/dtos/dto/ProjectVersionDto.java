package be.kdg.webbackend.dtos.dto;

import be.kdg.webbackend.domain.GameVersion;
import be.kdg.webbackend.domain.ProjectVersion;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public record ProjectVersionDto(
        UUID id,
        double versionNumber,
        List<UUID> gameVersionIds
) {
    public static ProjectVersionDto mapToDto(ProjectVersion projectVersion) {
        return new ProjectVersionDto(
                projectVersion.getId(),
                projectVersion.getVersionNumber(),
                projectVersion.getGameVersions().stream().map(GameVersion::getId).collect(Collectors.toList())
        );
    }
}