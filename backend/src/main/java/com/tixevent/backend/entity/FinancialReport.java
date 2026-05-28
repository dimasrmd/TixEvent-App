package com.tixevent.backend.entity;

import jakarta.persistence.*;

@Entity
public class FinancialReport {
    @Id
    private String idLaporan;
    private double totalPemasukan;
    private double totalRefund;
    private double labaBersih;

    @ManyToOne
    @JoinColumn(name = "id_event_fk")
    private Event event;

    @ManyToOne
    @JoinColumn(name = "id_manajer_fk")
    private Manajer manajer;

    // Constructor Kosong
    public FinancialReport() {
    }

    // Constructor Lengkap
    public FinancialReport(String idLaporan, double totalPemasukan, double totalRefund, double labaBersih) {
        this.idLaporan = idLaporan;
        this.totalPemasukan = totalPemasukan;
        this.totalRefund = totalRefund;
        this.labaBersih = labaBersih;
    }

    // Getter dan Setter
    public String getIdLaporan() {
        return idLaporan;
    }

    public void setIdLaporan(String idLaporan) {
        this.idLaporan = idLaporan;
    }

    public double getTotalPemasukan() {
        return totalPemasukan;
    }

    public void setTotalPemasukan(double totalPemasukan) {
        this.totalPemasukan = totalPemasukan;
    }

    public double getTotalRefund() {
        return totalRefund;
    }

    public void setTotalRefund(double totalRefund) {
        this.totalRefund = totalRefund;
    }

    public double getLabaBersih() {
        return labaBersih;
    }

    public void setLabaBersih(double labaBersih) {
        this.labaBersih = labaBersih;
    }
}