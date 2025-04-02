package be.kdg.webbackend.controller;

import be.kdg.webbackend.dtos.dto.AssetDto;
import be.kdg.webbackend.dtos.dto.GameVersionDto;
import be.kdg.webbackend.dtos.requests.AddGameVersionRequest;
import be.kdg.webbackend.service.AssetService;
import be.kdg.webbackend.service.GameVersionCreationService;
import be.kdg.webbackend.service.GameVersionService;
import be.kdg.webbackend.service.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/game-versions")
public class GameVersionController {
    private final GameVersionService gameVersionService;
    private final AssetService assetService;
    private final GameVersionCreationService gameVersionCreationService;
    private final ProjectService projectService;

    public GameVersionController(GameVersionService gameVersionService, AssetService assetService, GameVersionCreationService gameVersionCreationService, ProjectService projectService) {
        this.gameVersionService = gameVersionService;
        this.assetService = assetService;
        this.gameVersionCreationService = gameVersionCreationService;
        this.projectService = projectService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<GameVersionDto> getGame(@PathVariable UUID id) {
        return ResponseEntity.ok(GameVersionDto.mapToDto(gameVersionService.getGameVersion(id)));
    }

    @GetMapping("/{id}/assets")
    public ResponseEntity<List<AssetDto>> getAssets(@PathVariable UUID id) {
        return ResponseEntity.ok(assetService.getAssetsOfGameVersion(id).stream()
                .map(AssetDto::mapToDto)
                .collect(Collectors.toList()));
    }

    @GetMapping("/{id}/project")
    public ResponseEntity<UUID> getProjectId(@PathVariable UUID id) {
        return ResponseEntity.ok(projectService.getProjectByGameVersionId(id).getId());
    }

    @PostMapping
    public ResponseEntity<GameVersionDto> createGameVersion(
            @RequestBody AddGameVersionRequest addGameVersionRequest
    ) {
        return ResponseEntity.ok(GameVersionDto.mapToDto(
                gameVersionCreationService.createGameVersion(
                        addGameVersionRequest.baseGameId(),
                        addGameVersionRequest.versionName(),
                        addGameVersionRequest.versionRules(),
                        addGameVersionRequest.assets()
                )));
    }
}