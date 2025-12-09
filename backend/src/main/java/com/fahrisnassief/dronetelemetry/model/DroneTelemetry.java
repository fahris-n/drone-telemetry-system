package com.fahrisnassief.dronetelemetry.model;

import jakarta.persistence.*;

@Entity
public class DroneTelemetry {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "telemetry_seq")
    @SequenceGenerator(name = "telemetry_seq", sequenceName = "telemetry_seq", allocationSize = 500)
    private Long id;

    @Embedded
    private Location location;

    private String droneId;
    private Double altitude;
    private Double battery;
    private Double speed;
    private String status;
    private String timestamp;

    public DroneTelemetry() {}

    public void setDroneId(String droneId) {
        this.droneId = droneId;
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

    public Long getId() {
        return id;
    }

    public Location getLocation() {
        return location;
    }

    public String getDroneId() {
        return droneId;
    }

    public Double getAltitude() {
        return altitude;
    }

    public Double getBattery() {
        return battery;
    }

    public Double getSpeed() {
        return speed;
    }

    public String getStatus() {
        return status;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}
