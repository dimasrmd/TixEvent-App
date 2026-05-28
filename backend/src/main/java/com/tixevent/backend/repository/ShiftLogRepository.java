package com.tixevent.backend.repository;

import com.tixevent.backend.entity.ShiftLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShiftLogRepository extends JpaRepository<ShiftLog, String> {
}
