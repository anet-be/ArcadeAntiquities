package be.kdg.webbackend.repository;

import be.kdg.webbackend.domain.GameVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface GameVersionRepository extends JpaRepository<GameVersion, UUID> {
    @Query("""
                        SELECT p.gameVersions
                        FROM Project p
                        LEFT JOIN p.gameVersions
                        WHERE p.id = :projectId
            """)
    List<GameVersion> findByProjectId(UUID projectId);

    @Query("""
                        SELECT p.gameVersions
                        FROM ProjectVersion p
                        LEFT JOIN p.gameVersions
                        WHERE p.id = :projectVersionId
            """)
    List<GameVersion> findByProjectVersionId(UUID projectVersionId);

    @Query("""
                        SELECT gv
                        FROM GameVersion gv
                        LEFT JOIN gv.baseGame
                        LEFT JOIN gv.assets
                        WHERE gv.id = :gameId
            """)
    Optional<GameVersion> findById(UUID gameId);

}
