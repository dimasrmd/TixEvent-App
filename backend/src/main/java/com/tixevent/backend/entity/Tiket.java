package com.tixevent.backend.entity;

public class Tiket {
    private String kodeTiket;
    private String kategori;
    private double harga;
    private boolean statusDigunakan;

    // Constructor Kosong
    public Tiket() {
    }

    // Constructor Parameter Lengkap
    public Tiket(String kodeTiket, String kategori, double harga, boolean statusDigunakan) {
        this.kodeTiket = kodeTiket;
        this.kategori = kategori;
        this.harga = harga;
        this.statusDigunakan = statusDigunakan;
    }

    // Getter dan Setter
    public String getKodeTiket() {
        return kodeTiket;
    }

    public void setKodeTiket(String kodeTiket) {
        this.kodeTiket = kodeTiket;
    }

    public String getKategori() {
        return kategori;
    }

    public void setKategori(String kategori) {
        this.kategori = kategori;
    }

    public double getHarga() {
        return harga;
    }

    public void setHarga(double harga) {
        this.harga = harga;
    }

    public boolean isStatusDigunakan() {
        return statusDigunakan;
    }

    public void setStatusDigunakan(boolean statusDigunakan) {
        this.statusDigunakan = statusDigunakan;
    }

    // Method sesuai Class Diagram
    public String generateKode() {
        // Logika pembuatan generator kode unik tiket
        return this.kodeTiket;
    }

    public void tandaiDigunakan() {
        this.statusDigunakan = true;
    }

    public boolean cekStatus() {
        return this.statusDigunakan;
    }
}