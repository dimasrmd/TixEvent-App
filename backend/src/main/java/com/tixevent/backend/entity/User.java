package com.tixevent.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class User {
    // Atribut berdasarkan Class Diagram (Private)
    @Id
    private String idUser;
    private String nama;
    private String email;
    private String password;
    private String noHp;

    public User() {

    }

    public User(String idUser, String nama, String email, String password, String noHp) {
        this.idUser = idUser;
        this.nama = nama;
        this.email = email;
        this.password = password;
        this.noHp = noHp;
    }


    public String getIdUser() {
        return idUser;
    }

    public void setIdUser(String idUser) {
        this.idUser = idUser;
    }

    public String getNama() {
        return nama;
    }

    public void setNama(String nama) {
        this.nama = nama;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getNoHp() {
        return noHp;
    }

    public void setNoHp(String noHp) {
        this.noHp = noHp;
    }

    // Method berdasarkan Class Diagram (Public)
    public boolean login() {
        // Logika login akan dibuat nanti
        return false;
    }

    public void logout() {
        // Logika logout akan dibuat nanti
    }

    public void lihatProfil() {
        // Logika lihat profil akan dibuat nanti
    }
}