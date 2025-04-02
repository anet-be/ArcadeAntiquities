package be.kdg.webbackend.domain;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String fileName;
    private String url;
    @Enumerated(EnumType.STRING)
    private AssetType assetType;


    public Asset(String fileName, String url, AssetType assetType) {
        this.fileName = fileName;
        this.url = url;
        this.assetType = assetType;
    }

    public Asset() {
    }

    public UUID getId() {
        return id;
    }

    public String getFileName() {
        return fileName;
    }

    public String getUrl() {
        return url;
    }

    public AssetType getAssetType() {
        return assetType;
    }
}