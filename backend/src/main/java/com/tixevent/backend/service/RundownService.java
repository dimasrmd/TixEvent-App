package com.tixevent.backend.service;

import com.tixevent.backend.entity.Artist;
import com.tixevent.backend.entity.Event;
import com.tixevent.backend.entity.EventSchedule;
import com.tixevent.backend.repository.ArtistRepository;
import com.tixevent.backend.repository.EventRepository;
import com.tixevent.backend.repository.EventScheduleRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class RundownService {
    private final ArtistRepository artistRepository;
    private final EventRepository eventRepository;
    private final EventScheduleRepository eventScheduleRepository;

    public RundownService(
            ArtistRepository artistRepository,
            EventRepository eventRepository,
            EventScheduleRepository eventScheduleRepository
    ) {
        this.artistRepository = artistRepository;
        this.eventRepository = eventRepository;
        this.eventScheduleRepository = eventScheduleRepository;
    }

    public List<Artist> getAllArtists() {
        return artistRepository.findAll();
    }

    public Artist addArtist(Artist artist) {
        // 1. Generate ID otomatis menggunakan UUID
        if (artist.getIdArtist() == null || artist.getIdArtist().isBlank()) {
            String generatedId = "ART-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
            artist.setIdArtist(generatedId);
        }

        validateArtist(artist);

        if (artist.getEventSchedule() != null && artist.getEventSchedule().getIdJadwal() != null) {
            EventSchedule eventSchedule = eventScheduleRepository.findById(artist.getEventSchedule().getIdJadwal())
                    .orElseThrow(() -> new IllegalArgumentException("Jadwal tidak ditemukan"));

            artist.setEventSchedule(eventSchedule);
        }

        return artistRepository.save(artist);
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event addEvent(Event event) {
        if (event.getIdEvent() == null || event.getIdEvent().isBlank()) {
            String generatedId = "EVT-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
            event.setIdEvent(generatedId);
        }

        validateEvent(event);
        return eventRepository.save(event);
    }

    public List<EventSchedule> getAllSchedules() {
        return eventScheduleRepository.findAll();
    }

    public EventSchedule getScheduleById(String idJadwal) {
        return eventScheduleRepository.findById(idJadwal)
                .orElseThrow(() -> new IllegalArgumentException("Jadwal tidak ditemukan"));
    }

    public EventSchedule addSchedule(EventSchedule eventSchedule) {
        if (eventSchedule.getIdJadwal() == null || eventSchedule.getIdJadwal().isBlank()) {
            String generatedId = "JDW-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
            eventSchedule.setIdJadwal(generatedId);
        }

        validateScheduleBasic(eventSchedule);

        Event event = eventRepository.findById(eventSchedule.getEvent().getIdEvent())
                .orElseThrow(() -> new IllegalArgumentException("Event tidak ditemukan"));

        eventSchedule.setEvent(event);

        if (eventSchedule.getPanggung() == null || eventSchedule.getPanggung().isBlank()) {
            eventSchedule.setPanggung(event.getStageName());
        }

        validateScheduleTime(eventSchedule);

        if (hasScheduleConflict(eventSchedule)) {
            throw new IllegalArgumentException("Jadwal bentrok pada panggung yang sama");
        }

        return eventScheduleRepository.save(eventSchedule);
    }

    public EventSchedule updateSchedule(String idJadwal, EventSchedule updatedSchedule) {
        EventSchedule existingSchedule = getScheduleById(idJadwal);

        validateScheduleBasic(updatedSchedule);

        Event event = eventRepository.findById(updatedSchedule.getEvent().getIdEvent())
                .orElseThrow(() -> new IllegalArgumentException("Event tidak ditemukan"));

        updatedSchedule.setEvent(event);

        if (updatedSchedule.getPanggung() == null || updatedSchedule.getPanggung().isBlank()) {
            updatedSchedule.setPanggung(event.getStageName());
        }

        validateScheduleTime(updatedSchedule);

        if (hasScheduleConflictForUpdate(idJadwal, updatedSchedule)) {
            throw new IllegalArgumentException("Jadwal bentrok pada panggung yang sama");
        }

        existingSchedule.setPanggung(updatedSchedule.getPanggung());
        existingSchedule.setStartTime(updatedSchedule.getStartTime());
        existingSchedule.setEndTime(updatedSchedule.getEndTime());
        existingSchedule.setEvent(updatedSchedule.getEvent());

        return eventScheduleRepository.save(existingSchedule);
    }

    public boolean deleteSchedule(String idJadwal) {
        if (!eventScheduleRepository.existsById(idJadwal)) {
            return false;
        }

        eventScheduleRepository.deleteById(idJadwal);
        return true;
    }

    public List<EventSchedule> getSchedulesByStage(String panggung) {
        return eventScheduleRepository.findByPanggungIgnoreCase(panggung);
    }

    public boolean hasScheduleConflict(EventSchedule newSchedule) {
        validateScheduleBasic(newSchedule);

        if (newSchedule.getEvent().getStageName() == null && newSchedule.getEvent().getIdEvent() != null) {
            Event event = eventRepository.findById(newSchedule.getEvent().getIdEvent())
                    .orElseThrow(() -> new IllegalArgumentException("Event tidak ditemukan"));

            newSchedule.setEvent(event);
        }

        if (newSchedule.getPanggung() == null || newSchedule.getPanggung().isBlank()) {
            newSchedule.setPanggung(newSchedule.getEvent().getStageName());
        }

        validateScheduleTime(newSchedule);

        List<EventSchedule> schedules = eventScheduleRepository.findAll();

        for (EventSchedule existingSchedule : schedules) {
            if (isSameStage(existingSchedule, newSchedule) && isTimeOverlap(existingSchedule, newSchedule)) {
                return true;
            }
        }

        return false;
    }

    private boolean hasScheduleConflictForUpdate(String idJadwal, EventSchedule updatedSchedule) {
        List<EventSchedule> schedules = eventScheduleRepository.findAll();

        for (EventSchedule existingSchedule : schedules) {
            if (existingSchedule.getIdJadwal().equals(idJadwal)) {
                continue;
            }

            if (isSameStage(existingSchedule, updatedSchedule) && isTimeOverlap(existingSchedule, updatedSchedule)) {
                return true;
            }
        }

        return false;
    }

    private boolean isSameStage(EventSchedule existingSchedule, EventSchedule newSchedule) {
        return existingSchedule.getPanggung() != null
                && newSchedule.getPanggung() != null
                && existingSchedule.getPanggung().equalsIgnoreCase(newSchedule.getPanggung());
    }

    private boolean isTimeOverlap(EventSchedule existingSchedule, EventSchedule newSchedule) {
        return newSchedule.getStartTime().isBefore(existingSchedule.getEndTime())
                && newSchedule.getEndTime().isAfter(existingSchedule.getStartTime());
    }

    private void validateArtist(Artist artist) {
        if (artist == null) {
            throw new IllegalArgumentException("Artist tidak boleh kosong");
        }

        if (artist.getIdArtist() == null || artist.getIdArtist().isBlank()) {
            throw new IllegalArgumentException("ID artist tidak boleh kosong");
        }

        if (artist.getName() == null || artist.getName().isBlank()) {
            throw new IllegalArgumentException("Nama artist tidak boleh kosong");
        }

        if (artist.getGenre() == null || artist.getGenre().isBlank()) {
            throw new IllegalArgumentException("Genre artist tidak boleh kosong");
        }
    }

    private void validateEvent(Event event) {
        if (event == null) {
            throw new IllegalArgumentException("Event tidak boleh kosong");
        }

        if (event.getIdEvent() == null || event.getIdEvent().isBlank()) {
            throw new IllegalArgumentException("ID event tidak boleh kosong");
        }

        if (event.getEventName() == null || event.getEventName().isBlank()) {
            throw new IllegalArgumentException("Nama event tidak boleh kosong");
        }

        if (event.getStageName() == null || event.getStageName().isBlank()) {
            throw new IllegalArgumentException("Nama panggung tidak boleh kosong");
        }

        if (event.getLocation() == null || event.getLocation().isBlank()) {
            throw new IllegalArgumentException("Lokasi event tidak boleh kosong");
        }
    }

    private void validateScheduleBasic(EventSchedule eventSchedule) {
        if (eventSchedule == null) {
            throw new IllegalArgumentException("Jadwal tidak boleh kosong");
        }

        if (eventSchedule.getIdJadwal() == null || eventSchedule.getIdJadwal().isBlank()) {
            throw new IllegalArgumentException("ID jadwal tidak boleh kosong");
        }

        if (eventSchedule.getEvent() == null) {
            throw new IllegalArgumentException("Event tidak boleh kosong");
        }

        if (eventSchedule.getEvent().getIdEvent() == null || eventSchedule.getEvent().getIdEvent().isBlank()) {
            throw new IllegalArgumentException("ID event tidak boleh kosong");
        }
    }

    private void validateScheduleTime(EventSchedule eventSchedule) {
        if (eventSchedule.getPanggung() == null || eventSchedule.getPanggung().isBlank()) {
            throw new IllegalArgumentException("Nama panggung tidak boleh kosong");
        }

        if (eventSchedule.getStartTime() == null || eventSchedule.getEndTime() == null) {
            throw new IllegalArgumentException("Start time dan end time tidak boleh kosong");
        }

        if (!eventSchedule.getStartTime().isBefore(eventSchedule.getEndTime())) {
            throw new IllegalArgumentException("Start time harus sebelum end time");
        }
    }
}
