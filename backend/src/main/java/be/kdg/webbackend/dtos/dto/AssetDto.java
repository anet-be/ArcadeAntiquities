package be.kdg.webbackend.dtos.dto;

import be.kdg.webbackend.domain.Asset;
import be.kdg.webbackend.domain.AssetType;

import java.util.UUID;

public record AssetDto(
        UUID id,
        String fileName,
        String url,
        AssetType assetType
) {
    public static AssetDto mapToDto(Asset asset) {
        return new AssetDto(
                asset.getId(),
                asset.getFileName(),
                asset.getUrl(),
                asset.getAssetType()
        );
    }
}
