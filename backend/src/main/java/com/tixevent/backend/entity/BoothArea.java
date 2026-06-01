package com.tixevent.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "tabel_booth_area")
public class BoothArea {

    @Id
    private String idBooth;
    private String nomorBooth;
    private String lokasiBooth;
    private double hargaSewa;
    private boolean statusBooth;

    @OneToOne
    @JoinColumn(name = "id_tenant_fk", unique = true)
    @JsonIgnore
    private Tenant tenant;

    @ManyToOne
    @JoinColumn(name = "id_event_fk")
    private Event event;

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

    public Tenant getTenant() {
        return tenant;
    }

    public void setTenant(Tenant tenant) {
        this.tenant = tenant;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }
}