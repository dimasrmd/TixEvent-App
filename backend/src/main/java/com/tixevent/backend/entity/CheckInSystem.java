package com.tixevent.backend.entity;

public class CheckInSystem {
    private String idCheckIn;
    private String gateMasuk;

    // Constructor Kosong
    public CheckInSystem() {
    }

    // Constructor Parameter Lengkap murni sesuai diagram
    public CheckInSystem(String idCheckIn, String gateMasuk) {
        this.idCheckIn = idCheckIn;
        this.gateMasuk = gateMasuk;
    }

    // Getter dan Setter murni
    public String getIdCheckIn() {
        return idCheckIn;
    }

    public void setIdCheckIn(String idCheckIn) {
        this.idCheckIn = idCheckIn;
    }

    public String getGateMasuk() {
        return gateMasuk;
    }

    public void setGateMasuk(String gateMasuk) {
        this.gateMasuk = gateMasuk;
    }
}