package com.fahrisnassief.dronetelemetry;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/drone-telemetry")
public class DroneTelemetryController {

    @PostMapping
    public ResponseEntity<Void> receiveTelemetry(@RequestBody DroneTelemetry droneTelemetry) {
       return ResponseEntity.status(HttpStatus.CREATED).build();
    }

}