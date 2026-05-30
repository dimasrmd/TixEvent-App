package com.tixevent.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "panitia") // Menentukan nama tabel di database Supabase
public class Panitia extends User {
    private String divisi;

    // Constructor Kosong (Wajib ada untuk kebutuhan internal JPA)
    public Panitia() {
        super();
    }

    // Constructor Parameter Lengkap
    public Panitia(String idUser, String nama, String email, String password, String noHp, String divisi) {
        super(idUser, nama, email, password, noHp); 
        this.divisi = divisi;
    }

    // Getter dan Setter
    public String getDivisi() {
        return divisi;
    }

    public void setDivisi(String divisi) {
        this.divisi = divisi;
    }
}