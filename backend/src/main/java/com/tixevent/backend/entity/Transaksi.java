package com.tixevent.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Transaksi {
    @Id
    private String idTransaksi;
    private String tanggalTransaksi;
    private double totalBayar;
    private String statusPembayaran;

    // Ubah tipe dari Pengunjung menjadi User agar Kru / Panitia juga bisa beli tiket jika mau
    @ManyToOne
    @JoinColumn(name = "id_user_fk")
    private User user;

    // Constructor Kosong
    public Transaksi() {
    }

    // Constructor Parameter Lengkap
    public Transaksi(String idTransaksi, String tanggalTransaksi, double totalBayar, String statusPembayaran) {
        this.idTransaksi = idTransaksi;
        this.tanggalTransaksi = tanggalTransaksi;
        this.totalBayar = totalBayar;
        this.statusPembayaran = statusPembayaran;
    }

    // Getter dan Setter
    public String getIdTransaksi() {
        return idTransaksi;
    }

    public void setIdTransaksi(String idTransaksi) {
        this.idTransaksi = idTransaksi;
    }

    public String getTanggalTransaksi() {
        return tanggalTransaksi;
    }

    public void setTanggalTransaksi(String tanggalTransaksi) {
        this.tanggalTransaksi = tanggalTransaksi;
    }

    public double getTotalBayar() {
        return totalBayar;
    }

    public void setTotalBayar(double totalBayar) {
        this.totalBayar = totalBayar;
    }

    public String getStatusPembayaran() {
        return statusPembayaran;
    }

    public void setStatusPembayaran(String statusPembayaran) {
        this.statusPembayaran = statusPembayaran;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    // Method sesuai Class Diagram
    public double hitungTotal() {
        return this.totalBayar;
    }

    public void konfirmasiPembayaran() {
        this.statusPembayaran = "Lunas";
    }

    public void batalkanTransaksi() {
        this.statusPembayaran = "Dibatalkan";
    }
}