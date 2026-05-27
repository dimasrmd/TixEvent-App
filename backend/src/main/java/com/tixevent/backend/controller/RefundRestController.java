package com.tixevent.backend.controller;

import com.tixevent.backend.entity.Refund;
import com.tixevent.backend.service.KeuanganService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/refund")
@CrossOrigin(origins = "http://localhost:3000")
public class RefundRestController {

    private final KeuanganService keuanganService;

    public RefundRestController(KeuanganService keuanganService) {
        this.keuanganService = keuanganService;
    }

    // Endpoint GET untuk melihat semua daftar refund (untuk tabel Manajer)
    @GetMapping
    public List<Refund> getAllRefunds() {
        return keuanganService.getDaftarRefund();
    }

    // Endpoint PUT untuk mengubah status refund (Approve/Reject)
    @PutMapping("/proses/{idRefund}")
    public String updateStatusRefund(@PathVariable String idRefund, @RequestBody Map<String, String> request) {
        // Mengambil status baru yang dikirim dari bentuk JSON {"statusRefund" : "APPROVED"}
        String statusBaru = request.get("statusRefund");

        return keuanganService.prosesRefund(idRefund, statusBaru);
    }
}