package com.tixevent.backend.entity;

public class BoothArea {

    private String idBooth;
    private String nomorBooth;
    private String lokasiBooth;
    private double hargaSewa;
    private boolean statusBooth;

    public BoothArea() {
    }

    public BoothArea(String idBooth, String nomorBooth,
                     String lokasiBooth, double hargaSewa,
                     boolean statusBooth) {

        this.idBooth = idBooth;
        this.nomorBooth = nomorBooth;
        this.lokasiBooth = lokasiBooth;
        this.hargaSewa = hargaSewa;
        this.statusBooth = statusBooth;
    }

    public String getIdBooth() {
        return idBooth;
    }

    public void setIdBooth(String idBooth) {
        this.idBooth = idBooth;
    }

    public String getNomorBooth() {
        return nomorBooth;
    }

    public void setNomorBooth(String nomorBooth) {
        this.nomorBooth = nomorBooth;
    }

    public String getLokasiBooth() {
        return lokasiBooth;
    }

    public void setLokasiBooth(String lokasiBooth) {
        this.lokasiBooth = lokasiBooth;
    }

    public double getHargaSewa() {
        return hargaSewa;
    }

    public void setHargaSewa(double hargaSewa) {
        this.hargaSewa = hargaSewa;
    }

    public boolean isStatusBooth() {
        return statusBooth;
    }

    public void setStatusBooth(boolean statusBooth) {
        this.statusBooth = statusBooth;
    }
}