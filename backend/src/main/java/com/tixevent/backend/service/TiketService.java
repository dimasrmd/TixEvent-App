package com.tixevent.backend.service;

import com.tixevent.backend.entity.Tiket;
import com.tixevent.backend.entity.Transaksi;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@Service
public class TiketService {

    // Menggunakan ArrayList murni sesuai materi Collection PBO
    private ArrayList<Tiket> stokTiket = new ArrayList<>();
    private ArrayList<Transaksi> riwayatTransaksi = new ArrayList<>();

    // Counter sederhana pengganti UUID untuk bikin ID Transaksi
    private int nomorTransaksi = 1;

    public TiketService() {
        // Data dummy disuntikkan lewat Constructor
        stokTiket.add(new Tiket("TIX-V01", "VIP", 750000, false));
        stokTiket.add(new Tiket("TIX-V02", "VIP", 750000, false));
        stokTiket.add(new Tiket("TIX-R01", "Reguler", 350000, false));
        stokTiket.add(new Tiket("TIX-R02", "Reguler", 350000, false));
        stokTiket.add(new Tiket("TIX-R03", "Reguler", 350000, false));
    }

    // Mengembalikan Map (HashMap) agar mudah diconvert jadi JSON di Controller
    public Map<String, Object> beliTiket(String idUser, String kategori, int jumlah) {

        // HashMap sesuai dengan materi tipe data Collection
        Map<String, Object> response = new HashMap<>();

        // List sementara untuk menampung tiket yang valid untuk dibeli
        ArrayList<Tiket> keranjangTiket = new ArrayList<>();

        // 1. LOGIKA PENCARIAN TIKET (Penerapan looping dasar)
        for (Tiket t : stokTiket) {
            // Cek apakah kategorinya sama DAN statusnya belum digunakan
            if (t.getKategori().equalsIgnoreCase(kategori) && t.cekStatus() == false) {
                keranjangTiket.add(t);

                // Hentikan pencarian kalau jumlah tiket yang didapat sudah sesuai permintaan
                if (keranjangTiket.size() == jumlah) {
                    break;
                }
            }
        }

        // 2. VALIDASI STOK (Menggunakan if-else standar)
        if (keranjangTiket.size() < jumlah) {
            response.put("status", "error");
            response.put("message", "Stok tiket kategori " + kategori + " habis atau tidak cukup.");
            return response;
        }

        // 3. PROSES PEMBELIAN (Penerapan Encapsulation & Getter/Setter)
        double totalBayar = 0;
        ArrayList<String> daftarKodeTiket = new ArrayList<>();

        for (Tiket t : keranjangTiket) {
            t.tandaiDigunakan(); // Memanggil method dari entity Tiket
            totalBayar = totalBayar + t.getHarga(); // Menjumlahkan harga
            daftarKodeTiket.add(t.getKodeTiket()); // Menyimpan kode tiket untuk ditampilkan
        }

        // 4. PENCATATAN TRANSAKSI (Instansiasi Objek Baru)
        String idTransaksiBaru = "TRX-" + nomorTransaksi;
        nomorTransaksi++; // Increment agar id transaksi selanjutnya berbeda

        Transaksi transaksiBaru = new Transaksi(
                idTransaksiBaru,
                "2026-05-25", // Hardcode tanggal dulu untuk menyederhanakan
                totalBayar,
                "Lunas"
        );

        // Simpan ke riwayat
        riwayatTransaksi.add(transaksiBaru);

        // 5. SUSUN RESPONSE SUKSES (Sesuai dengan Kontrak API yang disepakati)
        response.put("status", "success");
        response.put("idTransaksi", transaksiBaru.getIdTransaksi());
        response.put("kodeTiket", daftarKodeTiket);
        response.put("totalBayar", transaksiBaru.hitungTotal());

        return response;
    }
}