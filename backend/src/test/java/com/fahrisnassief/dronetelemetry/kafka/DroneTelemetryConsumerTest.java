package com.fahrisnassief.dronetelemetry.kafka;

import com.fahrisnassief.dronetelemetry.model.DroneTelemetry;
import com.fahrisnassief.dronetelemetry.model.Location;
import com.fahrisnassief.dronetelemetry.repository.DroneTelemetryRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.List;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DroneTelemetryConsumerTest {

    @Mock
    private DroneTelemetryRepository droneTelemetryRepository;

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @InjectMocks
    private DroneTelemetryConsumer consumer;

    @Test
    void consume_shouldSaveBatchToRepository() {
        DroneTelemetry t1 = new DroneTelemetry();
        DroneTelemetry t2 = new DroneTelemetry();
        List<DroneTelemetry> batch = List.of(t1, t2);

        consumer.consume(batch);

        // verify saveAll was called with the batch
        verify(droneTelemetryRepository).saveAll(batch);
    }
}