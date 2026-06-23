package com.tixevent.backend.service;

import com.tixevent.backend.entity.FinancialReport;
import com.tixevent.backend.entity.Refund;
import com.tixevent.backend.entity.Transaksi;
import com.tixevent.backend.repository.FinancialReportRepository;
import com.tixevent.backend.repository.RefundRepository;
import com.tixevent.backend.repository.TransaksiRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class KeuanganService {

    private final FinancialReportRepository financialReportRepository;
    private final TransaksiRepository transaksiRepository;
    private final RefundRepository refundRepository;

    // Suntikkan ketiga repository agar kita bisa saling membaca data
    @Autowired
    public KeuanganService(FinancialReportRepository financialReportRepository,
                           TransaksiRepository transaksiRepository,
                           RefundRepository refundRepository) {
        this.financialReportRepository = financialReportRepository;
        this.transaksiRepository = transaksiRepository;
        this.refundRepository = refundRepository;
    }

    public List<FinancialReport> getDaftarLaporan() {
        return financialReportRepository.findAll();
    }

    // LOGIKA BARU: MENGHITUNG LAPORAN SECARA REAL-TIME
    public FinancialReport getLaporanTerkini() {
        // 1. Ambil seluruh data dari tabel Transaksi dan Refund
        List<Transaksi> daftarTransaksi = transaksiRepository.findAll();
        List<Refund> daftarRefund = refundRepository.findAll();

        // 2. Hitung Total Pemasukan (Hanya dari Transaksi yang LUNAS)
        double totalPemasukan = 0.0;
        for (Transaksi trx : daftarTransaksi) {
            // Asumsi method di Entity adalah getStatusPembayaran() dan getTotalBayar()
            if ("LUNAS".equalsIgnoreCase(trx.getStatusPembayaran())) {
                totalPemasukan += trx.getTotalBayar();
            }
        }

        // 3. Hitung Total Pengeluaran (Hanya dari Refund yang APPROVED)
        double totalRefund = 0.0;
        for (Refund rfd : daftarRefund) {
            // Asumsi method di Entity adalah getStatusRefund() dan getJumlahRefund()
            if ("APPROVED".equalsIgnoreCase(rfd.getStatusRefund())) {
                totalRefund += rfd.getJumlahRefund();
            }
        }

        // 4. Hitung Laba Bersih
        double labaBersih = totalPemasukan - totalRefund;

        // 5. Kemas menjadi objek Laporan Keuangan
        FinancialReport laporanRealTime = new FinancialReport();
        laporanRealTime.setIdLaporan("LAP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        laporanRealTime.setTotalPemasukan(totalPemasukan);
        laporanRealTime.setTotalRefund(totalRefund);
        laporanRealTime.setLabaBersih(labaBersih);

        // (Opsional) Simpan ke database jika kamu ingin menjadikannya riwayat permanen
        financialReportRepository.save(laporanRealTime);

        return laporanRealTime;
    }

    public List<Transaksi> getAllTransaksi() {
        return transaksiRepository.findAll();
    }
}