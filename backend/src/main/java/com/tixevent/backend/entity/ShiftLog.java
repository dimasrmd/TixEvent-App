package com.tixevent.backend.entity;

public class ShiftLog {
    // Atribut berdasarkan Class Diagram (Private)
    private String idShift;
    private String idCrew; // Ditambahkan untuk menghubungkan shift dengan Crew sesuai Class Diagram
    private String tanggal;
    private String jamMulai;
    private String jamSelesai;
    private String posTugas;
    private String statusHadir; // e.g. "Hadir", "Tidak Hadir", "Belum Absen"

    public ShiftLog() {
    }

    public ShiftLog(String idShift, String idCrew, String tanggal, String jamMulai, String jamSelesai, String posTugas, String statusHadir) {
        this.idShift = idShift;
        this.idCrew = idCrew;
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

    public String getIdCrew() {
        return idCrew;
    }

    public void setIdCrew(String idCrew) {
        this.idCrew = idCrew;
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
