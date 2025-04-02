package be.kdg.webbackend.repository;

import be.kdg.webbackend.domain.Client;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ClientRepository extends JpaRepository<Client, UUID> {
}
