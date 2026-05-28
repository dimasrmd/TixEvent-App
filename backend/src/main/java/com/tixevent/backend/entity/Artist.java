package com.tixevent.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Column;

@Entity
public class Artist {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long idArtist;

    private String name;
    private String genre;

    @ManyToOne
    @JoinColumn(name = "id_jadwal_fk")
    private EventSchedule eventSchedule;

    public Artist() {
    }

    public Artist(Long idArtist, String name, String genre, EventSchedule eventSchedule) {
        this.idArtist = idArtist;
        this.name = name;
        this.genre = genre;
        this.eventSchedule = eventSchedule;
    }

    public Long getIdArtist() {
        return idArtist;
    }

    public void setIdArtist(Long idArtist) {
        this.idArtist = idArtist;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public EventSchedule getEventSchedule() {
        return eventSchedule;
    }

    public void setEventSchedule(EventSchedule eventSchedule) {
        this.eventSchedule = eventSchedule;
    }
}
