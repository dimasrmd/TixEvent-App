package com.tixevent.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Transaksi {
    @Id
    private String idTransaksi;
    private String tanggalTransaksi;
    private double totalBayar;
    private String statusPembayaran;

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