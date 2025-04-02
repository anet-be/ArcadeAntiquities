package be.kdg.webbackend.repository;

import be.kdg.webbackend.domain.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProjectRepository extends JpaRepository<Project, UUID> {
    @Query("""
            SELECT p
            FROM Project p
            LEFT JOIN FETCH p.gameVersions
            """)
    List<Project> findAllProjects();

    @Query("""
            SELECT p
            FROM Project p
            LEFT JOIN FETCH p.gameVersions
            WHERE p.id = :id
            """)
    Optional<Project> findProject(UUID id);

    @Query("""
            SELECT p
            FROM Project p
            LEFT JOIN FETCH p.gameVersions gv
            WHERE gv.id = :id
            """)
    Optional<Project> findProjectByGameVersionId(UUID id);

    @Query("""
            SELECT p.project
            FROM ProjectVersion p
            WHERE p.id = :projectVersionId
            """)
    Optional<Project> findProjectByProjectVersionId(UUID projectVersionId);


    boolean existsByProjectCode(String projectCode);
}
