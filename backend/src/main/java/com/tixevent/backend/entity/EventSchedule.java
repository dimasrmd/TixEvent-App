package com.tixevent.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import java.time.LocalDateTime;

@Entity
public class EventSchedule {
    @Id
    private String idJadwal;

    private String panggung;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    @ManyToOne
    @JoinColumn(name = "id_event_fk")
    private Event event;

    public EventSchedule() {
    }

    public EventSchedule(String idJadwal, String panggung, LocalDateTime startTime, LocalDateTime endTime, Event event) {
        this.idJadwal = idJadwal;
        this.panggung = panggung;
        this.startTime = startTime;
        this.endTime = endTime;
        this.event = event;
    }

    public String getIdJadwal() {
        return idJadwal;
    }

    public void setIdJadwal(String idJadwal) {
        this.idJadwal = idJadwal;
    }

    public String getPanggung() {
        return panggung;
    }

    public void setPanggung(String panggung) {
        this.panggung = panggung;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }
}
