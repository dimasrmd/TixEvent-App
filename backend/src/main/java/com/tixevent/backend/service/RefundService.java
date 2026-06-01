package com.tixevent.backend.service;

import com.tixevent.backend.entity.Refund;
import com.tixevent.backend.entity.Transaksi;
import com.tixevent.backend.repository.RefundRepository;
import com.tixevent.backend.repository.TransaksiRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefundService {

    private final RefundRepository refundRepository;
    private final TransaksiRepository transaksiRepository;

    @Autowired
    public RefundService(RefundRepository refundRepository, TransaksiRepository transaksiRepository) {
        this.refundRepository = refundRepository;
        this.transaksiRepository = transaksiRepository;
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

    public String ajukanRefund(String idTransaksi, String alasan, double jumlahRefund) {
        // 1. Validasi apakah transaksi aslinya ada di database
        Optional<Transaksi> trxOpt = transaksiRepository.findById(idTransaksi);
        if (trxOpt.isEmpty()) {
            return "Gagal: Transaksi dengan ID " + idTransaksi + " tidak ditemukan!";
        }

        // 2. Buat objek Refund baru
        Refund pengajuanBaru = new Refund();
        String generatedId = "RFD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        pengajuanBaru.setIdRefund(generatedId);
        pengajuanBaru.setAlasan(alasan);
        pengajuanBaru.setJumlahRefund(jumlahRefund);
        pengajuanBaru.setStatusRefund("PENDING"); // Status default sesuai sistem
        pengajuanBaru.setTransaksi(trxOpt.get()); // Hubungkan dengan transaksi asli

        // 3. Simpan ke database
        refundRepository.save(pengajuanBaru);
        return "Berhasil: Pengajuan refund berhasil dikirim dengan ID " + generatedId;
    }
}