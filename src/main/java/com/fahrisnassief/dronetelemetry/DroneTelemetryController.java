package com.fahrisnassief.dronetelemetry;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/ids")
    public List<DroneIdDTO> getAllDroneIds() {
        return droneTelemetryService.getDistinctDrones();
    }

}