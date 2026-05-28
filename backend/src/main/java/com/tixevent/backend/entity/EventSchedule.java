package com.tixevent.backend.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class EventSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idJadwal;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    @ManyToOne
    @JoinColumn(name = "id_event_fk")
    private Event event;

    public EventSchedule() {
    }

    public EventSchedule(Long idJadwal, LocalDateTime startTime, LocalDateTime endTime, Event event) {
        this.idJadwal = idJadwal;
        this.startTime = startTime;
        this.endTime = endTime;
        this.event = event;
    }

    public Long getIdJadwal() {
        return idJadwal;
    }

    public void setIdJadwal(Long idJadwal) {
        this.idJadwal = idJadwal;
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
