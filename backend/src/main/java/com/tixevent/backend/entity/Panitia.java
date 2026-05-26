package com.tixevent.backend.entity;

public class Panitia extends User {
    private String divisi;

    // Constructor Kosong
    public Panitia() {
        super();
    }

    // Constructor Parameter Lengkap
    public Panitia(String id, String username, String email, String password, String divisi) {
        super(id, username, email, password, "PANITIA"); 
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