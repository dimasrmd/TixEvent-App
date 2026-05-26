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
                        "PT Maju Jaya",
                        "info@majujaya.com",
                        "password123",
                        "PT Maju Jaya",
                        "Makanan & Minuman"
                )
        );

        tenantList.add(
                new Tenant(
                        "CV Kreatif Nusantara",
                        "contact@kreatif.com",
                        "password456",
                        "CV Kreatif Nusantara",
                        "Kerajinan Tangan"
                )
        );

        tenantList.add(
                new Tenant(
                        "Toko Fashion Premium",
                        "sales@fashion.com",
                        "password789",
                        "Toko Fashion Premium",
                        "Fashion & Tekstil"
                )
        );

        boothList.add(
                new BoothArea(
                        "B01",
                        "01",
                        "Hall A",
                        500000,
                        false
                )
        );

        boothList.add(
                new BoothArea(
                        "B02",
                        "02",
                        "Hall B",
                        700000,
                        true
                )
        );
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