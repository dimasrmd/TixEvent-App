package com.tixevent.backend.service;

import com.tixevent.backend.entity.*;
import com.tixevent.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;

    @Autowired
    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ==========================================
    // 🟢 1. AREA PENGUNJUNG (PUBLIK)
    // ==========================================
    public String registerPengunjung(String nama, String email, String password, String noHp) {
        if (userRepository.findByEmail(email).isPresent()) return "Gagal: Email sudah terdaftar!";

        Pengunjung pengunjung = new Pengunjung();
        String id = "USR-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        pengunjung.setIdUser(id);
        pengunjung.setNama(nama);
        pengunjung.setEmail(email);
        pengunjung.setPassword(password);
        pengunjung.setNoHp(noHp);
        pengunjung.setRole("pengunjung");
        pengunjung.setAlamat("-"); // Atribut default pengunjung

        userRepository.save(pengunjung);
        return "Berhasil: Pengunjung terdaftar dengan ID " + id;
    }

    public User loginPengunjung(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent() && userOpt.get().getPassword().equals(password)) {
            if (userOpt.get() instanceof Pengunjung) return userOpt.get();
        }
        return null;
    }

    // ==========================================
    // 🔵 2. AREA KRU
    // ==========================================
    public String registerKru(String nama, String email, String password, String noHp) {
        if (userRepository.findByEmail(email).isPresent()) return "Gagal: Email sudah terdaftar!";

        Crew kru = new Crew();
        String id = "CRW-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        kru.setIdUser(id);
        kru.setNama(nama);
        kru.setEmail(email);
        kru.setPassword(password);
        kru.setNoHp(noHp);
        kru.setRole("kru");

        userRepository.save(kru);
        return "Berhasil: Kru terdaftar dengan ID " + id;
    }

    public User loginKru(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent() && userOpt.get().getPassword().equals(password)) {
            if (userOpt.get() instanceof Crew) return userOpt.get();
        }
        return null;
    }

    // ==========================================
    // 🟣 3. AREA PANITIA
    // ==========================================
    public String registerPanitia(String nama, String email, String password, String noHp) {
        if (userRepository.findByEmail(email).isPresent()) return "Gagal: Email sudah terdaftar!";

        Panitia panitia = new Panitia();
        String id = "PNT-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        panitia.setIdUser(id);
        panitia.setNama(nama);
        panitia.setEmail(email);
        panitia.setPassword(password);
        panitia.setNoHp(noHp);
        panitia.setRole("panitia");

        userRepository.save(panitia);
        return "Berhasil: Panitia terdaftar dengan ID " + id;
    }

    public User loginPanitia(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent() && userOpt.get().getPassword().equals(password)) {
            if (userOpt.get() instanceof Panitia) return userOpt.get();
        }
        return null;
    }

    // ==========================================
    // 🟠 4. AREA TENANT
    // ==========================================
    public String registerTenant(String nama, String email, String password, String noHp) {
        if (userRepository.findByEmail(email).isPresent()) return "Gagal: Email sudah terdaftar!";

        Tenant tenant = new Tenant();
        String id = "TNT-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        tenant.setIdUser(id);
        tenant.setNama(nama);
        tenant.setEmail(email);
        tenant.setPassword(password);
        tenant.setNoHp(noHp);
        tenant.setRole("tenant");

        userRepository.save(tenant);
        return "Berhasil: Tenant terdaftar dengan ID " + id;
    }

    public User loginTenant(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent() && userOpt.get().getPassword().equals(password)) {
            if (userOpt.get() instanceof Tenant) return userOpt.get();
        }
        return null;
    }

    // ==========================================
    // 🌟 5. AREA MANAJER (SUPER ADMIN)
    // ==========================================
    // Manajer tidak memiliki fungsi Register (Ditambahkan oleh Task Orang 2)
    public User loginManajer(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent() && userOpt.get().getPassword().equals(password)) {
            if (userOpt.get() instanceof Manajer) return userOpt.get();
        }
        return null;
    }
}