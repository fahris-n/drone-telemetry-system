package com.fahrisnassief.dronetelemetry.kafka;

import com.fahrisnassief.dronetelemetry.model.DroneTelemetry;
import com.fahrisnassief.dronetelemetry.repository.DroneTelemetryRepository;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DroneTelemetryConsumer {
    private final DroneTelemetryRepository droneTelemetryRepository;

    public DroneTelemetryConsumer(DroneTelemetryRepository droneTelemetryRepository) {
        this.droneTelemetryRepository = droneTelemetryRepository;
    }

    @KafkaListener(
            topics = "drone-data",
            groupId = "postgres-reader",
            containerFactory = "postgresListenerContainerFactory"
    )
    public void consume(List<DroneTelemetry> droneTelemetryBatch) {
        droneTelemetryRepository.saveAll(droneTelemetryBatch);
    }
}
