package com.tixevent.backend.service;

import com.tixevent.backend.entity.Crew;
import com.tixevent.backend.entity.Panitia;
import com.tixevent.backend.entity.ShiftLog;
import com.tixevent.backend.repository.CrewRepository;
import com.tixevent.backend.repository.PanitiaRepository;
import com.tixevent.backend.repository.ShiftLogRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CrewService {

    private final CrewRepository crewRepository;
    private final ShiftLogRepository shiftLogRepository;
    private final PanitiaRepository panitiaRepository;

    @Autowired
    public CrewService(CrewRepository crewRepository, ShiftLogRepository shiftLogRepository, PanitiaRepository panitiaRepository) {
        this.crewRepository = crewRepository;
        this.shiftLogRepository = shiftLogRepository;
        this.panitiaRepository = panitiaRepository;
    }

    // Mendapatkan seluruh daftar Panitia dari database
    public List<Panitia> getAllPanitia() {
        return panitiaRepository.findAll();
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
