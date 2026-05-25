package com.tixevent.backend.service;

import com.tixevent.backend.entity.Crew;
import com.tixevent.backend.entity.ShiftLog;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CrewService {
    // Wadah data dummy sementara (In-Memory List)
    private final List<Crew> crewList = new ArrayList<>();
    private final List<ShiftLog> shiftList = new ArrayList<>();

    public CrewService() {
        // Inisialisasi Data Dummy Crew
        crewList.add(new Crew("CRW-007", "Lutfi Shidqi", "lutfi@tixevent.com", "lutfi123", "081234567890", "Stage Manager"));
        crewList.add(new Crew("CRW-001", "Budi Santoso", "budi@tixevent.com", "budi123", "081234567891", "Security Coordinator"));
        crewList.add(new Crew("CRW-002", "Siti Aminah", "siti@tixevent.com", "siti123", "081234567892", "Gate Control"));

        // Inisialisasi Data Dummy ShiftLog
        // Format: idShift, idCrew, tanggal, jamMulai, jamSelesai, posTugas, statusHadir
        shiftList.add(new ShiftLog("SHF-101", "CRW-007", "2026-05-25", "07:00", "15:00", "Stage A", "Belum Absen"));
        shiftList.add(new ShiftLog("SHF-102", "CRW-002", "2026-05-25", "15:00", "23:00", "Gate Utama", "Belum Absen"));
        shiftList.add(new ShiftLog("SHF-103", "CRW-001", "2026-05-25", "08:00", "16:00", "Pos Barat", "Hadir"));
    }

    // Mendapatkan seluruh daftar Crew
    public List<Crew> getAllCrew() {
        return crewList;
    }

    // Mendapatkan seluruh daftar ShiftLog
    public List<ShiftLog> getAllShifts() {
        return shiftList;
    }

    // Logika validasi dan pencatatan presensi kehadiran kru (PUT)
    public boolean catatPresensi(String idShift, String idCrew, String statusHadir) {
        for (ShiftLog shift : shiftList) {
            if (shift.getIdShift().equals(idShift)) {
                // Validasi kesesuaian kru yang terdaftar di shift tersebut
                if (shift.getIdCrew().equals(idCrew)) {
                    shift.setStatusHadir(statusHadir);
                    return true; // Berhasil dicatat
                }
                break; // Shift ditemukan tetapi tidak cocok dengan Kru
            }
        }
        return false; // Gagal (Shift tidak ditemukan atau Kru tidak sesuai)
    }
}
