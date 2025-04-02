package be.kdg.webbackend.repository;

import be.kdg.webbackend.domain.ProjectVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface ProjectVersionRepository extends JpaRepository<ProjectVersion, UUID> {
    @Query("""
                        SELECT p
                        FROM ProjectVersion p
                        LEFT JOIN FETCH p.gameVersions
                        WHERE p.project.id = :projectId
            """)
    List<ProjectVersion> findAllByProjectId(UUID projectId);

    @Query("""
                        SELECT MAX(p.versionNumber)
                        FROM ProjectVersion p
                        WHERE p.project.id = :projectId
            """)
    double findMaxVersionByProjectId(UUID projectId);

    @Query("""
                     SELECT p
                     FROM ProjectVersion p
                     LEFT JOIN FETCH p.gameVersions g
                     WHERE g.id = :gameVersionId
            """)
    List<ProjectVersion> findAllByGameVersionId(UUID gameVersionId);
}
