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

    public String ajukanRefund(String idTransaksi, String alasan) {
        // 1. Validasi apakah transaksi aslinya ada di database
        Optional<Transaksi> trxOpt = transaksiRepository.findById(idTransaksi);
        if (trxOpt.isEmpty()) {
            return "Gagal: Transaksi dengan ID " + idTransaksi + " tidak ditemukan!";
        }

        Transaksi trx = trxOpt.get();

        // 2. Cek apakah refund untuk transaksi ini sudah ada
        Optional<Refund> existingRefund = refundRepository.findByTransaksi(trx);
        if (existingRefund.isPresent()) {
            Refund r = existingRefund.get();
            if (r.getStatusRefund().equals("PENDING")) {
                return "Gagal: Pengajuan refund untuk transaksi ini sedang diproses.";
            } else if (r.getStatusRefund().equals("APPROVED")) {
                return "Gagal: Pengajuan refund untuk transaksi ini sudah disetujui sebelumnya.";
            } else if (r.getStatusRefund().equals("REJECTED")) {
                // Update existing refund instead of creating a new one
                r.setStatusRefund("PENDING");
                r.setAlasan(alasan);
                // jumlahRefund tetap sama
                refundRepository.save(r);
                return "Berhasil: Pengajuan ulang refund (yang sebelumnya ditolak) telah dikirim.";
            }
        }

        // 3. Buat objek Refund baru jika belum ada
        Refund pengajuanBaru = new Refund();
        String generatedId = "RFD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        pengajuanBaru.setIdRefund(generatedId);
        pengajuanBaru.setAlasan(alasan);
        pengajuanBaru.setJumlahRefund(trx.getTotalBayar()); // Mengacu ke totalBayar otomatis
        pengajuanBaru.setStatusRefund("PENDING"); // Status default sesuai sistem
        pengajuanBaru.setTransaksi(trx); // Hubungkan dengan transaksi asli

        // 4. Simpan ke database
        refundRepository.save(pengajuanBaru);
        return "Berhasil: Pengajuan refund berhasil dikirim dengan ID " + generatedId;
    }
}