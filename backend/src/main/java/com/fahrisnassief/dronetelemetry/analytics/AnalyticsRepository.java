package com.fahrisnassief.dronetelemetry.analytics;

import com.fahrisnassief.dronetelemetry.model.DroneTelemetry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AnalyticsRepository extends JpaRepository<DroneTelemetry, Long> {

    @Query("SELECT DISTINCT d.droneId FROM DroneTelemetry d")
    List<String> findDistinctDrones();

    @Query(value = "SELECT AVG(EXTRACT(EPOCH FROM received_at) - EXTRACT(EPOCH FROM REPLACE(timestamp, '+00:00Z', '+00:00')::timestamptz)) * 1000 FROM drone_telemetry", nativeQuery = true)
    Double getAverageLatencyMs();
}
