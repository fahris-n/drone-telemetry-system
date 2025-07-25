package com.fahrisnassief.dronetelemetry;

public class Location {
    private Double lat;
    private Double lon;

    public Location() {}

    public Double getLon() {
        return lon;
    }

    public void setLon(Double lon) {
        this.lon = lon;
    }

    public Double getLat() {
        return lat;
    }

    public void setLat(Double lat) {
        this.lat = lat;
    }
}
