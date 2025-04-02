package be.kdg.webbackend.controller;

import be.kdg.webbackend.dtos.dto.GameDto;
import be.kdg.webbackend.service.GameService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/games")
public class GameController {
    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<GameDto> getGame(@PathVariable long id) {
        return ResponseEntity.ok(GameDto.mapToDto(gameService.getGame(id)));
    }

    @GetMapping
    public ResponseEntity<List<GameDto>> getGames() {
        return ResponseEntity.ok(gameService.getGames().stream()
                .map(GameDto::mapToDto)
                .collect(Collectors.toList()));
    }


}
