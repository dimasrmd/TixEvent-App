package com.tixevent.backend.repository;

import com.tixevent.backend.entity.CheckInSystem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CheckInRepository extends JpaRepository<CheckInSystem, String> {
    // Interface ini murni dikosongkan karena sudah otomatis mewarisi seluruh fungsi CRUD database.
    // Parameter pertama 'CheckInSystem' adalah kelas entitas yang ditargetkan.
    // Parameter kedua 'String' adalah tipe data dari ID Primary Key kelas tersebut (@Id idCheckIn).
}