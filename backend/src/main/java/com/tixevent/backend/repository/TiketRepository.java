package com.tixevent.backend.repository;

import com.tixevent.backend.entity.Tiket; // Sesuaikan dengan entity
import org.springframework.data.jpa.repository.JpaRepository;

public interface TiketRepository extends JpaRepository<Tiket, String> {
}