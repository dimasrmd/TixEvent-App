package com.tixevent.backend.repository;

import com.tixevent.backend.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<Event, String> {
}
