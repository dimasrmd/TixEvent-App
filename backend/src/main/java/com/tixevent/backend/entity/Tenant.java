package com.tixevent.backend.entity;

public class Tenant extends User {

    private String namaUsaha;
    private String jenisProduk;

    // ✅ Konstruktor kosong (panggil super kosong)
    public Tenant() {
        super();
    }

    public Tenant(String idUser, String nama, String email,
                  String password, String noHp,
                  String namaUsaha, String jenisProduk) {
        super(idUser, nama, email, password, noHp);
        this.namaUsaha = namaUsaha;
        this.jenisProduk = jenisProduk;
    }

    // ✅ Override method login() dari superclass User
    @Override
    public boolean login() {
        System.out.println("Tenant " + getNama() + " berhasil login.");
        return true;
    }

    public String getNamaUsaha() {
        return namaUsaha;
    }

    public void setNamaUsaha(String namaUsaha) {
        this.namaUsaha = namaUsaha;
    }

    public String getJenisProduk() {
        return jenisProduk;
    }

    public void setJenisProduk(String jenisProduk) {
        this.jenisProduk = jenisProduk;
    }
}