package com.tixevent.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Event {
    // Encapsulation: atribut dibuat private dan diakses melalui getter/setter
    @Id
    private Long id;
    private String eventName;
    private String stageName;
    private String location;

    public Event() {
    }

    public Event(Long idEvent, String eventName, String stageName, String location) {
        this.idEvent = idEvent;
        this.eventName = eventName;
        this.stageName = stageName;
        this.location = location;
    }

    public Long getIdEvent() {
        return idEvent;
    }

    public void setIdEvent(Long idEvent) {
        this.idEvent = idEvent;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public String getStageName() {
        return stageName;
    }

    public void setStageName(String stageName) {
        this.stageName = stageName;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}
