package com.tixevent.backend.repository;

import com.tixevent.backend.entity.Transaksi; // Sesuaikan dengan entity
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransaksiRepository extends JpaRepository<Transaksi, String> {
}