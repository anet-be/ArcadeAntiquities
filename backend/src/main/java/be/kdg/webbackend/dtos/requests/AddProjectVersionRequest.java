package be.kdg.webbackend.dtos.requests;

import java.util.List;
import java.util.UUID;

public record AddProjectVersionRequest(
        List<UUID> gameVersionIds
) {
}
