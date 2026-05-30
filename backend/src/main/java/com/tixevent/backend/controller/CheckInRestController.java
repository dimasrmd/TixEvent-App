package com.tixevent.backend.controller;

import com.tixevent.backend.service.CheckInService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/checkin")
@CrossOrigin(origins = "http://localhost:3000")
public class CheckInRestController {

    private final CheckInService checkInService;

    // Constructor Injection sesuai standar Dependency Injection Spring
    @Autowired
    public CheckInRestController(CheckInService checkInService) {
        this.checkInService = checkInService;
    }

    @PostMapping("/validate")
    public ResponseEntity<?> validateTicket(@RequestBody Map<String, String> requestBody) {
        String kodeTiket = requestBody.get("kodeTiket");

        if (kodeTiket == null || kodeTiket.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                "status", "Failed",
                "message", "Kode tiket tidak boleh kosong!"
            ));
        }

        // Memanggil fungsi asli dari CheckInService milikmu yang mengembalikan boolean
        boolean isSuccess = checkInService.eksekusiCheckIn(kodeTiket);
        
        if (isSuccess) {
            return ResponseEntity.ok(Map.of(
                "status", "Success",
                "statusDigunakan", true,
                "message", "Check-in sukses! Kode tiket valid."
            ));
        } else {
            return ResponseEntity.status(400).body(Map.of(
                "status", "Failed",
                "statusDigunakan", false,
                "message", "Check-in gagal! Kode tiket salah, tidak terdaftar, atau sudah pernah digunakan."
            ));
        }
    }
}