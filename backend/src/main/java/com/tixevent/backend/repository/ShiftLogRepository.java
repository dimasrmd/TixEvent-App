package com.tixevent.backend.repository;

import com.tixevent.backend.entity.ShiftLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShiftLogRepository extends JpaRepository<ShiftLog, String> {
}
