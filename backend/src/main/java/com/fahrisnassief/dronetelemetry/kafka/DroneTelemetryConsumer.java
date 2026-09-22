package com.fahrisnassief.dronetelemetry.kafka;

import com.fahrisnassief.dronetelemetry.model.DroneTelemetry;
import com.fahrisnassief.dronetelemetry.repository.DroneTelemetryRepository;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Objects;

@Service
public class DroneTelemetryConsumer {
    private final DroneTelemetryRepository droneTelemetryRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private Instant lastBroadcast = Instant.now();

    public DroneTelemetryConsumer(
            DroneTelemetryRepository droneTelemetryRepository,
            SimpMessagingTemplate messagingTemplate) {
        this.droneTelemetryRepository = droneTelemetryRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @KafkaListener(
            topics = "drone-data",
            groupId = "postgres-reader",
            containerFactory = "postgresListenerContainerFactory"
    )

    public void consume(List<DroneTelemetry> droneTelemetryBatch) {
        List<DroneTelemetry> valid = droneTelemetryBatch.stream()
                .filter(Objects::nonNull)
                .toList();

        if (valid.isEmpty()) {
            return;
        }

        droneTelemetryRepository.saveAll(valid);

        if (Duration.between(lastBroadcast, Instant.now()).toMillis() > 100) {
            messagingTemplate.convertAndSend("/topic/dronetelemetry", valid);
            lastBroadcast = Instant.now();
        }
    }

}
