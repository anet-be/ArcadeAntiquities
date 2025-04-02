package be.kdg.webbackend.repository;

import be.kdg.webbackend.domain.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AssetRepository extends JpaRepository<Asset, UUID> {
    @Query("""
            SELECT g.assets
            FROM Game g
            WHERE g.id = :gameId
            """)
    List<Asset> findAssetsByGameId(long gameId);

    @Query("""
            SELECT g.assets
            FROM GameVersion g
            WHERE g.id = :gameVersionId
            """)
    List<Asset> findAssetsByGameVersionId(UUID gameVersionId);

    Optional<Asset> findByFileName(String fileName);

    Optional<Asset> findByUrl(String url);

}