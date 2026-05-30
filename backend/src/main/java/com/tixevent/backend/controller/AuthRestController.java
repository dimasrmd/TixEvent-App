package com.tixevent.backend.controller;

import com.tixevent.backend.entity.User;
import com.tixevent.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
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

    // Endpoint: POST /api/auth/register
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        String nama = request.get("nama");
        String email = request.get("email");
        String password = request.get("password");
        String noHp = request.get("noHp");

        // Validasi input kosong
        if (nama == null || email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "Failed",
                    "message", "Data nama, email, dan password wajib diisi!"
            ));
        }

        String result = authService.registerUser(nama, email, password, noHp);

        if (result.startsWith("Berhasil")) {
            return ResponseEntity.ok(Map.of(
                    "status", "Success",
                    "message", result
            ));
        } else {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "Failed",
                    "message", result
            ));
        }
    }

    // Endpoint: POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        User user = authService.loginUser(email, password);

        if (user != null) {
            // Kita pisahkan data yang dikembalikan agar password TIDAK ikut terkirim ke JSON demi keamanan
            Map<String, Object> userData = new HashMap<>();
            userData.put("idUser", user.getIdUser());
            userData.put("nama", user.getNama());
            userData.put("email", user.getEmail());
            userData.put("role", user.getRole());

            return ResponseEntity.ok(Map.of(
                    "status", "Success",
                    "message", "Login berhasil!",
                    "data", userData
            ));
        } else {
            return ResponseEntity.status(401).body(Map.of(
                    "status", "Failed",
                    "message", "Email atau password salah!"
            ));
        }
    }
}