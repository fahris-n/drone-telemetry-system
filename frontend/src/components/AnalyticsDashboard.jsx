import React, { useMemo } from 'react';

function AnalyticsDashboard({ telemetry, selectedDrone }) {
    const stats = useMemo(() => {
        // If a drone is selected, show that drone's data
        if (selectedDrone && telemetry[selectedDrone.id]) {
            const t = telemetry[selectedDrone.id];
            return {
                altitude: Math.round(t.altitude || 0),
                speed: Math.round(t.speed || 0),
                battery: parseFloat((t.batteryLevel || t.battery || 0).toFixed(2)),
                label: selectedDrone.name || selectedDrone.id,
            };
        }

        // No drone selected — show fleet averages
        const entries = Object.values(telemetry || {});
        if (entries.length === 0) {
            return { altitude: 0, speed: 0, battery: 0, label: null };
        }

        const sum = entries.reduce(
            (acc, t) => ({
                altitude: acc.altitude + (t.altitude || 0),
                speed: acc.speed + (t.speed || 0),
                battery: acc.battery + (t.batteryLevel || t.battery || 0),
            }),
            { altitude: 0, speed: 0, battery: 0 }
        );

        return {
            altitude: Math.round(sum.altitude / entries.length),
            speed: Math.round(sum.speed / entries.length),
            battery: Math.round(sum.battery / entries.length),
            label: null,
        };
    }, [telemetry, selectedDrone]);

    const headerLabel = stats.label
        ? `// DRONE ${stats.label}`
        : '// ANALYTICS DASHBOARD';

    return (
        <div className="grafana-panel">
            <div className="panel-header">
                <span>{headerLabel}</span>
                <span>LIVE</span>
            </div>
            <div className="grafana-container">
                <div className="metric-card">
                    <span className="metric-label">
                        {stats.label ? 'ALTITUDE (m)' : 'AVG ALTITUDE (m)'}
                    </span>
                    <span className="metric-value">{stats.altitude.toLocaleString()}</span>
                    <div
                        className="metric-bar"
                        style={{ width: `${Math.min((stats.altitude / 10000) * 100, 100)}%` }}
                    />
                </div>
                <div className="metric-card">
                    <span className="metric-label">
                        {stats.label ? 'SPEED (km/h)' : 'AVG SPEED (km/h)'}
                    </span>
                    <span className="metric-value">{stats.speed.toLocaleString()}</span>
                    <div
                        className="metric-bar"
                        style={{ width: `${Math.min((stats.speed / 500) * 100, 100)}%` }}
                    />
                </div>
                <div className="metric-card">
                    <span className="metric-label">
                        {stats.label ? 'BATTERY (%)' : 'AVG BATTERY (%)'}
                    </span>
                    <span className="metric-value">{stats.battery}</span>
                    <div
                        className="metric-bar"
                        style={{
                            width: `${stats.battery}%`,
                            background: stats.battery < 30
                                ? 'linear-gradient(90deg, var(--accent-orange), transparent)'
                                : 'linear-gradient(90deg, var(--accent-green), transparent)',
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default AnalyticsDashboard;