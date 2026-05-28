package com.tixevent.backend.service;

import com.tixevent.backend.entity.FinancialReport;
import com.tixevent.backend.repository.FinancialReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KeuanganService {

    private final FinancialReportRepository financialReportRepository;

    @Autowired
    public KeuanganService(FinancialReportRepository financialReportRepository) {
        this.financialReportRepository = financialReportRepository;
    }

    // Mengambil rekap seluruh laporan keuangan dari Supabase
    public List<FinancialReport> getDaftarLaporan() {
        return financialReportRepository.findAll();
    }

    // Mengambil ringkasan laporan terkini untuk dashboard
    public FinancialReport getLaporanTerkini() {
        List<FinancialReport> daftarLaporan = financialReportRepository.findAll();

        if (!daftarLaporan.isEmpty()) {
            return daftarLaporan.get(0);
        }

        // Data default jika tabel di database masih kosong
        FinancialReport emptyReport = new FinancialReport();
        emptyReport.setIdLaporan("LAP-EMPTY");
        return emptyReport;
    }
}