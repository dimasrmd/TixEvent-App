package com.tixevent.backend.rundown.entity;

public class Artist {
    // Encapsulation: atribut dibuat private dan diakses melalui getter/setter
    private Long id;
    private String name;
    private String genre;

    public Artist() {
    }

    public Artist(Long id, String name, String genre) {
        this.id = id;
        this.name = name;
        this.genre = genre;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getGenre() {
        return genre;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }
}
