package be.kdg.webbackend.dtos.requests;

import be.kdg.webbackend.dtos.dto.AssetDto;

import java.util.List;
import java.util.UUID;

public record AddGameVersionRequest(
        UUID baseGameId,
        String versionName,
        String versionRules,
        List<AssetDto> assets
) {
}
