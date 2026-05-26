package com.tixevent.backend.entity;

public class Tenant extends User {

    private String namaUsaha;
    private String jenisProduk;

    public Tenant(String nama, String email, String password,
                  String namaUsaha, String jenisProduk) {

        this.namaUsaha = namaUsaha;
        this.jenisProduk = jenisProduk;
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