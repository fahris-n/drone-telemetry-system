function DroneSelector({ drones, selectedDrone, onSelect }) {
    return (
        <div className="drone-selector-panel">
            <div className="panel-header">
                <span>// DRONE SELECTOR</span>
                <span>{drones.length} ACTIVE</span>
            </div>
            <div className="drone-list">
                {/* drone items will go here */}
            </div>
        </div>
    );
}

export default DroneSelector;