package com.tixevent.backend.controller;

import com.tixevent.backend.entity.BoothArea;
import com.tixevent.backend.entity.Tenant;
import com.tixevent.backend.service.TenantService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tenant")
@CrossOrigin(origins = "http://localhost:3000")
public class TenantRestController {

    private final TenantService tenantService;

    public TenantRestController(TenantService tenantService) {
        this.tenantService = tenantService;
    }

    // GET daftar semua tenant
    @GetMapping
    public List<Tenant> getAllTenants() {
        return tenantService.getAllTenants();
    }

    // GET daftar booth kosong
    @GetMapping("/booth-kosong")
    public List<BoothArea> getAvailableBooth() {
        return tenantService.getAvailableBooth();
    }

    // POST bayar sewa booth
    @PostMapping("/bayar")
    public String rentBooth(@RequestBody Map<String, String> request) {

        String idBooth = request.get("idBooth");

        return tenantService.rentBooth(idBooth);
    }
}