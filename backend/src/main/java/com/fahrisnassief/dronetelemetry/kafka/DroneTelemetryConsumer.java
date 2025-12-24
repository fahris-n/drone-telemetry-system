package com.fahrisnassief.dronetelemetry.kafka;

import com.fahrisnassief.dronetelemetry.model.DroneTelemetry;
import com.fahrisnassief.dronetelemetry.repository.DroneTelemetryRepository;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DroneTelemetryConsumer {
    private final DroneTelemetryRepository droneTelemetryRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public DroneTelemetryConsumer(DroneTelemetryRepository droneTelemetryRepository, SimpMessagingTemplate messagingTemplate) {
        this.droneTelemetryRepository = droneTelemetryRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @KafkaListener(
            topics = "drone-data",
            groupId = "postgres-reader",
            containerFactory = "postgresListenerContainerFactory"
    )
    public void consume(List<DroneTelemetry> droneTelemetryBatch) {
        // store data
        droneTelemetryRepository.saveAll(droneTelemetryBatch);

        // broadcast to subscribed clients
        messagingTemplate.convertAndSend("/topic/dronetelemetry", droneTelemetryBatch);
    }
}
