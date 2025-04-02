package be.kdg.webbackend.controller;

import be.kdg.webbackend.dtos.dto.GameVersionDto;
import be.kdg.webbackend.service.GameVersionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/project-versions")
public class ProjectVersionController {

    private final GameVersionService gameVersionService;

    public ProjectVersionController(GameVersionService gameVersionService) {
        this.gameVersionService = gameVersionService;
    }

    @GetMapping("/{id}/game-versions")
    public ResponseEntity<List<GameVersionDto>> getGameVersions(
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(
                gameVersionService.getGamesFromProjectVersion(id)
                        .stream()
                        .map(GameVersionDto::mapToDto)
                        .toList()
        );
    }
}
