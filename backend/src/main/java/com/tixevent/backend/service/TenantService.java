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

@Service
public class TenantService {

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private BoothAreaRepository boothAreaRepository;
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
                booth.setStatusBooth(true);
                boothAreaRepository.save(booth);
                return "Booth berhasil disewa";
            }

            return "Booth sudah terisi";
        }

        return "Booth tidak ditemukan";
    }
}