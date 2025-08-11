package com.fahrisnassief.dronetelemetry.analytics;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {
   private final AnalyticsRepository analyticsRepository;

    public AnalyticsService(AnalyticsRepository analyticsRepository) {
        this.analyticsRepository = analyticsRepository;
    }

    public List<DroneIdDTO> getDistinctDrones() {
       List<String> droneIds = analyticsRepository.findDistinctDrones();

       return droneIds
               .stream()
               .map(id -> new DroneIdDTO(id))
               .collect(Collectors.toList());
   }
}
