package com.fahrisnassief.dronetelemetry;

import jakarta.persistence.Embeddable;

@Embeddable
public class Location {
    private Double latitude;
    private Double longitude;

    public Location() {}

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }
}
