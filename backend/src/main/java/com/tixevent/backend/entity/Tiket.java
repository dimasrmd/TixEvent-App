package com.tixevent.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Tiket {
    @Id
    private String kodeTiket;
    private String kategori;
    private double harga;
    private boolean statusDigunakan;

    @ManyToOne
    @JoinColumn(name = "id_event_fk")
    private Event event;

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

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
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