package com.tixevent.backend.repository;

import com.tixevent.backend.entity.FinancialReport;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FinancialReportRepository extends JpaRepository<FinancialReport, String> {
}
