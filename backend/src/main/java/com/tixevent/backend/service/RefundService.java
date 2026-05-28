package com.tixevent.backend.service;

import com.tixevent.backend.entity.Refund;
import com.tixevent.backend.repository.RefundRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RefundService {

    private final RefundRepository refundRepository;

    @Autowired
    public RefundService(RefundRepository refundRepository) {
        this.refundRepository = refundRepository;
    }

    // Mengambil semua riwayat refund dari Supabase
    public List<Refund> getDaftarRefund() {
        return refundRepository.findAll();
    }

    // Logika bisnis validasi dan persetujuan refund
    public String prosesRefund(String idRefund, String statusBaru) {
        Optional<Refund> refundOptional = refundRepository.findById(idRefund);

        if (refundOptional.isPresent()) {
            Refund r = refundOptional.get();
            r.setStatusRefund(statusBaru);

            // Simpan pembaruan status ke database
            refundRepository.save(r);

            return "Berhasil: Status refund " + idRefund + " telah diubah menjadi " + statusBaru;
        }

        return "Gagal: Refund dengan ID " + idRefund + " tidak ditemukan.";
    }
}