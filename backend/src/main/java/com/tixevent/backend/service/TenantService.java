package com.tixevent.backend.service;

import com.tixevent.backend.entity.BoothArea;
import com.tixevent.backend.entity.Tenant;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TenantService {

    private final List<Tenant> tenantList = new ArrayList<>();
    private final List<BoothArea> boothList = new ArrayList<>();

    public TenantService() {

      // Initialize sample tenants
tenantList.add(
        new Tenant(
                "T001",                    // idUser   ← tambah
                "PT Maju Jaya",
                "info@majujaya.com",
                "password123",
                "081234567890",            // noHp     ← tambah
                "PT Maju Jaya",
                "Makanan & Minuman"
        )
);

tenantList.add(
        new Tenant(
                "T002",                    // idUser   ← tambah
                "CV Kreatif Nusantara",
                "contact@kreatif.com",
                "password456",
                "081234567891",            // noHp     ← tambah
                "CV Kreatif Nusantara",
                "Kerajinan Tangan"
        )
);

tenantList.add(
        new Tenant(
                "T003",                    // idUser   ← tambah
                "Toko Fashion Premium",
                "sales@fashion.com",
                "password789",
                "081234567892",            // noHp     ← tambah
                "Toko Fashion Premium",
                "Fashion & Tekstil"
        )
    
);
boothList.add(new BoothArea("B01", "01", "Hall A", 500000, false));
boothList.add(new BoothArea("B02", "02", "Hall B", 700000, true));
boothList.add(new BoothArea("B03", "03", "Hall C", 600000, false));
}
    // GET all tenants
    public List<Tenant> getAllTenants() {
        return new ArrayList<>(tenantList);
    }

    // GET booth kosong
    public List<BoothArea> getAvailableBooth() {

        List<BoothArea> availableBooth = new ArrayList<>();

        for (BoothArea booth : boothList) {
            if (!booth.isStatusBooth()) {
                availableBooth.add(booth);
            }
        }

        return availableBooth;
    }

    // POST bayar sewa booth
    public String rentBooth(String idBooth) {

        for (BoothArea booth : boothList) {

            if (booth.getIdBooth().equals(idBooth)) {

                if (!booth.isStatusBooth()) {

                    booth.setStatusBooth(true);

                    return "Booth berhasil disewa";
                }

                return "Booth sudah terisi";
            }
        }

        return "Booth tidak ditemukan";
    }
}