package be.kdg.webbackend.domain;

import jakarta.persistence.*;

import java.util.List;
import java.util.UUID;

@Entity
public class GameVersion {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String versionName;
    private double versionNumber;
    private String versionRules;


    @ManyToOne
    private Game baseGame;

    @ManyToOne
    private GameVersion baseVersion;

    @ManyToMany
    private List<Asset> assets;

    public GameVersion() {
    }

    public GameVersion(String versionName, double versionNumber, String versionRules, Game baseGame, List<Asset> assets) {
        this.versionName = versionName;
        this.versionNumber = versionNumber;
        this.versionRules = versionRules;
        this.baseGame = baseGame;
        this.assets = assets;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getVersionName() {
        return versionName;
    }

    public void setVersionName(String versionName) {
        this.versionName = versionName;
    }

    public double getVersionNumber() {
        return versionNumber;
    }

    public void setVersionNumber(double versionNumber) {
        this.versionNumber = versionNumber;
    }

    public String getVersionRules() {
        return versionRules;
    }

    public void setVersionRules(String versionRules) {
        this.versionRules = versionRules;
    }

    public Game getBaseGame() {
        return baseGame;
    }

    public void setBaseGame(Game baseGame) {
        this.baseGame = baseGame;
    }

    public List<Asset> getAssets() {
        return assets;
    }

    public void setAssets(List<Asset> assets) {
        this.assets = assets;
    }
}
