package com.fahrisnassief.dronetelemetry.analytics;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AnalyticsServiceTest {

    @Mock
    private AnalyticsRepository analyticsRepository;

    @InjectMocks
    private AnalyticsService analyticsService;

    @Test
    void getDistinctDrones_shouldReturnDroneIdDTOs() {
        when(analyticsRepository.findDistinctDrones()).thenReturn(List.of("drone-1", "drone-2", "drone-3"));
        List<DroneIdDTO> droneIds = analyticsService.getDistinctDrones();
        
        assertEquals("drone-1", droneIds.get(0).droneID());
        assertEquals("drone-2", droneIds.get(1).droneID());
        assertEquals("drone-3", droneIds.get(2).droneID());
    }

    @Test
    void getDistinctDrones_shouldReturnEmptyListWhenNoDrones() {
        when(analyticsRepository.findDistinctDrones()).thenReturn(List.of());
        List<DroneIdDTO> droneIds = analyticsService.getDistinctDrones();
        assertEquals(0, droneIds.size());
    }

    @Test
    void getAverageLatency_shouldReturnValueFromRepository() {
        when(analyticsRepository.getAverageLatencyMs()).thenReturn(22.5);
        Double test_latency = analyticsService.getAverageLatency();
        assertEquals(22.5, test_latency);
    }

    @Test
    void getAverageLatency_shouldReturnNullWhenNoData() {
        when(analyticsRepository.getAverageLatencyMs()).thenReturn(null);
        Double test_latency = analyticsService.getAverageLatency();
        assertEquals(null, test_latency);
    }
}