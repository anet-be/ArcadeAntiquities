package be.kdg.webbackend.controller;

import be.kdg.webbackend.dtos.dto.AssetDto;
import be.kdg.webbackend.service.AssetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/assets")
public class AssetsController {

    private final AssetService assetService;

    public AssetsController(AssetService assetService) {
        this.assetService = assetService;
    }

    @GetMapping("/{assetName}")
    public ResponseEntity<AssetDto> getAsset(@PathVariable String assetName) {
        return ResponseEntity.ok(AssetDto.mapToDto(assetService.getAssetByName(assetName)));
    }

}