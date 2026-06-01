package com.tixevent.backend.controller;

import com.tixevent.backend.entity.Artist;
import com.tixevent.backend.entity.Event;
import com.tixevent.backend.entity.EventSchedule;
import com.tixevent.backend.service.RundownService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map; // Tambahan import untuk JSON Map

@RestController
@RequestMapping("/api/rundown")
@CrossOrigin(origins = "http://localhost:3000")
public class RundownController {
    private final RundownService rundownService;

    public RundownController(RundownService rundownService) {
        this.rundownService = rundownService;
    }

    @GetMapping("/artists")
    public List<Artist> getAllArtists() {
        return rundownService.getAllArtists();
    }

    @PostMapping("/artists")
    public ResponseEntity<?> addArtist(@RequestBody Artist artist) {
        try {
            Artist savedArtist = rundownService.addArtist(artist);
            return ResponseEntity.ok(savedArtist);
        } catch (IllegalArgumentException error) {
            return ResponseEntity.badRequest().body(error.getMessage());
        }
    }

    @GetMapping("/events")
    public List<Event> getAllEvents() {
        return rundownService.getAllEvents();
    }

    @PostMapping("/events")
    public ResponseEntity<?> addEvent(@RequestBody Event event) {
        try {
            Event savedEvent = rundownService.addEvent(event);
            return ResponseEntity.ok(savedEvent);
        } catch (IllegalArgumentException error) {
            return ResponseEntity.badRequest().body(error.getMessage());
        }
    }

    @GetMapping
    public List<EventSchedule> getAllSchedules() {
        return rundownService.getAllSchedules();
    }

    @GetMapping("/{idJadwal}")
    public ResponseEntity<?> getScheduleById(@PathVariable String idJadwal) {
        try {
            EventSchedule schedule = rundownService.getScheduleById(idJadwal);
            return ResponseEntity.ok(schedule);
        } catch (IllegalArgumentException error) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> addSchedule(@RequestBody EventSchedule eventSchedule) {
        // Blokade "Satpam": Cek jika panggung null atau string kosong
        if (eventSchedule.getPanggung() == null || eventSchedule.getPanggung().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "Failed",
                    "message", "Data tidak lengkap: Nama panggung wajib diisi!"
            ));
        }

        try {
            EventSchedule savedSchedule = rundownService.addSchedule(eventSchedule);
            return ResponseEntity.ok(savedSchedule);
        } catch (IllegalArgumentException error) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "Failed",
                    "message", error.getMessage()
            ));
        }
    }

    @PutMapping("/{idJadwal}")
    public ResponseEntity<?> updateSchedule(
            @PathVariable String idJadwal,
            @RequestBody EventSchedule eventSchedule
    ) {
        try {
            EventSchedule updatedSchedule = rundownService.updateSchedule(idJadwal, eventSchedule);
            return ResponseEntity.ok(updatedSchedule);
        } catch (IllegalArgumentException error) {
            return ResponseEntity.badRequest().body(error.getMessage());
        }
    }

    @DeleteMapping("/{idJadwal}")
    public ResponseEntity<?> deleteSchedule(@PathVariable String idJadwal) {
        boolean deleted = rundownService.deleteSchedule(idJadwal);

        if (!deleted) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok("Jadwal berhasil dihapus");
    }

    @GetMapping("/stage/{panggung}")
    public List<EventSchedule> getSchedulesByStage(@PathVariable String panggung) {
        return rundownService.getSchedulesByStage(panggung);
    }

    @PostMapping("/check-conflict")
    public ResponseEntity<?> checkConflict(@RequestBody EventSchedule eventSchedule) {
        try {
            boolean conflict = rundownService.hasScheduleConflict(eventSchedule);

            if (conflict) {
                return ResponseEntity.ok("Jadwal bentrok pada panggung yang sama");
            }

            return ResponseEntity.ok("Jadwal tersedia");
        } catch (IllegalArgumentException error) {
            return ResponseEntity.badRequest().body(error.getMessage());
        }
    }
}