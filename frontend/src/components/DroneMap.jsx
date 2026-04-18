import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom SVG drone icon matching the military/cyberpunk aesthetic
function createDroneIcon(isSelected) {
    const color = isSelected ? '#00ff66' : '#00ff66';
    const glowOpacity = isSelected ? '0.6' : '0.2';
    const size = isSelected ? 40 : 32;

    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="${size}" height="${size}">
            <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="blur"/>
                <feMerge>
                    <feMergeNode in="blur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
            <!-- Outer diamond -->
            <polygon
                points="20,2 38,20 20,38 2,20"
                fill="none"
                stroke="${color}"
                stroke-width="${isSelected ? 2 : 1.5}"
                opacity="${isSelected ? 1 : 0.7}"
                filter="url(#glow)"
            />
            <!-- Inner diamond -->
            <polygon
                points="20,10 30,20 20,30 10,20"
                fill="rgba(0, 255, 102, ${glowOpacity})"
                stroke="${color}"
                stroke-width="1"
            />
            <!-- Center triangle (drone indicator) -->
            <polygon
                points="20,14 25,22 15,22"
                fill="${color}"
                opacity="0.9"
            />
        </svg>
    `;

    return L.divIcon({
        html: svg,
        className: 'drone-map-icon',
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        popupAnchor: [0, -size / 2],
    });
}

// Component to fit map bounds to all drones
function FitBounds({ drones }) {
    const map = useMap();
    const hasFitted = useRef(false);

    useEffect(() => {
        if (drones.length > 0 && !hasFitted.current) {
            const bounds = drones
                .filter(d => d.location?.latitude && d.location?.longitude)
                .map(d => [d.location.latitude, d.location.longitude]);

            if (bounds.length > 0) {
                map.fitBounds(bounds, { padding: [50, 50], maxZoom: 6 });
                hasFitted.current = true;
            }
        }
    }, [drones, map]);

    return null;
}

function DroneMap({ drones, selectedDrone, onSelect }) {
    const defaultCenter = [30, 40];
    const defaultZoom = 3;

    // Filter drones that have valid coordinates
    const mappableDrones = drones.filter(
        d => d.location?.latitude && d.location?.longitude
    );

    return (
        <div className="map-panel">
            <div className="panel-header">
                <span>// OPERATIONAL MAP</span>
                <span>LIVE FEED</span>
            </div>
            <div className="map-container">
                <MapContainer
                    center={defaultCenter}
                    zoom={defaultZoom}
                    style={{ width: '100%', height: '100%', background: '#0a0f0a' }}
                    zoomControl={false}
                    attributionControl={false}
                >
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
                        opacity={0.6}
                    />
                    <FitBounds drones={mappableDrones} />
                    {mappableDrones.map(drone => {
                        const isSelected = selectedDrone?.id === drone.droneId;
                        return (
                            <Marker
                                key={drone.droneId}
                                position={[drone.location.latitude, drone.location.longitude]}
                                icon={createDroneIcon(isSelected)}
                                eventHandlers={{
                                    click: () => {
                                        if (onSelect) {
                                            onSelect({
                                                id: drone.droneId,
                                                name: drone.droneId,
                                                status: drone.status,
                                            });
                                        }
                                    },
                                }}
                            >
                                <Popup className="drone-popup">
                                    <div style={{
                                        fontFamily: "'Share Tech Mono', monospace",
                                        color: '#00ff66',
                                        background: '#0a0f0a',
                                        padding: '8px 12px',
                                        border: '1px solid rgba(0, 255, 102, 0.3)',
                                        fontSize: '0.75rem',
                                        letterSpacing: '1px',
                                    }}>
                                        <div style={{ marginBottom: '4px', fontWeight: 'bold' }}>
                                            {drone.droneId}
                                        </div>
                                        <div>STATUS: {drone.status}</div>
                                        <div>ALT: {Math.round(drone.altitude || 0)}m</div>
                                        <div>SPD: {Math.round(drone.speed || 0)} km/h</div>
                                        <div>BAT: {(drone.batteryLevel || drone.battery || 0).toFixed(1)}%</div>
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}
                </MapContainer>
            </div>
        </div>
    );
}

export default DroneMap;