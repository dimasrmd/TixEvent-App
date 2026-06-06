package com.tixevent.backend.service;

import com.tixevent.backend.entity.BoothArea;
import com.tixevent.backend.entity.Tenant;
import com.tixevent.backend.repository.BoothAreaRepository;
import com.tixevent.backend.repository.TenantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class TenantService {

    private final TenantRepository tenantRepository;
    private final BoothAreaRepository boothAreaRepository;
    private final com.tixevent.backend.repository.TransaksiRepository transaksiRepository;

    // Menggunakan Constructor Injection agar lebih aman (Best Practice)
    @Autowired
    public TenantService(TenantRepository tenantRepository, BoothAreaRepository boothAreaRepository, com.tixevent.backend.repository.TransaksiRepository transaksiRepository) {
        this.tenantRepository = tenantRepository;
        this.boothAreaRepository = boothAreaRepository;
        this.transaksiRepository = transaksiRepository;
    }

    // GET all tenants
    public List<Tenant> getAllTenants() {
        return tenantRepository.findAll();
    }

    // GET booth kosong
    public List<BoothArea> getAvailableBooth() {
        List<BoothArea> allBooths = boothAreaRepository.findAll();
        List<BoothArea> availableBooth = new ArrayList<>();

        for (BoothArea booth : allBooths) {
            if (!booth.isStatusBooth()) {
                availableBooth.add(booth);
            }
        }
        return availableBooth;
    }

    // POST bayar sewa booth
    public String sewaBooth(String idBooth, String idTenant) {
        Optional<BoothArea> boothOptional = boothAreaRepository.findById(idBooth);

        if (boothOptional.isPresent()) {
            BoothArea booth = boothOptional.get();

            if (!booth.isStatusBooth()) {
                // 1. Ubah status booth di database
                booth.setStatusBooth(true);

                // 2. Cari Tenant yang sedang login
                Optional<Tenant> tenantOpt = tenantRepository.findById(idTenant);
                if (tenantOpt.isPresent()) {
                    Tenant penyewa = tenantOpt.get();
                    
                    // Validasi: Pastikan Tenant belum menyewa booth lain (aturan 1-to-1)
                    List<BoothArea> allBooths = boothAreaRepository.findAll();
                    for (BoothArea b : allBooths) {
                        if (b.getTenant() != null && b.getTenant().getIdUser().equals(idTenant)) {
                            return "Gagal: Anda sudah menyewa Booth " + b.getNomorBooth() + ". Setiap tenant maksimal 1 booth.";
                        }
                    }
                    
                    // 3. Hubungkan Tenant dengan Booth
                    booth.setTenant(penyewa);
                    boothAreaRepository.save(booth);
                    
                    // 4. Ciptakan Transaksi untuk Laporan Keuangan
                    com.tixevent.backend.entity.Transaksi trx = new com.tixevent.backend.entity.Transaksi();
                    trx.setIdTransaksi("TRX-BTH-" + UUID.randomUUID().toString().substring(0, 5).toUpperCase());
                    
                    // Set waktu menggunakan format yyyy-MM-dd HH:mm:ss
                    java.time.LocalDateTime now = java.time.LocalDateTime.now();
                    java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
                    trx.setTanggalTransaksi(now.format(formatter));
                    
                    trx.setTotalBayar(booth.getHargaSewa());
                    trx.setStatusPembayaran("LUNAS");
                    trx.setUser(penyewa);
                    transaksiRepository.save(trx);

                    return "Berhasil: Booth disewa oleh " + penyewa.getNamaUsaha();
                } else {
                    return "Gagal: Data Tenant tidak ditemukan di database.";
                }
            }

            return "Gagal: Booth sudah terisi";
        }

        return "Gagal: Booth tidak ditemukan";
    }

    // POST tambah booth baru (Admin)
    public BoothArea tambahBooth(BoothArea boothBaru) {
        if (boothBaru.getIdBooth() == null || boothBaru.getIdBooth().isEmpty()) {
            boothBaru.setIdBooth("BTH-" + java.util.UUID.randomUUID().toString().substring(0, 4).toUpperCase());
        }
        boothBaru.setStatusBooth(false);
        return boothAreaRepository.save(boothBaru);
    }

    // GET booth tersewa (Admin)
    public List<BoothArea> getBoothTersewa() {
        List<BoothArea> allBooths = boothAreaRepository.findAll();
        List<BoothArea> tersewa = new java.util.ArrayList<>();
        for (BoothArea booth : allBooths) {
            if (booth.isStatusBooth() && booth.getTenant() != null) {
                tersewa.add(booth);
            }
        }
        return tersewa;
    }

    // POST tambah tenant baru secara manual (Skenario Admin)
    public Tenant tambahTenant(Tenant tenantBaru) {
        // Jika ID belum diisi dari JSON, generate otomatis
        if (tenantBaru.getIdUser() == null || tenantBaru.getIdUser().isEmpty()) {
            String generatedId = "TNT-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
            tenantBaru.setIdUser(generatedId);
        }

        // Pastikan role-nya selalu tenant
        tenantBaru.setRole("tenant");

        // Simpan ke database
        return tenantRepository.save(tenantBaru);
    }
}