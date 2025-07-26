package com.fahrisnassief.dronetelemetry;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DroneTelemetryService {

    private final DroneTelemetryRepository droneTelemetryRepository;

    public DroneTelemetryService(DroneTelemetryRepository droneTelemetryRepository) {
        this.droneTelemetryRepository = droneTelemetryRepository;
    }

    public List<DroneIdDTO> getDistinctDrones() {
        List<String> droneIds = droneTelemetryRepository.findDistinctDrones();

        return droneIds
                .stream()
                .map(id -> new DroneIdDTO(id))
                .collect(Collectors.toList());
    }
}