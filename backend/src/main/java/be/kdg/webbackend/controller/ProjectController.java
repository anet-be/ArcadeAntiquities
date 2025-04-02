package be.kdg.webbackend.controller;

import be.kdg.webbackend.domain.Project;
import be.kdg.webbackend.dtos.dto.GameVersionDto;
import be.kdg.webbackend.dtos.dto.ProjectDto;
import be.kdg.webbackend.dtos.dto.ProjectVersionDto;
import be.kdg.webbackend.dtos.requests.AddProjectRequest;
import be.kdg.webbackend.dtos.requests.AddProjectVersionRequest;
import be.kdg.webbackend.service.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    private final ProjectService projectService;
    private final GameVersionService gameVersionService;
    private final ProjectCreationService projectCreationService;
    private final ProjectVersionService projectVersionService;
    private final ProjectVersionCreationService projectVersionCreationService;

    public ProjectController(ProjectService projectService, GameVersionService gameVersionService, ProjectCreationService projectCreationService, ProjectVersionService projectVersionService, ProjectVersionCreationService projectVersionCreationService) {
        this.projectService = projectService;
        this.gameVersionService = gameVersionService;
        this.projectCreationService = projectCreationService;
        this.projectVersionService = projectVersionService;
        this.projectVersionCreationService = projectVersionCreationService;
    }

    @GetMapping
    public ResponseEntity<List<ProjectDto>> getProjects() {
        return ResponseEntity.ok(
                this.projectService.getProjects()
                        .stream()
                        .map(ProjectDto::mapToDto)
                        .toList()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDto> getProject(
            @PathVariable UUID id
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(
                        ProjectDto.mapToDto(this.projectService.getProject(id))
                );
    }

    @GetMapping("/{id}/game-versions")
    public ResponseEntity<List<GameVersionDto>> getGameVersions(
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(
                this.gameVersionService.getGamesFromProject(id)
                        .stream()
                        .map(GameVersionDto::mapToDto)
                        .toList()
        );
    }

    @GetMapping("/{id}/project-versions")
    public ResponseEntity<List<ProjectVersionDto>> getProjectVersions(
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(
                projectVersionService.getProjectVersionsFromProject(id)
                        .stream()
                        .map(ProjectVersionDto::mapToDto)
                        .toList()
        );
    }

    @PostMapping
    public ResponseEntity<ProjectDto> addProject(@Valid @RequestBody AddProjectRequest addProjectRequest) {
        Project project = projectCreationService.createProject(addProjectRequest.name(), addProjectRequest.description(), addProjectRequest.gameIds());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(
                        ProjectDto.mapToDto(project)
                );
    }

    @PostMapping("/{id}/project-versions")
    public ResponseEntity<ProjectVersionDto> addProjectVersionToProject(
            @PathVariable UUID id,
            @RequestBody AddProjectVersionRequest addProjectVersionRequest
    ) {
        return ResponseEntity.ok(
                ProjectVersionDto.mapToDto(projectVersionCreationService.addGameVersionToProjectVersion(id, addProjectVersionRequest.gameVersionIds()))
        );
    }

    @DeleteMapping("/{projectId}")
    public ResponseEntity<?> deleteProject(
            @PathVariable UUID projectId
    ) {
        projectService.deleteProject(projectId);
        return ResponseEntity.noContent().build();
    }
}
