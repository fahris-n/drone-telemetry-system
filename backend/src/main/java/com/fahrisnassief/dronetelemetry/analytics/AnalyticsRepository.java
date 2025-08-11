package com.fahrisnassief.dronetelemetry.analytics;

import com.fahrisnassief.dronetelemetry.model.DroneTelemetry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AnalyticsRepository extends JpaRepository<DroneTelemetry, Long> {

    @Query("SELECT DISTINCT d.droneId FROM DroneTelemetry d")
    List<String> findDistinctDrones();
}
