package be.kdg.webbackend.domain;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
public class Game {
    @ManyToMany
    Set<Asset> assets;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String name;
    private String rules;

    public Game(String name, String rules, Set<Asset> assets) {
        this.name = name;
        this.rules = rules;
        this.assets = new HashSet<>();
        this.assets.addAll(assets);
    }

    public Game() {
    }

    public long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getRules() {
        return rules;
    }
}