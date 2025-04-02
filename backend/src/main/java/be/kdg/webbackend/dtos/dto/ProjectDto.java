package be.kdg.webbackend.dtos.dto;

import be.kdg.webbackend.domain.GameVersion;
import be.kdg.webbackend.domain.Project;

import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

public record ProjectDto(
        UUID id,
        String projectCode,
        String name,
        String description,
        Set<UUID> games
) {
    public static ProjectDto mapToDto(Project project) {
        return new ProjectDto(
                project.getId(),
                project.getProjectCode(),
                project.getName(),
                project.getDescription(),
                project.getGameVersions().stream().map(GameVersion::getId).collect(Collectors.toSet())
        );
    }
}