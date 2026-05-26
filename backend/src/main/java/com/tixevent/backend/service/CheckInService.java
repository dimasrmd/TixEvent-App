package com.tixevent.backend.service;

import com.tixevent.backend.entity.Panitia;
import com.tixevent.backend.entity.CheckInSystem;
import java.util.ArrayList;
import java.util.List;

public class CheckInService {
    // Wadah data dummy sementara (In-Memory List) sesuai instruksi kelompok
    private final List<Panitia> panitiaList = new ArrayList<>();
    private final List<CheckInSystem> checkInList = new ArrayList<>();

    // Constructor: Tempat menambahkan dummy data langsung di lapisan Service
    public CheckInService() {
        // 1. Mengisi dummy data untuk Panitia
        panitiaList.add(new Panitia("P001", "Ariel Ahnaf", "ariel@tixevent.com", "password123", "Registrasi"));
        panitiaList.add(new Panitia("P002", "Budi Santoso", "budi@tixevent.com", "password321", "Validator Gerbang"));

        // 2. Mengisi dummy data untuk CheckInSystem (idCheckIn, gateMasuk, ticketCode)
        checkInList.add(new CheckInSystem("CI-001", "Gerbang Utama A", "TIX-CONCERT-001"));
        checkInList.add(new CheckInSystem("CI-002", "Gerbang VIP", "TIX-VIP-002"));
    }

    // Logika Pengelolaan Data Panitia
    public void savePanitia(Panitia panitia) {
        panitiaList.add(panitia);
    }

    public List<Panitia> findAllPanitia() {
        return panitiaList;
    }

    // Logika Pengelolaan Data CheckInSystem
    public void saveCheckIn(CheckInSystem checkIn) {
        checkInList.add(checkIn);
    }

    public List<CheckInSystem> findAllCheckIn() {
        return checkInList;
    }
}