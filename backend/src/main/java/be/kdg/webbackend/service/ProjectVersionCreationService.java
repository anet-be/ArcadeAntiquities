package be.kdg.webbackend.service;

import be.kdg.webbackend.domain.GameVersion;
import be.kdg.webbackend.domain.Project;
import be.kdg.webbackend.domain.ProjectVersion;
import be.kdg.webbackend.repository.ProjectVersionRepository;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class ProjectVersionCreationService {

    private final ProjectService projectService;
    private final GameVersionService gameVersionService;
    private final ProjectVersionRepository projectVersionRepository;

    public ProjectVersionCreationService(ProjectService projectService, GameVersionService gameVersionService, ProjectVersionRepository projectVersionRepository) {
        this.projectService = projectService;
        this.gameVersionService = gameVersionService;
        this.projectVersionRepository = projectVersionRepository;
    }

    public ProjectVersion addGameVersionToProjectVersion(UUID projectId, List<UUID> gameVersionIds) {
        Project project = projectService.getProject(projectId);

        Set<GameVersion> gameVersions = fetchGameVersions(gameVersionIds);

        double versionNumber = calculateNextVersionNumber(projectId);

        ProjectVersion projectVersion = new ProjectVersion(versionNumber, gameVersions, project);

        return projectVersionRepository.save(projectVersion);
    }

    private Set<GameVersion> fetchGameVersions(List<UUID> gameVersionIds) {
        Set<GameVersion> gameVersions = new HashSet<>();

        for (UUID gameVersionId : gameVersionIds) {
            GameVersion gameVersion = gameVersionService.getGameVersion(gameVersionId);
            gameVersions.add(gameVersion);
        }

        return gameVersions;
    }


    private double calculateNextVersionNumber(UUID projectId) {
        return projectVersionRepository.findMaxVersionByProjectId(projectId) + 1;
    }
}
