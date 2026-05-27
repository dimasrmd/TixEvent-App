package com.tixevent.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "test_refund")
public class Refund {
    @Id
    private String idRefund;
    private String alasan;
    private double jumlahRefund;
    private String statusRefund; // Contoh: "PENDING", "APPROVED", "REJECTED"

    public Refund() {
    }

    public Refund(String idRefund, String alasan, double jumlahRefund, String statusRefund) {
        this.idRefund = idRefund;
        this.alasan = alasan;
        this.jumlahRefund = jumlahRefund;
        this.statusRefund = statusRefund;
    }

    // Getter dan Setter
    public String getIdRefund() {
        return idRefund;
    }

    public void setIdRefund(String idRefund) {
        this.idRefund = idRefund;
    }

    public String getAlasan() {
        return alasan;
    }

    public void setAlasan(String alasan) {
        this.alasan = alasan;
    }

    public double getJumlahRefund() {
        return jumlahRefund;
    }

    public void setJumlahRefund(double jumlahRefund) {
        this.jumlahRefund = jumlahRefund;
    }

    public String getStatusRefund() {
        return statusRefund;
    }

    public void setStatusRefund(String statusRefund) {
        this.statusRefund = statusRefund;
    }
}