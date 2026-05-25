# 📝 Dokumentasi Mandiri - Lutfi Shidqi Mardian (Manajemen Kru)
## Progres Pengerjaan Tugas Minggu 1 (Tubes PBO)

Dokumen ini berisi hasil pengerjaan mandiri untuk modul **Manajemen Kru** pada Minggu 1, fokus pada **Fondasi OOP & Struktur Data** di backend Spring Boot.

---

### 1. Penerapan Pilar PBO (Object-Oriented Programming)

Dalam pengerjaan ini, telah diimplementasikan dua pilar utama PBO:
* **Inheritance (Pewarisan):** Kelas `Crew.java` mewarisi (*extends*) dari kelas abstrak `User.java`. Ini berarti `Crew` otomatis memiliki atribut dasar user seperti `idUser`, `nama`, `email`, `password`, dan `noHp` tanpa perlu mendefinisikannya kembali.
* **Encapsulation (Pengkapsulan):** Seluruh atribut di kelas `Crew.java` dan `ShiftLog.java` dideklarasikan dengan hak akses **`private`**. Akses ke atribut tersebut dikendalikan penuh menggunakan method **`getter`** dan **`setter`** publik.

---

### 2. Struktur Kode Kelas (Entities)

#### A. Kelas `Crew.java`
Mewarisi `User.java` dengan tambahan atribut spesifik `posisi`.

```java
package com.tixevent.backend.entity;

public class Crew extends User {
    // Atribut spesifik Crew (Private)
    private String posisi;

    // Konstruktor Default
    public Crew() {
        super();
    }

    // Konstruktor Berparameter (memanggil super constructor dari User)
    public Crew(String idUser, String nama, String email, String password, String noHp, String posisi) {
        super(idUser, nama, email, password, noHp);
        this.posisi = posisi;
    }

    // Getter dan Setter
    public String getPosisi() {
        return posisi;
    }

    public void setPosisi(String posisi) {
        this.posisi = posisi;
    }

    // Stubs Method berdasarkan Class Diagram
    public void lihatShift() {
        // Logika untuk melihat shift kerja kru
    }

    public void catatPresensi() {
        // Logika untuk mencatat presensi kehadiran kru
    }
}
```

#### B. Kelas `ShiftLog.java`
Mengelola informasi jadwal kerja dan status presensi kru.

```java
package com.tixevent.backend.entity;

public class ShiftLog {
    // Atribut berdasarkan Class Diagram (Private)
    private String idShift;
    private String idCrew; // Menghubungkan shift ke entitas Crew
    private String tanggal;
    private String jamMulai;
    private String jamSelesai;
    private String posTugas;
    private String statusHadir; // e.g. "Hadir", "Tidak Hadir", "Belum Absen"

    public ShiftLog() {}

    public ShiftLog(String idShift, String idCrew, String tanggal, String jamMulai, String jamSelesai, String posTugas, String statusHadir) {
        this.idShift = idShift;
        this.idCrew = idCrew;
        this.tanggal = tanggal;
        this.jamMulai = jamMulai;
        this.jamSelesai = jamSelesai;
        this.posTugas = posTugas;
        this.statusHadir = statusHadir;
    }

    // Getter dan Setter
    public String getIdShift() { return idShift; }
    public void setIdShift(String idShift) { this.idShift = idShift; }

    public String getIdCrew() { return idCrew; }
    public void setIdCrew(String idCrew) { this.idCrew = idCrew; }

    public String getTanggal() { return tanggal; }
    public void setTanggal(String tanggal) { this.tanggal = tanggal; }

    public String getJamMulai() { return jamMulai; }
    public void setJamMulai(String jamMulai) { this.jamMulai = jamMulai; }

    public String getJamSelesai() { return jamSelesai; }
    public void setJamSelesai(String jamSelesai) { this.jamSelesai = jamSelesai; }

    public String getPosTugas() { return posTugas; }
    public void setPosTugas(String posTugas) { this.posTugas = posTugas; }

    public String getStatusHadir() { return statusHadir; }
    public void setStatusHadir(String statusHadir) { this.statusHadir = statusHadir; }

    // Stubs Method berdasarkan Class Diagram
    public void catatPresensi() {}
    public void ubahShift() {}
    public void lihatDetailShift() {}
}
```

---

### 3. Struktur Data Dummy In-Memory (`CrewService.java`)

Untuk menggantikan database sementara waktu, diimplementasikan kelas layanan `CrewService` dengan penyimpanan data dalam memori memanfaatkan struktur data **`ArrayList`**.

```java
package com.tixevent.backend.service;

import com.tixevent.backend.entity.Crew;
import com.tixevent.backend.entity.ShiftLog;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class CrewService {
    private final List<Crew> crewList = new ArrayList<>();
    private final List<ShiftLog> shiftList = new ArrayList<>();

    public CrewService() {
        // 1. Inisialisasi Data Dummy Kru
        crewList.add(new Crew("CRW-007", "Lutfi Shidqi", "lutfi@tixevent.com", "lutfi123", "081234567890", "Stage Manager"));
        crewList.add(new Crew("CRW-001", "Budi Santoso", "budi@tixevent.com", "budi123", "081234567891", "Security Coordinator"));
        crewList.add(new Crew("CRW-002", "Siti Aminah", "siti@tixevent.com", "siti123", "081234567892", "Gate Control"));

        // 2. Inisialisasi Data Dummy ShiftLog (Jadwal Shift Harian)
        shiftList.add(new ShiftLog("SHF-101", "CRW-007", "2026-05-25", "07:00", "15:00", "Stage A", "Belum Absen"));
        shiftList.add(new ShiftLog("SHF-102", "CRW-002", "2026-05-25", "15:00", "23:00", "Gate Utama", "Belum Absen"));
        shiftList.add(new ShiftLog("SHF-103", "CRW-001", "2026-05-25", "08:00", "16:00", "Pos Barat", "Hadir"));
    }

    public List<Crew> getAllCrew() { return crewList; }
    public List<ShiftLog> getAllShifts() { return shiftList; }

    // Logika validasi dan pencatatan presensi kehadiran kru (PUT)
    public boolean catatPresensi(String idShift, String idCrew, String statusHadir) {
        for (ShiftLog shift : shiftList) {
            if (shift.getIdShift().equals(idShift)) {
                // Validasi kecocokan: Pastikan kru yang absen adalah kru yang terdaftar di shift ini
                if (shift.getIdCrew().equals(idCrew)) {
                    shift.setStatusHadir(statusHadir);
                    return true; // Sukses di-update
                }
                break;
            }
        }
        return false; // Gagal (Shift tidak ditemukan/Kru tidak terdaftar di shift tersebut)
    }
}
```

---

### 4. Jembatan REST API Controller (`CrewRestController.java`)

Menyediakan API endpoint agar frontend Next.js dapat bertukar data dalam format **JSON**. Telah dilengkapi dengan konfigurasi `@CrossOrigin` untuk keamanan transaksi data lintas asal (*Cross-Origin Resource Sharing*).

* **Endpoint Presensi:** `PUT /api/kru/presensi`
* **Endpoint Pendukung (List Shift):** `GET /api/kru/shifts`
* **Endpoint Pendukung (List Kru):** `GET /api/kru/crews`

#### Contoh Payload Pertukaran Data JSON:

**A. Request Body (Frontend ke Backend):**
```json
{
  "idShift": "SHF-101",
  "idCrew": "CRW-007",
  "statusHadir": "Hadir"
}
```

**B. Response Sukses (HTTP Status 200 OK):**
```json
{
  "status": "success",
  "message": "Presensi berhasil dicatat pada jam 07:45."
}
```

**C. Response Gagal (HTTP Status 400 Bad Request):**
```json
{
  "status": "error",
  "message": "Gagal. ID Shift tidak ditemukan atau Anda tidak terdaftar di shift ini."
}
```

---

### 5. Hasil Pengujian Verifikasi Lokal
Kompilasi kode program menggunakan Apache Maven Wrapper berhasil dijalankan tanpa adanya kesalahan sintaksis maupun relasi antar kelas:
```bash
.\mvnw.cmd clean compile
...
[INFO] --- compiler:3.14.1:compile (default-compile) @ backend ---
[INFO] Compiling 6 source files with javac [debug parameters release 17] to target\classes
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
```
