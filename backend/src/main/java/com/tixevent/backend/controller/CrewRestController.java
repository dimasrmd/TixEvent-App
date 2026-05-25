package com.tixevent.backend.controller;

import com.tixevent.backend.entity.Crew;
import com.tixevent.backend.entity.ShiftLog;
import com.tixevent.backend.service.CrewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000") // Konfigurasi CORS sesuai Dokumen Teknis
@RestController
@RequestMapping("/api/kru")
public class CrewRestController {

    @Autowired
    private CrewService crewService;

    // Endpoint untuk mendapatkan seluruh data Shift (GET)
    @GetMapping("/shifts")
    public ResponseEntity<List<ShiftLog>> getAllShifts() {
        return ResponseEntity.ok(crewService.getAllShifts());
    }

    // Endpoint untuk mendapatkan seluruh data Crew (GET)
    @GetMapping("/crews")
    public ResponseEntity<List<Crew>> getAllCrews() {
        return ResponseEntity.ok(crewService.getAllCrew());
    }

    // Endpoint pencatatan presensi kru (PUT)
    @PutMapping("/presensi")
    public ResponseEntity<Map<String, Object>> catatPresensi(@RequestBody PresensiRequest request) {
        Map<String, Object> response = new HashMap<>();

        // Validasi input
        if (request.getIdShift() == null || request.getIdCrew() == null || request.getStatusHadir() == null) {
            response.put("status", "error");
            response.put("message", "Gagal. Parameter idShift, idCrew, dan statusHadir wajib diisi.");
            return ResponseEntity.badRequest().body(response);
        }

        // Jalankan logika presensi di Service
        boolean success = crewService.catatPresensi(
                request.getIdShift(),
                request.getIdCrew(),
                request.getStatusHadir()
        );

        if (success) {
            String currentTime = new SimpleDateFormat("HH:mm").format(new Date());
            response.put("status", "success");
            response.put("message", "Presensi berhasil dicatat pada jam " + currentTime + ".");
            return ResponseEntity.ok(response);
        } else {
            response.put("status", "error");
            response.put("message", "Gagal. ID Shift tidak ditemukan atau Anda tidak terdaftar di shift ini.");
            return ResponseEntity.status(400).body(response);
        }
    }

    // Static Class DTO untuk Request Body Presensi
    public static class PresensiRequest {
        private String idShift;
        private String idCrew;
        private String statusHadir;

        public PresensiRequest() {
        }

        public PresensiRequest(String idShift, String idCrew, String statusHadir) {
            this.idShift = idShift;
            this.idCrew = idCrew;
            this.statusHadir = statusHadir;
        }

        public String getIdShift() {
            return idShift;
        }

        public void setIdShift(String idShift) {
            this.idShift = idShift;
        }

        public String getIdCrew() {
            return idCrew;
        }

        public void setIdCrew(String idCrew) {
            this.idCrew = idCrew;
        }

        public String getStatusHadir() {
            return statusHadir;
        }

        public void setStatusHadir(String statusHadir) {
            this.statusHadir = statusHadir;
        }
    }
}
