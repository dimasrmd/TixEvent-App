package com.tixevent.backend.repository;

import com.tixevent.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
    // Custom query method bawaan JPA untuk mencari data berdasarkan Email
    Optional<User> findByEmail(String email);
}