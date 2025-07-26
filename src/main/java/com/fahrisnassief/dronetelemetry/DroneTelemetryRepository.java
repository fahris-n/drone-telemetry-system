package com.fahrisnassief.dronetelemetry;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DroneTelemetryRepository extends JpaRepository <DroneTelemetry, Long> {

    @Query("SELECT DISTINCT d.droneId FROM DroneTelemetry d")
    List<String> findDistinctDrones();
}
