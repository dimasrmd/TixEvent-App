package com.tixevent.backend.service;

import com.tixevent.backend.entity.Artist;
import com.tixevent.backend.entity.Event;
import com.tixevent.backend.entity.Rundown;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class RundownService {
    // Encapsulation: data disimpan dalam atribut private
    // Struktur data in-memory menggunakan List sebelum database dipasang
    private final List<Artist> artists = new ArrayList<>();
    private final List<Event> events = new ArrayList<>();
    private final List<Rundown> rundowns = new ArrayList<>();

    private Long artistIdCounter = 1L;
    private Long eventIdCounter = 1L;
    private Long rundownIdCounter = 1L;

    public List<Artist> getAllArtists() {
        return artists;
    }

    public Artist addArtist(Artist artist) {
        validateArtist(artist);

        artist.setId(artistIdCounter++);
        artists.add(artist);
        return artist;
    }

    public List<Event> getAllEvents() {
        return events;
    }

    public Event addEvent(Event event) {
        validateEvent(event);

        event.setId(eventIdCounter++);
        events.add(event);
        return event;
    }

    public List<Rundown> getAllRundowns() {
        return rundowns;
    }

    public Optional<Rundown> getRundownById(Long id) {
        return rundowns.stream()
                .filter(rundown -> rundown.getId().equals(id))
                .findFirst();
    }

    public Rundown addRundown(Rundown rundown) {
        validateRundown(rundown);

        if (hasScheduleConflict(rundown)) {
            throw new IllegalArgumentException("Jadwal bentrok pada panggung yang sama");
        }

        rundown.setId(rundownIdCounter++);
        rundowns.add(rundown);
        return rundown;
    }

    public Rundown updateRundown(Long id, Rundown updatedRundown) {
        Rundown existingRundown = getRundownById(id)
                .orElseThrow(() -> new IllegalArgumentException("Rundown tidak ditemukan"));

        validateRundown(updatedRundown);

        if (hasScheduleConflictForUpdate(id, updatedRundown)) {
            throw new IllegalArgumentException("Jadwal bentrok pada panggung yang sama");
        }

        existingRundown.setArtist(updatedRundown.getArtist());
        existingRundown.setEvent(updatedRundown.getEvent());
        existingRundown.setStartTime(updatedRundown.getStartTime());
        existingRundown.setEndTime(updatedRundown.getEndTime());

        return existingRundown;
    }

    public boolean deleteRundown(Long id) {
        return rundowns.removeIf(rundown -> rundown.getId().equals(id));
    }

    public List<Rundown> getRundownByStage(String stageName) {
        List<Rundown> result = new ArrayList<>();

        for (Rundown rundown : rundowns) {
            if (rundown.getEvent() != null
                    && rundown.getEvent().getStageName() != null
                    && rundown.getEvent().getStageName().equalsIgnoreCase(stageName)) {
                result.add(rundown);
            }
        }

        return result;
    }

    // Logika utama modul penjadwalan: deteksi konflik jadwal panggung
    public boolean hasScheduleConflict(Rundown newRundown) {
        validateRundown(newRundown);

        for (Rundown existingRundown : rundowns) {
            if (isSameStage(existingRundown, newRundown) && isTimeOverlap(existingRundown, newRundown)) {
                return true;
            }
        }

        return false;
    }

    private boolean hasScheduleConflictForUpdate(Long id, Rundown updatedRundown) {
        for (Rundown existingRundown : rundowns) {
            if (existingRundown.getId().equals(id)) {
                continue;
            }

            if (isSameStage(existingRundown, updatedRundown) && isTimeOverlap(existingRundown, updatedRundown)) {
                return true;
            }
        }

        return false;
    }

    private boolean isSameStage(Rundown existingRundown, Rundown newRundown) {
        return existingRundown.getEvent() != null
                && newRundown.getEvent() != null
                && existingRundown.getEvent().getStageName() != null
                && newRundown.getEvent().getStageName() != null
                && existingRundown.getEvent().getStageName()
                .equalsIgnoreCase(newRundown.getEvent().getStageName());
    }

    private boolean isTimeOverlap(Rundown existingRundown, Rundown newRundown) {
        return newRundown.getStartTime().isBefore(existingRundown.getEndTime())
                && newRundown.getEndTime().isAfter(existingRundown.getStartTime());
    }

    private void validateArtist(Artist artist) {
        if (artist == null) {
            throw new IllegalArgumentException("Artist tidak boleh kosong");
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

    private void validateRundown(Rundown rundown) {
        if (rundown == null) {
            throw new IllegalArgumentException("Rundown tidak boleh kosong");
        }

        if (rundown.getArtist() == null) {
            throw new IllegalArgumentException("Artist tidak boleh kosong");
        }

        if (rundown.getArtist().getName() == null || rundown.getArtist().getName().isBlank()) {
            throw new IllegalArgumentException("Nama artist tidak boleh kosong");
        }

        if (rundown.getEvent() == null) {
            throw new IllegalArgumentException("Event tidak boleh kosong");
        }

        if (rundown.getEvent().getStageName() == null || rundown.getEvent().getStageName().isBlank()) {
            throw new IllegalArgumentException("Nama panggung tidak boleh kosong");
        }

        if (rundown.getStartTime() == null || rundown.getEndTime() == null) {
            throw new IllegalArgumentException("Start time dan end time tidak boleh kosong");
        }

        if (!rundown.getStartTime().isBefore(rundown.getEndTime())) {
            throw new IllegalArgumentException("Start time harus sebelum end time");
        }
    }
}
