package com.tixevent.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "crews")
public class Crew extends User {
    // Atribut spesifik Crew berdasarkan Class Diagram (Private)
    private String posisi;

    public Crew() {
        super();
    }

    public Crew(String idUser, String nama, String email, String password, String noHp, String posisi) {
        super(idUser, nama, email, password, noHp);
        this.posisi = posisi;
    }

    // Getter dan Setter
    public String getPosisi() {
        return posisi;
    }

    public void setPosisi(String posisi) {
        this.posisi = posisi;
    }

    // Method spesifik Crew berdasarkan Class Diagram
    public void lihatShift() {
        // Logika untuk melihat shift kerja kru
    }

    public void catatPresensi() {
        // Logika untuk mencatat presensi kehadiran kru
    }
}
