package com.tixevent.backend.service;

import com.tixevent.backend.entity.Tiket;
import com.tixevent.backend.entity.Transaksi;
import com.tixevent.backend.entity.User;
import com.tixevent.backend.repository.TiketRepository;
import com.tixevent.backend.repository.TransaksiRepository;
import com.tixevent.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class TiketService {

    private final TiketRepository tiketRepository;
    private final UserRepository userRepository;
    private final TransaksiRepository transaksiRepository;

    @Autowired
    public TiketService(TiketRepository tiketRepository, UserRepository userRepository, TransaksiRepository transaksiRepository) {
        this.tiketRepository = tiketRepository;
        this.userRepository = userRepository;
        this.transaksiRepository = transaksiRepository;
    }

    public Tiket buatTiket(Tiket tiket) {
        return tiketRepository.save(tiket);
    }

    public Map<String, Object> beliTiket(String idUser, String kategori, int jumlah) {
        Map<String, Object> response = new HashMap<>();

        // 1. Validasi apakah User terdaftar di Database
        Optional<User> userOpt = userRepository.findById(idUser);
        if (userOpt.isEmpty()) {
            response.put("status", "Failed");
            response.put("message", "Pembelian Gagal: User dengan ID " + idUser + " tidak ditemukan!");
            return response;
        }

        // 2. Tentukan Harga Tiket berdasarkan Kategori
        double hargaPerTiket = 0.0;
        if (kategori.equalsIgnoreCase("VIP")) {
            hargaPerTiket = 500000.0;
        } else if (kategori.equalsIgnoreCase("Festival")) {
            hargaPerTiket = 250000.0;
        } else {
            hargaPerTiket = 150000.0;
        }

        double totalBayar = hargaPerTiket * jumlah;

        // 3. Buat Entitas Transaksi Baru
        Transaksi transaksiBaru = new Transaksi();
        String idTrx = "TRX-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();

        transaksiBaru.setIdTransaksi(idTrx);
        transaksiBaru.setTanggalTransaksi(java.time.LocalDate.now().toString());
        transaksiBaru.setTotalBayar(totalBayar);
        transaksiBaru.setStatusPembayaran("LUNAS");

        // MENYAMBUNGKAN USER KE TRANSAKSI
        transaksiBaru.setUser(userOpt.get());

        transaksiRepository.save(transaksiBaru);

        // WADAH PENAMPUNG KODE TIKET YANG BISA DITAMPILKAN KE POSTMAN
        List<String> daftarKodeTiket = new ArrayList<>();

        // 4. Cetak (Generate) Tiket Sesuai Jumlah Pesanan
        for (int i = 0; i < jumlah; i++) {
            Tiket tiketBaru = new Tiket();
            String idTiket = "TIX-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

            tiketBaru.setKodeTiket(idTiket);
            tiketBaru.setKategori(kategori);
            tiketBaru.setHarga(hargaPerTiket);
            tiketBaru.setStatusDigunakan(false);
            tiketBaru.setTransaksi(transaksiBaru); // Menyambungkan tiket ke transaksi

            tiketRepository.save(tiketBaru);

            // Masukkan kode tiket ke dalam daftar
            daftarKodeTiket.add(idTiket);
        }

        // 5. Kembalikan Response Sukses
        response.put("status", "Success");
        response.put("message", "Berhasil membeli " + jumlah + " tiket " + kategori + ".");
        response.put("idTransaksi", idTrx);
        response.put("totalBayar", totalBayar);

        // MENGIRIMKAN LIST KODE TIKET KE JSON
        response.put("kodeTiket", daftarKodeTiket);

        return response;
    }
}