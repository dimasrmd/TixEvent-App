package com.tixevent.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "check_in_system")
public class CheckInSystem {

    @Id
    @Column(name = "id_check_in")
    private String idCheckIn;

    @Column(name = "gate_masuk")
    private String gateMasuk;

    // Relasi ke objek Tiket (Many-to-One)
    @ManyToOne
    @JoinColumn(name = "kode_tiket", referencedColumnName = "kodeTiket")
    private Tiket tiket;

    // Relasi ke objek Transaksi (One-to-One)
    @OneToOne
    @JoinColumn(name = "id_transaksi", referencedColumnName = "idTransaksi") // Sesuaikan idTransaksi jika milik Zaky/Jek berbeda
    private Transaksi transaksi;

    // Relasi ke objek Panitia (Many-to-One)
    @ManyToOne
    @JoinColumn(name = "id_panitia", referencedColumnName = "idUser") // idUser berasal dari inheritance kelas User
    private Panitia panitia;

    // Constructor Kosong (Wajib bagi JPA)
    public CheckInSystem() {
    }

    // Constructor Parameter Lengkap yang sudah disesuaikan dengan relasi baru
    public CheckInSystem(String idCheckIn, String gateMasuk, Tiket tiket, Transaksi transaksi, Panitia panitia) {
        this.idCheckIn = idCheckIn;
        this.gateMasuk = gateMasuk;
        this.tiket = tiket;
        this.transaksi = transaksi;
        this.panitia = panitia;
    }

    // Getter dan Setter
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

    public Tiket getTiket() {
        return tiket;
    }

    public void setTiket(Tiket tiket) {
        this.tiket = tiket;
    }

    public Transaksi getTransaksi() {
        return transaksi;
    }

    public void setTransaksi(Transaksi transaksi) {
        this.transaksi = transaksi;
    }

    public Panitia getPanitia() {
        return panitia;
    }

    public void setPanitia(Panitia panitia) {
        this.panitia = panitia;
    }
}