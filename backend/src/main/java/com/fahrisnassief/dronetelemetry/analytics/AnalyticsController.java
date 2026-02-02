package com.fahrisnassief.dronetelemetry.analytics;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/analytics")
@CrossOrigin(origins = "http:/localhost/5173")
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final AnalyticsRepository analyticsRepository;

    public AnalyticsController(AnalyticsService analyticsService, AnalyticsRepository analyticsRepository) {
        this.analyticsService = analyticsService;
        this.analyticsRepository = analyticsRepository;
    }

    @GetMapping("/ids")
    public List<DroneIdDTO> getAllDroneIds() { return analyticsService.getDistinctDrones(); }
}
