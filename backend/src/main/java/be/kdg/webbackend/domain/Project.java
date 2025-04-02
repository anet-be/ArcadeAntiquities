package be.kdg.webbackend.domain;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String projectCode;
    private String name;
    private String description;

    @OneToMany
    private Set<GameVersion> gameVersions;

    public Project(String projectCode, String name, String description, Set<GameVersion> gameVersions) {
        this.projectCode = projectCode;
        this.name = name;
        this.description = description;
        this.gameVersions = new HashSet<>();
        this.gameVersions.addAll(gameVersions);
    }


    public Project() {
    }

    public String getProjectCode() {
        return projectCode;
    }

    public void setProjectCode(String projectCode) {
        this.projectCode = projectCode;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public UUID getId() {
        return id;
    }

    public Set<GameVersion> getGameVersions() {
        return gameVersions;
    }

    public void addGameVersion(GameVersion gameVersion) {
        this.gameVersions.add(gameVersion);
    }
}
