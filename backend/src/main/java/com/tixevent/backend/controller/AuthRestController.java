package com.tixevent.backend.controller;

import com.tixevent.backend.entity.User;
import com.tixevent.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthRestController {

    private final AuthService authService;

    @Autowired
    public AuthRestController(AuthService authService) {
        this.authService = authService;
    }

    // ==========================================
    // PENGUNJUNG ENDPOINTS
    // ==========================================
    @PostMapping("/pengunjung/register")
    public ResponseEntity<?> registerPengunjung(@RequestBody Map<String, String> request) {
        String result = authService.registerPengunjung(
                request.get("nama"), request.get("email"), request.get("password"), request.get("noHp"));
        return formatRegisterResponse(result);
    }

    @PostMapping("/pengunjung/login")
    public ResponseEntity<?> loginPengunjung(@RequestBody Map<String, String> request) {
        User user = authService.loginPengunjung(request.get("email"), request.get("password"));
        return formatLoginResponse(user, "Pengunjung");
    }

    // ==========================================
    // KRU ENDPOINTS
    // ==========================================
    @PostMapping("/kru/register")
    public ResponseEntity<?> registerKru(@RequestBody Map<String, String> request) {
        String result = authService.registerKru(
                request.get("nama"), request.get("email"), request.get("password"), request.get("noHp"));
        return formatRegisterResponse(result);
    }

    @PostMapping("/kru/login")
    public ResponseEntity<?> loginKru(@RequestBody Map<String, String> request) {
        User user = authService.loginKru(request.get("email"), request.get("password"));
        return formatLoginResponse(user, "Kru");
    }

    // ==========================================
    // PANITIA ENDPOINTS
    // ==========================================
    @PostMapping("/panitia/register")
    public ResponseEntity<?> registerPanitia(@RequestBody Map<String, String> request) {
        String result = authService.registerPanitia(
                request.get("nama"), request.get("email"), request.get("password"), request.get("noHp"));
        return formatRegisterResponse(result);
    }

    @PostMapping("/panitia/login")
    public ResponseEntity<?> loginPanitia(@RequestBody Map<String, String> request) {
        User user = authService.loginPanitia(request.get("email"), request.get("password"));
        return formatLoginResponse(user, "Panitia");
    }

    // ==========================================
    // TENANT ENDPOINTS
    // ==========================================
    @PostMapping("/tenant/register")
    public ResponseEntity<?> registerTenant(@RequestBody Map<String, String> request) {
        String result = authService.registerTenant(
                request.get("nama"), request.get("email"), request.get("password"), request.get("noHp"));
        return formatRegisterResponse(result);
    }

    @PostMapping("/tenant/login")
    public ResponseEntity<?> loginTenant(@RequestBody Map<String, String> request) {
        User user = authService.loginTenant(request.get("email"), request.get("password"));
        return formatLoginResponse(user, "Tenant");
    }

    // ==========================================
    // MANAJER ENDPOINT (HANYA LOGIN)
    // ==========================================
    @PostMapping("/manajer/login")
    public ResponseEntity<?> loginManajer(@RequestBody Map<String, String> request) {
        User user = authService.loginManajer(request.get("email"), request.get("password"));
        return formatLoginResponse(user, "Manajer");
    }

    // ==========================================
    // HELPER METHODS (Untuk merapikan JSON Response)
    // ==========================================
    private ResponseEntity<?> formatRegisterResponse(String result) {
        Map<String, Object> response = new java.util.HashMap<>();
        if (result.startsWith("Berhasil")) {
            response.put("status", "Success");
            response.put("message", result);
            return ResponseEntity.ok(response);
        }

        response.put("status", "Failed");
        response.put("message", result);
        return ResponseEntity.badRequest().body(response);
    }

    private ResponseEntity<?> formatLoginResponse(User user, String roleName) {
        Map<String, Object> response = new java.util.HashMap<>();

        if (user != null) {
            response.put("status", "Success");
            response.put("message", "Login " + roleName + " berhasil");

            // Menggunakan HashMap agar kebal jika ada data bernilai null di Supabase
            response.put("idUser", user.getIdUser());
            response.put("nama", user.getNama());
            response.put("role", user.getRole());

            return ResponseEntity.ok(response);
        }

        response.put("status", "Failed");
        response.put("message", "Login gagal! Email/Password salah atau Anda bukan " + roleName);
        return ResponseEntity.status(401).body(response);
    }
}