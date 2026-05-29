package com.tixevent.backend.service;

import com.tixevent.backend.entity.Panitia;
import com.tixevent.backend.entity.CheckInSystem;
import com.tixevent.backend.entity.Tiket;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class CheckInService {
    private final List<Panitia> panitiaList = new ArrayList<>();
    private final List<CheckInSystem> checkInList = new ArrayList<>();
    private final List<Tiket> tiketList = new ArrayList<>();

    // Constructor mengisi dummy data baru yang sudah disesuaikan seutuhnya
    public CheckInService() {
        // Menambahkan dummy data Panitia
        panitiaList.add(new Panitia("P001", "Ariel Ahnaf", "ariel@tixevent.com", "password123", "08123456789", "Registrasi"));
        panitiaList.add(new Panitia("P002", "Budi Santoso", "budi@tixevent.com", "password321", "08987654321", "Validator Gerbang"));

        // Menambahkan dummy data CheckInSystem
        checkInList.add(new CheckInSystem("CI-001", "Gerbang Utama A"));
        checkInList.add(new CheckInSystem("CI-002", "Gerbang VIP"));

        // Menambahkan dummy data Tiket (kodeTiket, kategori, harga, statusDigunakan)
        tiketList.add(new Tiket("TIX-CONCERT-001", "Reguler", 150000.0, false));
        tiketList.add(new Tiket("TIX-VIP-002", "VIP", 500000.0, true)); // Tiket yang sudah terpakai
        tiketList.add(new Tiket("TIX-FEST-003", "Festival", 250000.0, false));
    }

    /**
     * Logika Validasi Tiket Minggu ke-2 (Poin 1 di Notion)
     * Memeriksa kecocokan String input, mencari objek Tiket, lalu mengubah statusnya
     */
    public boolean eksekusiCheckIn(String inputTicketCode) {
        if (inputTicketCode == null || inputTicketCode.trim().isEmpty()) {
            System.out.println("Check-In Gagal: Kode tiket kosong!");
            return false;
        }

        // Cari objek tiket di dalam database list dummy berdasarkan kode input
        Tiket tiketDitemukan = null;
        for (Tiket t : tiketList) {
            if (t.getKodeTiket().equals(inputTicketCode)) {
                tiketDitemukan = t;
                break;
            }
        }

        // 1. Validasi: Jika tiket tidak ditemukan di sistem
        if (tiketDitemukan == null) {
            System.out.println("Check-In Gagal: Tiket tidak valid atau tidak terdaftar!");
            return false;
        }

        // 2. Validasi: Jika tiket ditemukan tapi cekStatus() menghasilkan true (sudah terpakai)
        if (tiketDitemukan.cekStatus()) {
            System.out.println("Check-In Gagal: Tiket " + inputTicketCode + " sudah pernah digunakan!");
            return false;
        }

        // 3. Sukses: Ubah flag boolean statusDigunakan menjadi true menggunakan method bawaannya
        tiketDitemukan.tandaiDigunakan();
        System.out.println("Check-In Berhasil untuk Tiket: " + inputTicketCode);
        return true;
    }

    // Pengelolaan data internal service
    public void savePanitia(Panitia panitia) { panitiaList.add(panitia); }
    public List<Panitia> findAllPanitia() { return panitiaList; }

    public void saveCheckIn(CheckInSystem checkIn) { checkInList.add(checkIn); }
    public List<CheckInSystem> findAllCheckIn() { return checkInList; }
    
    public List<Tiket> findAllTiket() { return tiketList; }
}