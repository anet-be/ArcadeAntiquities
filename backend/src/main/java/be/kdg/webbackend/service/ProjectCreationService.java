package be.kdg.webbackend.service;

import be.kdg.webbackend.domain.Game;
import be.kdg.webbackend.domain.GameVersion;
import be.kdg.webbackend.domain.Project;
import be.kdg.webbackend.domain.ProjectVersion;
import be.kdg.webbackend.repository.GameVersionRepository;
import be.kdg.webbackend.repository.ProjectRepository;
import be.kdg.webbackend.repository.ProjectVersionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.HashSet;
import java.util.Set;

@Service
public class ProjectCreationService {
    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final SecureRandom RANDOM = new SecureRandom();
    private final ProjectRepository projectRepository;
    private final GameVersionRepository gameVersionRepository;
    private final GameService gameService;
    private final GameVersionCreationService gameVersionCreationService;
    private final ProjectVersionRepository projectVersionRepository;

    public ProjectCreationService(ProjectRepository projectRepository, GameVersionRepository gameVersionRepository, GameService gameService, GameVersionCreationService gameVersionCreationService, ProjectVersionRepository projectVersionRepository) {
        this.projectRepository = projectRepository;
        this.gameVersionRepository = gameVersionRepository;
        this.gameService = gameService;
        this.gameVersionCreationService = gameVersionCreationService;
        this.projectVersionRepository = projectVersionRepository;
    }

    @Transactional
    public Project createProject(String name, String description, Set<Long> gameIds) {
        String projectCode = generateUniqueProjectCode();
        Set<GameVersion> gameVersionsFromProjectVersion = new HashSet<>();
        Set<GameVersion> gameVersions = new HashSet<>();

        for (Game game : gameService.getGames()) {
            GameVersion gameVersion = gameVersionCreationService.createFirstGameVersion(
                    game.getName(), 1.0, game.getRules(), game
            );

            gameVersionRepository.save(gameVersion);
            gameVersions.add(gameVersion);
            if (gameIds.contains(game.getId())) {
                gameVersionsFromProjectVersion.add(gameVersion);
            }
        }

        Project project = new Project(projectCode, name, description, gameVersions);
        projectRepository.save(project);

        ProjectVersion projectVersion = new ProjectVersion(1.0, gameVersionsFromProjectVersion, project);
        projectVersionRepository.save(projectVersion);
        return project;
    }

    private String generateUniqueProjectCode() {
        String projectCode;
        do {
            projectCode = generateRandomCode();
        } while (projectRepository.existsByProjectCode(projectCode));
        return projectCode;
    }

    private String generateRandomCode() {
        StringBuilder code = new StringBuilder(6);
        for (int i = 0; i < 6; i++) {
            code.append(CHARACTERS.charAt(RANDOM.nextInt(CHARACTERS.length())));
        }
        return code.toString();
    }


}
