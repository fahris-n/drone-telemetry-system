package com.fahrisnassief.dronetelemetry.telemetry;

import org.springframework.stereotype.Service;

@Service
public class DroneTelemetryService {

    private final DroneTelemetryRepository droneTelemetryRepository;

    public DroneTelemetryService(DroneTelemetryRepository droneTelemetryRepository) {
        this.droneTelemetryRepository = droneTelemetryRepository;
    }
}