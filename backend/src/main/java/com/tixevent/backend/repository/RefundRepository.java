package com.tixevent.backend.repository;

import com.tixevent.backend.entity.Refund;
import com.tixevent.backend.entity.Transaksi;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RefundRepository extends JpaRepository<Refund, String> {
    Optional<Refund> findByTransaksi(Transaksi transaksi);
}