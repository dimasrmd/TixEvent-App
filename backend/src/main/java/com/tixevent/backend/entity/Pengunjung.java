package com.tixevent.backend.entity;

import jakarta.persistence.Entity;

@Entity
public class Pengunjung extends User {
    private String alamat;

    // Constructor Kosong
    public Pengunjung() {
        super();
    }

    // Constructor Parameter Lengkap (Termasuk atribut dari induk User)
    public Pengunjung(String idUser, String nama, String email, String password, String noHp, String alamat) {
        super(idUser, nama, email, password, noHp);
        this.alamat = alamat;
    }

    // Getter dan Setter
    public String getAlamat() {
        return alamat;
    }

    public void setAlamat(String alamat) {
        this.alamat = alamat;
    }

    // Method sesuai Class Diagram
    public void beliTiket() {
        // Logika bisnis pembelian tiket akan diimplementasikan di lapisan Service
    }

    public void ajukanRefund() {
        // Logika bisnis pengajuan refund akan diimplementasikan di lapisan Service
    }
}