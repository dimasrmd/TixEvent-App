package com.tixevent.backend.rundown.controller;

import com.tixevent.backend.rundown.entity.Artist;
import com.tixevent.backend.rundown.entity.Event;
import com.tixevent.backend.rundown.entity.Rundown;
import com.tixevent.backend.rundown.service.RundownService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rundown")
@CrossOrigin(origins = "*")
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
    public List<Rundown> getAllRundowns() {
        return rundownService.getAllRundowns();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRundownById(@PathVariable Long id) {
        return rundownService.getRundownById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> addRundown(@RequestBody Rundown rundown) {
        try {
            Rundown savedRundown = rundownService.addRundown(rundown);
            return ResponseEntity.ok(savedRundown);
        } catch (IllegalArgumentException error) {
            return ResponseEntity.badRequest().body(error.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRundown(@PathVariable Long id, @RequestBody Rundown rundown) {
        try {
            Rundown updatedRundown = rundownService.updateRundown(id, rundown);
            return ResponseEntity.ok(updatedRundown);
        } catch (IllegalArgumentException error) {
            return ResponseEntity.badRequest().body(error.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRundown(@PathVariable Long id) {
        boolean deleted = rundownService.deleteRundown(id);

        if (!deleted) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok("Rundown berhasil dihapus");
    }

    @GetMapping("/stage/{stageName}")
    public List<Rundown> getRundownByStage(@PathVariable String stageName) {
        return rundownService.getRundownByStage(stageName);
    }

    @PostMapping("/check-conflict")
    public ResponseEntity<?> checkConflict(@RequestBody Rundown rundown) {
        try {
            boolean conflict = rundownService.hasScheduleConflict(rundown);

            if (conflict) {
                return ResponseEntity.ok("Jadwal bentrok pada panggung yang sama");
            }

            return ResponseEntity.ok("Jadwal tersedia");
        } catch (IllegalArgumentException error) {
            return ResponseEntity.badRequest().body(error.getMessage());
        }
    }
}
