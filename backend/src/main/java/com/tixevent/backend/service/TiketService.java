package com.tixevent.backend.service;

import com.tixevent.backend.entity.Tiket;
import com.tixevent.backend.entity.Transaksi;
import com.tixevent.backend.repository.TiketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@Service
public class TiketService {

    // 1. PENGHUBUNG DATABASE (Sesuai instruksi Fase 2)
    @Autowired
    private TiketRepository tiketRepository;

    // 2. METHOD BARU (Menyimpan tiket ke database)
    public Tiket buatTiket(Tiket tiket) {
        return tiketRepository.save(tiket);
    }

    // 3. METHOD LAMA (Dipertahankan bentuknya agar TiketRestController tidak eror)
    public Map<String, Object> beliTiket(String idUser, String kategori, int jumlah) {

        Map<String, Object> response = new HashMap<>();

        // Balasan sementara selama masa transisi ke database JPA
        response.put("status", "info");
        response.put("message", "Fitur pembelian sedang dalam migrasi ke database (JPA).");

        return response;
    }
}