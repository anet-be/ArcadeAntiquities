package be.kdg.webbackend.domain;

import jakarta.persistence.*;

import java.util.Set;
import java.util.UUID;

@Entity
public class ProjectVersion {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private double versionNumber;

    @ManyToOne
    private Project project;
    @ManyToMany
    private Set<GameVersion> gameVersions;

    public ProjectVersion() {
    }

    public ProjectVersion(double versionNumber, Set<GameVersion> gameVersions, Project project) {
        this.versionNumber = versionNumber;
        this.gameVersions = gameVersions;
        this.project = project;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public double getVersionNumber() {
        return versionNumber;
    }

    public void setVersionNumber(double versionNumber) {
        this.versionNumber = versionNumber;
    }

    public Set<GameVersion> getGameVersions() {
        return gameVersions;
    }

    public void setGameVersion(Set<GameVersion> gameVersions) {
        this.gameVersions = gameVersions;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }
}