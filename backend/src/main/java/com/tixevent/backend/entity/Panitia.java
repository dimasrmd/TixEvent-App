package com.tixevent.backend.entity;

public class Panitia extends User {
    private String divisi;

    // Constructor Kosong
    public Panitia() {
        super();
    }

    // Constructor Parameter Lengkap (Menyesuaikan urutan dokumen: idUser, nama, email, dll)
    public Panitia(String idUser, String nama, String email, String password, String divisi) {
        // Memanggil constructor parent (User) dengan tipe peran otomatis "PANITIA"
        super(idUser, nama, email, password, "PANITIA"); 
        this.divisi = divisi;
    }

    // Getter dan Setter
    public String getDivisi() { return divisi; }
    public void setDivisi(String divisi) { this.divisi = divisi; }
}