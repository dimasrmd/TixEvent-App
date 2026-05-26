package com.tixevent.backend.entity;

public class Event {
    // Encapsulation: atribut dibuat private dan diakses melalui getter/setter
    private Long id;
    private String eventName;
    private String stageName;
    private String location;

    public Event() {
    }

    public Event(Long id, String eventName, String stageName, String location) {
        this.id = id;
        this.eventName = eventName;
        this.stageName = stageName;
        this.location = location;
    }

    public Long getId() {
        return id;
    }

    public String getEventName() {
        return eventName;
    }

    public String getStageName() {
        return stageName;
    }

    public String getLocation() {
        return location;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public void setStageName(String stageName) {
        this.stageName = stageName;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}
