package com.tixevent.backend.repository;

import com.tixevent.backend.entity.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;
public interface TenantRepository extends JpaRepository<Tenant, String> {
}
