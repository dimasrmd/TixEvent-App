package com.tixevent.backend.repository;

import com.tixevent.backend.entity.BoothArea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BoothAreaRepository extends JpaRepository<BoothArea, String> {
}
