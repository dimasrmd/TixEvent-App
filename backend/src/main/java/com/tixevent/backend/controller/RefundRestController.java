package com.tixevent.backend.controller;

import com.tixevent.backend.entity.Refund;
import com.tixevent.backend.service.RefundService; // Import diubah ke RefundService
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/refund")
@CrossOrigin(origins = "http://localhost:3000")
public class RefundRestController {

    private final RefundService refundService; // Variabel diubah menjadi RefundService

    // Dependency Injection
    public RefundRestController(RefundService refundService) {
        this.refundService = refundService;
    }

    // Endpoint GET untuk melihat semua daftar refund (untuk tabel Manajer)
    @GetMapping
    public List<Refund> getAllRefunds() {
        // Memanggil method dari RefundService
        return refundService.getDaftarRefund();
    }

    // Endpoint PUT untuk mengubah status refund (Approve/Reject)
    @PutMapping("/proses/{idRefund}")
    public String updateStatusRefund(@PathVariable String idRefund, @RequestBody Map<String, String> request) {
        // Mengambil status baru yang dikirim dari bentuk JSON {"statusRefund" : "APPROVED"}
        String statusBaru = request.get("statusRefund");

        // Memanggil method dari RefundService
        return refundService.prosesRefund(idRefund, statusBaru);
    }
}