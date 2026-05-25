package com.tixevent.backend.controller;

import com.tixevent.backend.service.TiketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

// Wajib ditambahkan agar frontend Next.js (port 3000) diizinkan mengakses API ini
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/tiket")
public class TiketRestController {

    @Autowired
    private TiketService tiketService;

    // Endpoint: POST http://localhost:8080/api/tiket/beli
    @PostMapping("/beli")
    public Map<String, Object> beliTiket(@RequestBody BeliTiketRequest request) {

        // Controller tidak perlu mikir, cukup panggil service yang sudah kamu buat tadi
        return tiketService.beliTiket(
                request.getIdUser(),
                request.getKategori(),
                request.getJumlah()
        );
    }

    // Class pembantu (DTO) untuk menangkap format JSON dari Frontend
    public static class BeliTiketRequest {
        private String idUser;
        private String kategori;
        private int jumlah;

        // Getter dan Setter wajib ada agar Spring Boot bisa otomatis membaca JSON
        public String getIdUser() {
            return idUser;
        }

        public void setIdUser(String idUser) {
            this.idUser = idUser;
        }

        public String getKategori() {
            return kategori;
        }

        public void setKategori(String kategori) {
            this.kategori = kategori;
        }

        public int getJumlah() {
            return jumlah;
        }

        public void setJumlah(int jumlah) {
            this.jumlah = jumlah;
        }
    }
}