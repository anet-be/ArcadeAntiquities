package be.kdg.webbackend.domain;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String firstName;
    private String lastName;
    private String email;

    @ManyToMany(cascade = CascadeType.ALL)
    private List<Project> projects = new ArrayList<>();

    public Client(String firstName, String lastName, String email) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }

    public Client() {
    }

    public void addProject(Project project) {
        projects.add(project);
    }

    public void removeProject(Project project) {
        projects.remove(project);
    }
}
