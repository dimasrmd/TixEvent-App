package com.tixevent.backend.entity;

public class Tenant extends User {

    private String namaUsaha;
    private String jenisProduk;


    public Tenant(String idUser, String nama, String email, 
                  String password, String noHp,
                  String namaUsaha, String jenisProduk) {
        super(idUser, nama, email, password, noHp); 
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