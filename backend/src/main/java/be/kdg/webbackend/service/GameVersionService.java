package be.kdg.webbackend.service;

import be.kdg.webbackend.domain.GameVersion;
import be.kdg.webbackend.repository.GameVersionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class GameVersionService {
    private final GameVersionRepository gameVersionRepository;

    public GameVersionService(GameVersionRepository gameVersionRepository) {
        this.gameVersionRepository = gameVersionRepository;
    }

    public List<GameVersion> getGamesFromProject(UUID projectId) {
        List<GameVersion> gameVersions = gameVersionRepository.findByProjectId(projectId);

        if (gameVersions.isEmpty()) {
            throw new NoSuchElementException("No games found for project ID: " + projectId);
        }

        return gameVersions;
    }

    public List<GameVersion> getGamesFromProjectVersion(UUID projectVersionId) {
        List<GameVersion> gameVersions = gameVersionRepository.findByProjectVersionId(projectVersionId);

        if (gameVersions.isEmpty()) {
            throw new NoSuchElementException("No games found for project version ID: " + projectVersionId);
        }

        return gameVersions;
    }


    public GameVersion getGameVersion(UUID gameVersionId) {
        return gameVersionRepository.findById(gameVersionId)
                .orElseThrow(() -> new NoSuchElementException("No game version found with ID: " + gameVersionId));
    }
}
