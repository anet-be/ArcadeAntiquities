package be.kdg.webbackend.repository;

import be.kdg.webbackend.domain.Game;
import org.springframework.data.jpa.repository.JpaRepository;


public interface GameRepository extends JpaRepository<Game, Long> {


}