package com.tixevent.backend.entity;

import java.time.LocalDateTime;

public class CheckInSystem {
    private String idCheckIn;
    private String gateMasuk;
    private String ticketCode;
    private LocalDateTime waktuCheckIn;
    private boolean isSuccess;

    // Constructor Kosong
    public CheckInSystem() {
    }

    // Constructor Parameter Lengkap
    public CheckInSystem(String idCheckIn, String gateMasuk, String ticketCode) {
        this.idCheckIn = idCheckIn;
        this.gateMasuk = gateMasuk;
        this.ticketCode = ticketCode;
        this.waktuCheckIn = LocalDateTime.now();
        this.isSuccess = false;
    }

    public boolean eksekusiCheckIn(Tiket tiket) {
        if (tiket == null || !tiket.getKodeTiket().equals(this.ticketCode)) {
            this.isSuccess = false;
            System.out.println("Check-In Gagal: Tiket tidak valid!");
            return false;
        }

        if (tiket.cekStatus()) {
            this.isSuccess = false;
            System.out.println("Check-In Gagal: Tiket sudah pernah digunakan!");
            return false;
        }

        // Jalankan method penanda milik Zaky
        tiket.tandaiDigunakan();
        this.isSuccess = true;
        System.out.println("Check-In Berhasil di " + this.gateMasuk);
        return true;
    }

    // Getter dan Setter
    public String getIdCheckIn() { return idCheckIn; }
    public void setIdCheckIn(String idCheckIn) { this.idCheckIn = idCheckIn; }

    public String getGateMasuk() { return gateMasuk; }
    public void setGateMasuk(String gateMasuk) { this.gateMasuk = gateMasuk; }

    public String getTicketCode() { return ticketCode; }
    public void setTicketCode(String ticketCode) { this.ticketCode = ticketCode; }

    public LocalDateTime getWaktuCheckIn() { return waktuCheckIn; }

    public boolean isSuccess() { return isSuccess; }
    public void setSuccess(boolean success) { isSuccess = success; }
}