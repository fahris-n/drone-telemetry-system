package com.fahrisnassief.dronetelemetry.model;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class DroneTelemetryTest {

    @Test
    void shouldSetAndGetAllFields() {
        // setting
        DroneTelemetry testDrone = new DroneTelemetry();
        testDrone.setDroneId("test-drone");
        testDrone.setAltitude(40000.00);
        testDrone.setBattery(100.00);
        testDrone.setSpeed(60.00);
        testDrone.setStatus("TEST STATUS");
        testDrone.setTimestamp("01/21/22:1200");

        Location location = new Location();
        location.setLatitude(60.00);
        location.setLongitude(60.00);
        testDrone.setLocation(location);

        // asserting
        assertEquals("test-drone", testDrone.getDroneId());
        assertEquals(40000.00, testDrone.getAltitude());
        assertEquals(100.00, testDrone.getBattery());
        assertEquals(60.00, testDrone.getSpeed());
        assertEquals("TEST STATUS", testDrone.getStatus());
        assertEquals("01/21/22:1200", testDrone.getTimestamp());
        assertEquals(location, testDrone.getLocation());
    }

    @Test
    void shouldEmbedLocationCorrectly() {
        DroneTelemetry testDrone = new DroneTelemetry();
        Location location = new Location();
        location.setLatitude(38.83);
        location.setLongitude(-104.82);
        testDrone.setLocation(location);

        assertEquals(38.83, testDrone.getLocation().getLatitude());
        assertEquals(-104.82, testDrone.getLocation().getLongitude());
    }
}