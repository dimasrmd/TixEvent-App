package com.tixevent.backend.service;

import com.tixevent.backend.entity.Panitia;
import com.tixevent.backend.entity.CheckInSystem;
import com.tixevent.backend.entity.Tiket;
import java.util.ArrayList;
import java.util.List;

public class CheckInService {
    private final List<Panitia> panitiaList = new ArrayList<>();
    private final List<CheckInSystem> checkInList = new ArrayList<>();

    // Constructor mengisi dummy data baru yang sudah disesuaikan parameternya
    public CheckInService() {
        // Menambahkan dummy data Panitia (termasuk parameter noHp)
        panitiaList.add(new Panitia("P001", "Ariel Ahnaf", "ariel@tixevent.com", "password123", "08123456789", "Registrasi"));
        panitiaList.add(new Panitia("P002", "Budi Santoso", "budi@tixevent.com", "password321", "08987654321", "Validator Gerbang"));

        // Menambahkan dummy data CheckInSystem (idCheckIn, gateMasuk)
        checkInList.add(new CheckInSystem("CI-001", "Gerbang Utama A"));
        checkInList.add(new CheckInSystem("CI-002", "Gerbang VIP"));
    }

    /**
     * Logika Validasi Tiket yang dipindahkan dari entity ke lapisan Service
     */
    public boolean eksekusiCheckIn(CheckInSystem checkIn, Tiket tiket, String inputTicketCode) {
        if (tiket == null || !tiket.getKodeTiket().equals(inputTicketCode)) {
            System.out.println("Check-In Gagal: Tiket tidak valid!");
            return false;
        }

        if (tiket.cekStatus()) {
            System.out.println("Check-In Gagal: Tiket sudah pernah digunakan!");
            return false;
        }

        tiket.tandaiDigunakan();
        System.out.println("Check-In Berhasil di " + checkIn.getGateMasuk());
        return true;
    }

    // Pengelolaan data internal service
    public void savePanitia(Panitia panitia) { panitiaList.add(panitia); }
    public List<Panitia> findAllPanitia() { return panitiaList; }

    public void saveCheckIn(CheckInSystem checkIn) { checkInList.add(checkIn); }
    public List<CheckInSystem> findAllCheckIn() { return checkInList; }
}