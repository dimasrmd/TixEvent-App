package com.tixevent.backend.entity;

public class Panitia extends User {
    private String divisi;

    // Constructor Kosong
    public Panitia() {
        super();
    }

    // Constructor Parameter Lengkap (Menyesuaikan 5 parameter milik Zaky + 1 milikmu)
    public Panitia(String idUser, String nama, String email, String password, String noHp, String divisi) {
        // super() diisi TEPAT 5 parameter sesuai constructor milik Zaky
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