function Map({ drones }) {
    return (
        <div classname="map-panel">
            <div classname="panel-header">
                <span>//  OPERATIONAL MAP</span>
                <span>LIVE FEED</span>
            </div>
            <div className="map-container">
                {/* Leaflet map will go here */}
            </div>
        </div>
    );
}

export default Map;