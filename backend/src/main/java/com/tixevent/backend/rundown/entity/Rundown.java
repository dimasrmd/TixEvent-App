package com.tixevent.backend.rundown.entity;

import java.time.LocalDateTime;

public class Rundown {
    // Encapsulation: atribut dibuat private dan diakses melalui getter/setter
    private Long id;
    private Artist artist;
    private Event event;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    public Rundown() {
    }

    public Rundown(Long id, Artist artist, Event event, LocalDateTime startTime, LocalDateTime endTime) {
        this.id = id;
        this.artist = artist;
        this.event = event;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public Long getId() {
        return id;
    }

    public Artist getArtist() {
        return artist;
    }

    public Event getEvent() {
        return event;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setArtist(Artist artist) {
        this.artist = artist;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }
}
