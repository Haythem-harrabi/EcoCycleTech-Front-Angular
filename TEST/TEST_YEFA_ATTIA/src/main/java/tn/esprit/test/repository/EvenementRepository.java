package tn.esprit.test.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.test.entities.Evenement;

@Repository
public interface IEvenement extends JpaRepository<Evenement, Integer> {
}
