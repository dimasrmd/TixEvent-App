package com.tixevent.backend.controller;

import com.tixevent.backend.entity.FinancialReport;
import com.tixevent.backend.service.KeuanganService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/keuangan")
@CrossOrigin(origins = "http://localhost:3000")
public class KeuanganRestController {

    private final KeuanganService keuanganService;

    // Dependensi injection dari spring boot
    public KeuanganRestController(KeuanganService keuanganService) {
        this.keuanganService = keuanganService;
    }

    // Endpoint GET untuk mengambil data Laporan Keuangan
    @GetMapping("/laporan")
    public FinancialReport getLaporan() {
        return keuanganService.getLaporanTerkini();
    }

    @GetMapping("/transaksi")
    public java.util.List<com.tixevent.backend.entity.Transaksi> getTransaksi() {
        return keuanganService.getAllTransaksi();
    }
}
