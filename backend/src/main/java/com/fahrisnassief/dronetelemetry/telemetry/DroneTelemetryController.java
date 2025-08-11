package com.fahrisnassief.dronetelemetry.telemetry;

import com.fahrisnassief.dronetelemetry.model.DroneTelemetry;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("api/drone-telemetry")
public class DroneTelemetryController {

    private final DroneTelemetryService droneTelemetryService;
    private final DroneTelemetryRepository droneTelemetryRepository;

    public DroneTelemetryController(DroneTelemetryService droneTelemetryService, DroneTelemetryRepository droneTelemetryRepository) {
        this.droneTelemetryService = droneTelemetryService;
        this.droneTelemetryRepository = droneTelemetryRepository;
    }

    @PostMapping
    public ResponseEntity<Void> receiveTelemetry(@RequestBody DroneTelemetry droneTelemetry) {
        droneTelemetryRepository.save(droneTelemetry);
        return ResponseEntity.ok().build();
    }
}