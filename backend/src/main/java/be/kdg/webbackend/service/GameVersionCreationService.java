package be.kdg.webbackend.service;

import be.kdg.webbackend.domain.Asset;
import be.kdg.webbackend.domain.Game;
import be.kdg.webbackend.domain.GameVersion;
import be.kdg.webbackend.domain.Project;
import be.kdg.webbackend.dtos.dto.AssetDto;
import be.kdg.webbackend.repository.AssetRepository;
import be.kdg.webbackend.repository.GameVersionRepository;
import be.kdg.webbackend.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class GameVersionCreationService {
    private final AssetService assetService;
    private final GameVersionRepository gameVersionRepository;
    private final ProjectService projectService;
    private final ProjectRepository projectRepository;
    private final GameVersionService gameVersionService;
    private final AssetRepository assetRepository;

    public GameVersionCreationService(AssetService assetService, GameVersionRepository gameVersionRepository, ProjectService projectService, ProjectRepository projectRepository, GameVersionService gameVersionService, AssetRepository assetRepository) {
        this.assetService = assetService;
        this.gameVersionRepository = gameVersionRepository;
        this.projectService = projectService;
        this.projectRepository = projectRepository;
        this.gameVersionService = gameVersionService;
        this.assetRepository = assetRepository;
    }

    public GameVersion createFirstGameVersion(String versionName, double versionNumber, String versionRules, Game baseGame) {
        List<Asset> assets = assetService.getAssetsOfGame(baseGame.getId());
        return new GameVersion(versionName, versionNumber, versionRules, baseGame, assets);
    }

    public GameVersion createGameVersion(UUID baseGameId, String versionName, String versionRules, List<AssetDto> assets) {
        GameVersion existingGameVersion = gameVersionService.getGameVersion(baseGameId);

        double versionNumber = determineVersionNumber(existingGameVersion, versionName);

        List<Asset> assetList = processAssets(existingGameVersion.getBaseGame().getName(), assets, versionName, versionNumber);

        GameVersion newGameVersion = new GameVersion(versionName, versionNumber, versionRules, existingGameVersion.getBaseGame(), assetList);
        gameVersionRepository.save(newGameVersion);

        associateVersionWithProject(baseGameId, newGameVersion);

        return newGameVersion;
    }

    private List<Asset> processAssets(String baseGameName, List<AssetDto> assets, String versionName, double versionNumber) {
        List<Asset> assetList = new ArrayList<>();

        for (AssetDto assetDto : assets) {
            Optional<Asset> existingAsset = assetRepository.findByUrl(assetDto.url());

            if (existingAsset.isPresent()) {
                assetList.add(existingAsset.get());
            } else {
                Asset newAsset = saveNewAsset(baseGameName, assetDto, versionName, versionNumber);
                assetList.add(newAsset);
            }
        }
        return assetList;
    }

    private Asset saveNewAsset(String baseGameName, AssetDto assetDto, String versionName, double versionNumber) {
        String assetUrl = assetService.saveBase64Image(baseGameName, assetDto.url(), versionName, assetDto.fileName(), versionNumber);

        Asset newAsset = new Asset(assetDto.fileName(), assetUrl, assetDto.assetType());
        assetRepository.save(newAsset);
        return newAsset;
    }

    private double determineVersionNumber(GameVersion existingGameVersion, String versionName) {
        return existingGameVersion.getVersionName().equals(versionName)
                ? existingGameVersion.getVersionNumber() + 1
                : 1.0;
    }

    private void associateVersionWithProject(UUID baseGameId, GameVersion newGameVersion) {
        Project project = projectService.getProjectByGameVersionId(baseGameId);
        project.addGameVersion(newGameVersion);
        projectRepository.save(project);
    }
}