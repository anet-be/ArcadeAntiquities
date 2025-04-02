package be.kdg.webbackend.dtos.dto;

import be.kdg.webbackend.domain.Game;

public record GameDto(
        long id,
        String name
) {
    public static GameDto mapToDto(Game game) {
        return new GameDto(
                game.getId(),
                game.getName()
        );
    }
}