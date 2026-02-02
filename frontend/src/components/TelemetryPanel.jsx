function TelemetryPanel({ drone }) {
    return (
        <div className="telemetry-panel">
            <div className="panel-header">
                <span>//  TELEMETRY</span>
                <span>LIVE</span>
            </div>
            <div className="telemetry-content">
                {/* telemetry data will go here */}
            </div>
        </div>
    );
}

export default TelemetryPanel;