package com.tixevent.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "shift_logs")
public class ShiftLog {
    // Atribut berdasarkan Class Diagram (Private)
    @Id
    private String idShift;

    // Relasi Banyak ShiftLog ke Satu Crew (Many-to-One) sesuai Class Diagram dan ERD
    @ManyToOne
    @JoinColumn(name = "id_crew_fk")
    private Crew crew; 

    private String tanggal;
    private String jamMulai;
    private String jamSelesai;
    private String posTugas;
    private String statusHadir; // e.g. "Hadir", "Tidak Hadir", "Belum Absen"

    public ShiftLog() {
    }

    public ShiftLog(String idShift, Crew crew, String tanggal, String jamMulai, String jamSelesai, String posTugas, String statusHadir) {
        this.idShift = idShift;
        this.crew = crew;
        this.tanggal = tanggal;
        this.jamMulai = jamMulai;
        this.jamSelesai = jamSelesai;
        this.posTugas = posTugas;
        this.statusHadir = statusHadir;
    }

    // Getters dan Setters
    public String getIdShift() {
        return idShift;
    }

    public void setIdShift(String idShift) {
        this.idShift = idShift;
    }

    public Crew getCrew() {
        return crew;
    }

    public void setCrew(Crew crew) {
        this.crew = crew;
    }

    public String getTanggal() {
        return tanggal;
    }

    public void setTanggal(String tanggal) {
        this.tanggal = tanggal;
    }

    public String getJamMulai() {
        return jamMulai;
    }

    public void setJamMulai(String jamMulai) {
        this.jamMulai = jamMulai;
    }

    public String getJamSelesai() {
        return jamSelesai;
    }

    public void setJamSelesai(String jamSelesai) {
        this.jamSelesai = jamSelesai;
    }

    public String getPosTugas() {
        return posTugas;
    }

    public void setPosTugas(String posTugas) {
        this.posTugas = posTugas;
    }

    public String getStatusHadir() {
        return statusHadir;
    }

    public void setStatusHadir(String statusHadir) {
        this.statusHadir = statusHadir;
    }

    // Method berdasarkan Class Diagram
    public void catatPresensi() {
        // Logika mencatat presensi
    }

    public void ubahShift() {
        // Logika mengubah shift
    }

    public void lihatDetailShift() {
        // Logika melihat detail shift
    }
}
