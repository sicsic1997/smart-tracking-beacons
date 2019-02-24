package org.fmi.smarttrackingbeacons.repository;

import org.fmi.smarttrackingbeacons.domain.Authority;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Spring Data JPA repository for the Authority entity.
 */
public interface AuthorityRepository extends JpaRepository<Authority, String> {
}
