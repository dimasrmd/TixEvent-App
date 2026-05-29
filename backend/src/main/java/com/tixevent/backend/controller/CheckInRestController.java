package com.tixevent.backend.controller;

import com.tixevent.backend.service.CheckInService;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

// Poin 2 di Notion: Menambahkan anotasi @RestController
@RestController
@RequestMapping("/api/checkin")
// Poin 3 di Notion: Menambahkan anotasi @CrossOrigin untuk port frontend Next.js
@CrossOrigin(origins = "http://localhost:3000")
public class CheckInRestController {

    // Instansiasi service untuk memanggil logika validasi tiket
    private final CheckInService checkInService = new CheckInService();

    /**
     * Poin 4 di Notion: Membuat metode POST untuk melakukan "Validasi Kode Tiket"
     */
    @PostMapping("/validate")
    public Map<String, Object> validasiKodeTiket(@RequestBody Map<String, String> requestBody) {
        // Mengambil kiriman data string "kodeTiket" dari request body Postman/Frontend
        String kodeTiket = requestBody.get("kodeTiket");
        
        // Melempar string kode ke service untuk dicek dan diubah status flag-nya
        boolean hasilCheckIn = checkInService.eksekusiCheckIn(kodeTiket);

        // Menyusun format data JSON balikan (Response) untuk Postman
        Map<String, Object> response = new HashMap<>();
        if (hasilCheckIn) {
            response.put("status", "Success");
            response.put("statusDigunakan", true); // Status tiket sekarang berubah menjadi true
            response.put("message", "Check-in sukses! Kode tiket valid.");
        } else {
            response.put("status", "Failed");
            response.put("statusDigunakan", false);
            response.put("message", "Check-in gagal! Kode tiket salah atau sudah pernah digunakan.");
        }

        return response;
    }
}