package be.kdg.webbackend.service;

import be.kdg.webbackend.domain.ProjectVersion;
import be.kdg.webbackend.repository.ProjectVersionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ProjectVersionService {

    private final ProjectVersionRepository projectVersionRepository;

    public ProjectVersionService(ProjectVersionRepository projectVersionRepository) {
        this.projectVersionRepository = projectVersionRepository;
    }

    public List<ProjectVersion> getProjectVersionsFromProject(UUID projectId) {
        return projectVersionRepository.findAllByProjectId(projectId);
    }

    public void deleteAllProjectVersionsOfProject(UUID projectId) {
        projectVersionRepository.deleteAll(projectVersionRepository.findAllByProjectId(projectId));
    }

    public ProjectVersion getProjectVersion(UUID projectVersionId) {
        return projectVersionRepository.findById(projectVersionId).orElseThrow(
                () -> new IllegalArgumentException("project version with id: " + projectVersionId + " not found")
        );
    }
}
