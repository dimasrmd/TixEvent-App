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

    // Menggunakan Constructor Injection agar lebih aman (Best Practice)
    @Autowired
    public TenantService(TenantRepository tenantRepository, BoothAreaRepository boothAreaRepository) {
        this.tenantRepository = tenantRepository;
        this.boothAreaRepository = boothAreaRepository;
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
    public String sewaBooth(String idBooth) {
        Optional<BoothArea> boothOptional = boothAreaRepository.findById(idBooth);

        if (boothOptional.isPresent()) {
            BoothArea booth = boothOptional.get();

            if (!booth.isStatusBooth()) {
                // 1. Ubah status booth di database
                booth.setStatusBooth(true);
                boothAreaRepository.save(booth);

                // 2. CIPTAKAN DATA TENANT BARU (Ini yang sebelumnya kurang!)
                Tenant penyewaBaru = new Tenant();

                // Karena Tenant extends User, ia butuh ID User sebagai Primary Key
                String idTenant = "TNT-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
                penyewaBaru.setIdUser(idTenant);

                // Beri data bawaan (dummy) yang masuk akal
                penyewaBaru.setNama("Penyewa " + booth.getNomorBooth());
                penyewaBaru.setRole("tenant");

                // 👇 BUKA KOMENTAR di bawah ini jika di kelas Tenant.java kamu memiliki relasi BoothArea
                // penyewaBaru.setBoothArea(booth);

                // 3. Simpan penyewa (Tenant) ke database!
                tenantRepository.save(penyewaBaru);

                return "Berhasil: Booth disewa dengan ID Tenant " + idTenant;
            }

            return "Gagal: Booth sudah terisi";
        }

        return "Gagal: Booth tidak ditemukan";
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