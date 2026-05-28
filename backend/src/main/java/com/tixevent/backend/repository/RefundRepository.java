package com.tixevent.backend.repository;

import com.tixevent.backend.entity.Refund;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RefundRepository extends JpaRepository<Refund, String> {
}