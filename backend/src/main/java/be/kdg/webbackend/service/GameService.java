package be.kdg.webbackend.service;

import be.kdg.webbackend.domain.Game;
import be.kdg.webbackend.repository.GameRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class GameService {
    private final GameRepository gameRepository;

    public GameService(GameRepository gameRepository) {
        this.gameRepository = gameRepository;
    }

    public List<Game> getGames() {
        return gameRepository.findAll();
    }

    public Game getGame(long gameId) {
        return gameRepository.findById(gameId)
                .orElseThrow(() -> new EntityNotFoundException("game with id " + gameId + " not found"));
    }

}
