package com.tixevent.backend.service;

import com.tixevent.backend.entity.Crew;
import com.tixevent.backend.entity.ShiftLog;
import com.tixevent.backend.repository.CrewRepository;
import com.tixevent.backend.repository.ShiftLogRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CrewService {

    private final CrewRepository crewRepository;
    private final ShiftLogRepository shiftLogRepository;

    @Autowired
    public CrewService(CrewRepository crewRepository, ShiftLogRepository shiftLogRepository) {
        this.crewRepository = crewRepository;
        this.shiftLogRepository = shiftLogRepository;
    }

    // Auto-Seeder Database: Menyuntikkan data dummy jika database Supabase kosong
    @PostConstruct
    public void initDummyData() {
        if (crewRepository.count() == 0) {
            // Inisialisasi Data Dummy Crew
            Crew c1 = new Crew("CRW-007", "Lutfi Shidqi", "lutfi@tixevent.com", "lutfi123", "081234567890", "Stage Manager");
            Crew c2 = new Crew("CRW-001", "Budi Santoso", "budi@tixevent.com", "budi123", "081234567891", "Security Coordinator");
            Crew c3 = new Crew("CRW-002", "Siti Aminah", "siti@tixevent.com", "siti123", "081234567892", "Gate Control");
            
            crewRepository.save(c1);
            crewRepository.save(c2);
            crewRepository.save(c3);

            // Inisialisasi Data Dummy ShiftLog
            // Format: idShift, Crew, tanggal, jamMulai, jamSelesai, posTugas, statusHadir
            shiftLogRepository.save(new ShiftLog("SHF-101", c1, "2026-05-25", "07:00", "15:00", "Stage A", "Belum Absen"));
            shiftLogRepository.save(new ShiftLog("SHF-102", c3, "2026-05-25", "15:00", "23:00", "Gate Utama", "Belum Absen"));
            shiftLogRepository.save(new ShiftLog("SHF-103", c2, "2026-05-25", "08:00", "16:00", "Pos Barat", "Hadir"));
        }
    }

    // Mendapatkan seluruh daftar Crew dari database
    public List<Crew> getAllCrew() {
        return crewRepository.findAll();
    }

    // Mendapatkan seluruh daftar ShiftLog dari database
    public List<ShiftLog> getAllShifts() {
        return shiftLogRepository.findAll();
    }

    // Logika validasi dan pencatatan presensi kehadiran kru (PUT) langsung ke Supabase
    public boolean catatPresensi(String idShift, String idCrew, String statusHadir) {
        Optional<ShiftLog> optShift = shiftLogRepository.findById(idShift);
        
        if (optShift.isPresent()) {
            ShiftLog shift = optShift.get();
            
            // Validasi kesesuaian kru yang terdaftar di shift tersebut
            if (shift.getCrew() != null && shift.getCrew().getIdUser().equals(idCrew)) {
                shift.setStatusHadir(statusHadir);
                shiftLogRepository.save(shift); // Simpan pembaruan status kehadiran ke database Supabase
                return true; // Berhasil dicatat
            }
        }
        return false; // Gagal (Shift tidak ditemukan atau Kru tidak sesuai)
    }

    // Logika Tambah Shift Baru
    public String tambahShift(String idCrew, String tanggal, String jamMulai, String jamSelesai, String posTugas) {
        // Cek apakah kru terdaftar
        Optional<Crew> crewOpt = crewRepository.findById(idCrew);
        if (crewOpt.isEmpty()) {
            return "Gagal: Kru dengan ID " + idCrew + " tidak ditemukan!";
        }

        ShiftLog shiftBaru = new ShiftLog();
        String generatedId = "SHF-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        shiftBaru.setIdShift(generatedId);
        shiftBaru.setTanggal(tanggal);        // Cukup begini saja
        shiftBaru.setJamMulai(jamMulai);      // Cukup begini saja
        shiftBaru.setJamSelesai(jamSelesai);  // Cukup begini saja
        shiftBaru.setPosTugas(posTugas);
        shiftBaru.setStatusHadir("Belum Absen");
        shiftBaru.setCrew(crewOpt.get());

        shiftLogRepository.save(shiftBaru);
        return "Berhasil: Jadwal shift baru untuk kru dibuat dengan ID " + generatedId;
    }

    // 2. Logika Ubah Shift
    public String ubahShift(String idShift, String tanggal, String jamMulai, String jamSelesai, String posTugas) {
        Optional<ShiftLog> shiftOpt = shiftLogRepository.findById(idShift);
        if (shiftOpt.isEmpty()) {
            return "Gagal: Shift dengan ID " + idShift + " tidak ditemukan!";
        }

        ShiftLog shiftDiubah = shiftOpt.get();
        // Ubah data sesuai inputan manajer
        shiftDiubah.setTanggal(tanggal);
        shiftDiubah.setJamMulai(jamMulai);
        shiftDiubah.setJamSelesai(jamSelesai);
        shiftDiubah.setPosTugas(posTugas);

        shiftLogRepository.save(shiftDiubah);
        return "Berhasil: Jadwal shift " + idShift + " berhasil dirombak.";
    }
}
