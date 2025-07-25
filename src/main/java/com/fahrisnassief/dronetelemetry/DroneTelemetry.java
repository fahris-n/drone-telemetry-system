package com.fahrisnassief.dronetelemetry;

import java.time.Instant;

public class DroneTelemetry {
    private String id;
    private Location location;
    private Double altitude;
    private Double battery;
    private Double speed;
    private String status;
    private Instant timestamp;

    public DroneTelemetry() {}

    public void setId(String id) {
        this.id = id;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public void setAltitude(Double altitude) {
        this.altitude = altitude;
    }

    public void setBattery(Double battery) {
        this.battery = battery;
    }

    public void setSpeed(Double speed) {
        this.speed = speed;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }
}
