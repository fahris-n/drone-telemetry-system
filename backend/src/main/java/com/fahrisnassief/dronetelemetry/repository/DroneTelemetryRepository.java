package com.fahrisnassief.dronetelemetry.repository;

import com.fahrisnassief.dronetelemetry.model.DroneTelemetry;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DroneTelemetryRepository extends JpaRepository<DroneTelemetry, Long> {}
