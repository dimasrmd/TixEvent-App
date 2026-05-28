package com.tixevent.backend.repository;

import com.tixevent.backend.entity.EventSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventScheduleRepository extends JpaRepository<EventSchedule, Long> {
    List<EventSchedule> findByEventStageNameIgnoreCase(String stageName);
}
