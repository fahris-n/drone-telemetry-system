import React from 'react';

function TelemetryPanel({ drone }) {
    const altitude = drone ? Math.round(drone.altitude || 0) : '---';
    const speed = drone ? Math.round(drone.speed || 0) : '---';
    const battery = drone ? parseFloat((drone.batteryLevel || drone.battery || 0).toFixed(2)) : '---';
    const status = drone ? (drone.status || 'UNKNOWN') : '---';
    const lat = drone?.location?.latitude != null
        ? `${Math.abs(drone.location.latitude).toFixed(4)}°${drone.location.latitude >= 0 ? 'N' : 'S'}`
        : '---';
    const lng = drone?.location?.longitude != null
        ? `${Math.abs(drone.location.longitude).toFixed(4)}°${drone.location.longitude >= 0 ? 'E' : 'W'}`
        : '---';

    const droneLabel = drone ? drone.droneId || drone.id : 'NONE';

    // Battery color logic
    const batteryColor = drone
        ? battery < 15
            ? 'var(--accent-orange)'
            : battery < 30
                ? 'var(--accent-yellow)'
                : 'var(--accent-green)'
        : 'var(--text-dim)';

    // Status color logic
    const statusColor = drone
        ? status === 'LOW BATTERY'
            ? 'var(--accent-orange)'
            : status === 'RETURNING'
                ? 'var(--accent-yellow)'
                : 'var(--accent-green)'
        : 'var(--text-dim)';

    return (
        <div className="telemetry-panel">
            <div className="panel-header">
                <span>// TELEMETRY // {droneLabel}</span>
                <span>LIVE</span>
            </div>

            <div className="telemetry-grid">
                <div className="telemetry-item">
                    <div className="telemetry-label">ALTITUDE</div>
                    <div className="telemetry-value">
                        {typeof altitude === 'number' ? altitude.toLocaleString() : altitude}
                        <span className="telemetry-unit">m</span>
                    </div>
                </div>

                <div className="telemetry-item">
                    <div className="telemetry-label">SPEED</div>
                    <div className="telemetry-value">
                        {typeof speed === 'number' ? speed.toLocaleString() : speed}
                        <span className="telemetry-unit">km/h</span>
                    </div>
                </div>

                <div className="telemetry-item">
                    <div className="telemetry-label">BATTERY</div>
                    <div className="telemetry-value" style={{ color: batteryColor }}>
                        {battery}
                        <span className="telemetry-unit">%</span>
                    </div>
                </div>

                <div className="telemetry-item">
                    <div className="telemetry-label">STATUS</div>
                    <div className="telemetry-value" style={{ color: statusColor }}>
                        {status}
                    </div>
                </div>

                <div className="telemetry-item full-width">
                    <div className="telemetry-label">COORDINATES</div>
                    <div className="telemetry-value coordinates">
                        <span style={{ marginRight: '16px' }}>
                            <span className="telemetry-label" style={{ marginRight: '6px', fontSize: '0.6rem' }}>LAT</span>
                            {lat}
                        </span>
                        <span>
                            <span className="telemetry-label" style={{ marginRight: '6px', fontSize: '0.6rem' }}>LNG</span>
                            {lng}
                        </span>
                    </div>
                </div>
            </div>

            <div className="system-status">
                <div className="system-status-item">
                    <span>UPLINK:</span>
                    <span>{drone ? 'STABLE' : '---'}</span>
                </div>
                <div className="system-status-item">
                    <span>SIGNAL:</span>
                    <span>{drone ? '94%' : '---'}</span>
                </div>
                <div className="system-status-item">
                    <span>LAG:</span>
                    <span>{drone ? '11ms' : '---'}</span>
                </div>
            </div>
        </div>
    );
}

export default TelemetryPanel;