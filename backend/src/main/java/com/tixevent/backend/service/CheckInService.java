package com.tixevent.backend.service;

import com.tixevent.backend.entity.CheckInSystem;
import com.tixevent.backend.entity.Tiket;
import com.tixevent.backend.repository.CheckInRepository;
import com.tixevent.backend.repository.TiketRepository; // Pastikan repository tiket ini ada
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class CheckInService {

    private final CheckInRepository checkInRepository;
    private final TiketRepository tiketRepository;

    // Constructor Injection untuk menghubungkan Service dengan Database
    @Autowired
    public CheckInService(CheckInRepository checkInRepository, TiketRepository tiketRepository) {
        this.checkInRepository = checkInRepository;
        this.tiketRepository = tiketRepository;
    }

    /**
     * Logika Validasi Check-In Berbasis Database Nyata (Week 3)
     */
    public boolean eksekusiCheckIn(String inputTicketCode) {
        if (inputTicketCode == null || inputTicketCode.trim().isEmpty()) {
            return false;
        }

        // 1. Cari data tiket asli langsung dari database Supabase berdasarkan kode input
        Optional<Tiket> tiketOpt = tiketRepository.findById(inputTicketCode);
        
        // Validasi A: Jika tiket tidak ditemukan di database
        if (tiketOpt.isEmpty()) {
            System.out.println("Check-In Gagal: Tiket tidak valid atau tidak terdaftar di database!");
            return false;
        }

        Tiket tiketDitemukan = tiketOpt.get();

        // Validasi B: Jika status tiket di database menghasilkan true (sudah terpakai)
        if (tiketDitemukan.cekStatus()) { // Sesuaikan nama method status (misal: isUsed() / getStatusDigunakan())
            System.out.println("Check-In Gagal: Tiket " + inputTicketCode + " sudah pernah digunakan!");
            return false;
        }

        // 2. Sukses: Ubah status tiket menjadi terpakai, lalu perbarui datanya di database
        tiketDitemukan.tandaiDigunakan(); // Sesuaikan nama method pembaruan statusnya
        tiketRepository.save(tiketDitemukan);

        // 3. Rekam data pengunjung masuk ke dalam tabel check_in_system (Sesuai perintah Notion)
        CheckInSystem dataMasuk = new CheckInSystem();
        dataMasuk.setIdCheckIn(UUID.randomUUID().toString()); // Generate ID otomatis
        dataMasuk.setGateMasuk("Gerbang Utama"); // Contoh penamaan gate default
        dataMasuk.setTiket(tiketDitemukan);
        // dataMasuk.setTransaksi(tiketDitemukan.getTransaksi()); // Opsional jika relasi transaksi dibutuhkan langsung

        // Simpan data check-in baru ke database Supabase
        checkInRepository.save(dataMasuk);

        System.out.println("Check-In Berhasil direkam ke database untuk Tiket: " + inputTicketCode);
        return true;
    }
}