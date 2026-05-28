package com.tixevent.backend.repository;

import com.tixevent.backend.entity.Crew;
import org.springframework.data.jpa.repository.JpaRepository;
public interface CrewRepository extends JpaRepository<Crew, String> {
}
