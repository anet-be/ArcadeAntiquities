package be.kdg.webbackend.service;

import be.kdg.webbackend.domain.Project;
import be.kdg.webbackend.repository.ProjectRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final ProjectVersionService projectVersionService;

    public ProjectService(ProjectRepository projectRepository, ProjectVersionService projectVersionService) {
        this.projectRepository = projectRepository;
        this.projectVersionService = projectVersionService;
    }

    @Transactional
    public void deleteProject(UUID projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project with ID " + projectId + " not found"));

        projectVersionService.deleteAllProjectVersionsOfProject(projectId);

        projectRepository.delete(project);
    }

    public List<Project> getProjects() {
        return projectRepository.findAllProjects();
    }

    public Project getProject(UUID id) {
        return projectRepository.findProject(id)
                .orElseThrow(() -> new EntityNotFoundException("Project with ID " + id + " not found"));
    }

    public Project getProjectByGameVersionId(UUID gameVersionId) {
        return projectRepository.findProjectByGameVersionId(gameVersionId)
                .orElseThrow(() -> new EntityNotFoundException("Project with game version ID " + gameVersionId + " not found"));
    }

    public Project getProjectByProjectVersionId(UUID projectVersionId) {
        return projectRepository.findProjectByProjectVersionId(projectVersionId)
                .orElseThrow(() -> new EntityNotFoundException("Project with project version ID " + projectVersionId + " not found"));
    }
}
