package com.sisctecma.space.repository;

import com.sisctecma.space.domain.SpaceEvent;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the SpaceEvent entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SpaceEventRepository extends JpaRepository<SpaceEvent, Long> {
}
