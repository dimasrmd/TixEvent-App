package com.tixevent.backend.repository;

import com.tixevent.backend.entity.Artist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ArtistRepository extends JpaRepository<Artist, Long> {
    List<Artist> findByEventScheduleIdJadwal(Long idJadwal);
}
