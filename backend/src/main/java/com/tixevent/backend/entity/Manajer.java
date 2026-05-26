package com.tixevent.backend.entity;

public class Manajer extends User {
    private String jabatan;

    // Constructor Kosong
    public Manajer() {
        super();
    }

    // Constructor Lengkap (Gabungan dari atribut User dan Manajer)
    public Manajer(String idUser, String nama, String email, String password, String noHp, String jabatan) {
        super(idUser, nama, email, password, noHp); // Memanggil constructor dari Abstract Class User
        this.jabatan = jabatan;
    }

    // Getter dan Setter
    public String getJabatan() {
        return jabatan;
    }

    public void setJabatan(String jabatan) {
        this.jabatan = jabatan;
    }

    // Method spesifik milik Manajer berdasarkan Class Diagram
    public void kelolaRundown() {
        // Logika kelola rundown akan dikembangkan nanti
        System.out.println("Manajer sedang mengelola rundown...");
    }

    public void generateLaporanKeuangan() {
        // Logika cetak laporan
        System.out.println("Manajer mencetak laporan keuangan...");
    }
}