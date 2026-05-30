package com.tixevent.backend.controller;

import com.tixevent.backend.entity.BoothArea;
import com.tixevent.backend.entity.Tenant;
import com.tixevent.backend.service.TenantService;
import org.springframework.http.ResponseEntity;
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
    public String sewaBooth(@RequestBody Map<String, String> request) {

        String idBooth = request.get("idBooth");

        return tenantService.sewaBooth(idBooth);
    }

    // POST tambah tenant baru
    @PostMapping
    public ResponseEntity<?> tambahTenantBaru(@RequestBody Tenant tenant) {
        try {
            Tenant savedTenant = tenantService.tambahTenant(tenant);
            return ResponseEntity.ok(savedTenant);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Gagal menambahkan tenant: " + e.getMessage());
        }
    }
}