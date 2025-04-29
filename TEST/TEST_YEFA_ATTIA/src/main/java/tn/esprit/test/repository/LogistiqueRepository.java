package tn.esprit.test.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.test.entities.Logistique;

@Repository
public interface ILogistique extends JpaRepository<Logistique, Integer> {
}
