package be.kdg.webbackend.dtos.dto;

import java.util.List;

public record ProjectWithGameIdsDto(String projectId, String projectCode, String name, String description,
                                    List<GameDto> gameDtos) {
}