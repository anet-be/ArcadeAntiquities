package be.kdg.webbackend.service;

import be.kdg.webbackend.domain.Asset;
import be.kdg.webbackend.repository.AssetRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class AssetService {
    private final AssetRepository assetRepository;

    public AssetService(AssetRepository assetRepository) {
        this.assetRepository = assetRepository;
    }

    public List<Asset> getAssetsOfGame(long gameId) {
        return assetRepository.findAssetsByGameId(gameId);
    }

    public List<Asset> getAssetsOfGameVersion(UUID gameVersionId) {
        return assetRepository.findAssetsByGameVersionId(gameVersionId);
    }

    public Asset getAssetByName(String assetName) {
        return assetRepository.findByFileName(assetName)
                .orElseThrow(() -> new IllegalArgumentException("Asset with name " + assetName + " not found"));
    }

    public String saveBase64Image(String baseGameName, String base64String, String fileDir, String fileName, double versionNumber) {
        if (base64String.contains(",")) {
            base64String = base64String.split(",")[1];
        }

        byte[] imageBytes = Base64.getDecoder().decode(base64String);
        fileName = fileName.replace(" ", "_");
        baseGameName = baseGameName.replace(" ", "_");

        fileDir = fileDir.replace(" ", "_");
        String directoryPath = "static/assets/" + baseGameName + "-base-game/" + fileDir + "/" + String.format("version_%.0f", versionNumber);
        String filePath = directoryPath + "/" + fileName;

        try {
            Files.createDirectories(Paths.get(directoryPath));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        try (FileOutputStream fos = new FileOutputStream(filePath)) {
            fos.write(imageBytes);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return filePath.replaceFirst("^static", "");
    }
}