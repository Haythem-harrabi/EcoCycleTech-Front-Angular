package tn.esprit.test.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RestController;
import tn.esprit.test.entities.Participant;

@Repository
public interface IParticipant extends JpaRepository<Participant,Integer> {
}
