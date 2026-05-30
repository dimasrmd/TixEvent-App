package com.tixevent.backend.service;

import com.tixevent.backend.entity.Pengunjung;
import com.tixevent.backend.entity.User;
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

    // --- LOGIKA REGISTRASI ---
    public String registerUser(String nama, String email, String password, String noHp) {
        // 1. Cek apakah email sudah terdaftar sebelumnya
        Optional<User> existingUser = userRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            return "Gagal: Email sudah terdaftar!";
        }

        // 2. Karena User abstract, pendaftaran publik kita jadikan objek Pengunjung
        Pengunjung pengunjungBaru = new Pengunjung();

        // Membuat ID unik pendek (Misal: USR-A1B2C3D4)
        String generatedId = "USR-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        pengunjungBaru.setIdUser(generatedId);

        pengunjungBaru.setNama(nama);
        pengunjungBaru.setEmail(email);
        pengunjungBaru.setPassword(password); // Catatan: Di dunia nyata, ini wajib di-hash/enkripsi (Bcrypt)
        pengunjungBaru.setNoHp(noHp);
        pengunjungBaru.setRole("pengunjung");
        pengunjungBaru.setAlamat("-"); // Nilai default

        // 3. Simpan ke Supabase
        userRepository.save(pengunjungBaru);
        return "Berhasil: Registrasi sukses dengan ID " + generatedId;
    }

    // --- LOGIKA LOGIN ---
    public User loginUser(String email, String password) {
        // 1. Cari user berdasarkan email
        Optional<User> userOpt = userRepository.findByEmail(email);

        // 2. Jika user ditemukan DAN passwordnya cocok
        if (userOpt.isPresent() && userOpt.get().getPassword().equals(password)) {
            return userOpt.get(); // Kembalikan objek user (Login sukses)
        }

        // Jika email tidak ada atau password salah
        return null;
    }
}