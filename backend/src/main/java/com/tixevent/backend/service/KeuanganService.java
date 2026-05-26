package com.tixevent.backend.service;

import com.tixevent.backend.entity.FinancialReport;
import com.tixevent.backend.entity.Refund;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

// Anotasi @Service menandakan bahwa kelas ini adalah Service / Logika Bisnis di Spring Boot
@Service
public class KeuanganService {

    // In-Memory List (Wadah data sementara)
    private List<FinancialReport> daftarLaporan = new ArrayList<>();
    private List<Refund> daftarRefund = new ArrayList<>();

    // Constructor: Otomatis mengisi data dummy saat aplikasi Spring Boot berjalan
    public KeuanganService() {
        // Dummy Data Laporan Keuangan
        FinancialReport laporanBulanIni = new FinancialReport("LAP-001", 50000000.0, 1500000.0, 48500000.0);
        daftarLaporan.add(laporanBulanIni);

        // Dummy Data Refund
        Refund refund1 = new Refund("REF-001", "Sakit / Tidak bisa hadir", 500000.0, "PENDING");
        Refund refund2 = new Refund("REF-002", "Salah beli tanggal acara", 1000000.0, "APPROVED");
        daftarRefund.add(refund1);
        daftarRefund.add(refund2);
    }

    // Method untuk mengambil data dummy yang nanti akan dipanggil oleh Controller di Minggu 2
    public List<FinancialReport> getDaftarLaporan() {
        return daftarLaporan;
    }

    public List<Refund> getDaftarRefund() {
        return daftarRefund;
    }
}