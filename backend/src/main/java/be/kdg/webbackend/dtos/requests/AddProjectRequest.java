package be.kdg.webbackend.dtos.requests;

import java.util.Set;

public record AddProjectRequest(
        String name,
        String description,
        Set<Long> gameIds
) {
}
