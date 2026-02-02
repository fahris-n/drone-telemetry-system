function DroneSelector({ drones = [], selectedDrone, onSelect }) {
    return (
        <div className="drone-selector-panel">
            <div className="panel-header">
                <span>// DRONE SELECTOR</span>
                <span>{drones.length} ACTIVE</span>
            </div>
            <div className="drone-list">
                {drones.length === 0 ? (
                    <div style={{
                        padding: '20px',
                        textAlign: 'center',
                        color: 'var(--text-dim)',
                        fontFamily: 'Share Tech Mono, monospace',
                        fontSize: '0.85rem'
                    }}>
                        NO ACTIVE DRONES
                    </div>
                ) : (
                    drones.map((drone) => (
                        <div
                            key={drone.id}
                            className={`drone-item ${selectedDrone?.id === drone.id ? 'selected' : ''}`}
                            onClick={() => onSelect(drone)}
                        >
                            <span className="drone-name">{drone.name || drone.id || 'Unknown'}</span>
                            <span className={`drone-status ${drone.status ? drone.status.toLowerCase().replace(/ /g, '-') : 'waiting'}`}>
                                {drone.status || 'WAITING'}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default DroneSelector;