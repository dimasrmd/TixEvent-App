package com.tixevent.backend.controller;

import com.tixevent.backend.entity.Refund;
import com.tixevent.backend.service.RefundService; // Import diubah ke RefundService
import org.springframework.http.ResponseEntity;
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

    // Endpoint POST untuk pengunjung mengajukan refund
    @PostMapping("/ajukan")
    public ResponseEntity<?> ajukanRefund(@RequestBody Map<String, Object> request) {
        try {
            // Mengambil data dari JSON
            String idTransaksi = (String) request.get("idTransaksi");
            String alasan = (String) request.get("alasan");

            // Konversi nilai angka yang masuk agar selalu aman menjadi double
            double jumlahRefund = Double.parseDouble(request.get("jumlahRefund").toString());

            // Validasi data kosong
            if (idTransaksi == null || alasan == null) {
                return ResponseEntity.badRequest().body(Map.of(
                        "status", "Failed",
                        "message", "Data idTransaksi dan alasan wajib diisi!"
                ));
            }

            // Panggil logika service
            String result = refundService.ajukanRefund(idTransaksi, alasan, jumlahRefund);

            // Balikan (Response)
            if (result.startsWith("Berhasil")) {
                return ResponseEntity.ok(Map.of(
                        "status", "Success",
                        "message", result
                ));
            } else {
                return ResponseEntity.badRequest().body(Map.of(
                        "status", "Failed",
                        "message", result
                ));
            }
        } catch (NumberFormatException e) {
            // Ini khusus menangkap error jika angka salah format
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "Failed",
                    "message", "Format data salah. Pastikan jumlahRefund berupa angka."
            ));
        } catch (Exception e) {
            // Ini menangkap error lainnya (seperti database conflict)
            e.printStackTrace(); // Tampilkan error aslinya di terminal merah IntelliJ
            return ResponseEntity.status(500).body(Map.of(
                    "status", "Error",
                    "message", "Terjadi kesalahan sistem: " + e.getMessage()
            ));
        }
    }
}