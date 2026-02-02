import React, { useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

import './App.css';
import GrafanaEmbed from "./components/GrafanaEmbed.jsx";
import DroneSelector from "./components/DroneSelector.jsx";
import TelemetryPanel from "./components/TelemetryPanel.jsx";

function App() {
    const [connected, setConnected] = useState(false);
    const [telemetry, setTelemetry] = useState([]);
    const [drones, setDrones] = useState([]);
    const [selectedDrone, setSelectedDrone] = useState(null);

    // Check backend connection
    useEffect(() => {
        const client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            onConnect: () => {
                setConnected(true);

                client.subscribe('/topic/dronetelemetry', (message) => {
                    const data = JSON.parse(message.body);
                    console.log('Telemetry received:', data);
                    setTelemetry(data);
                });
            },
            onDisconnect: () => setConnected(false),
            reconnectDelay: 5000,
        });

        client.activate();

        return () => {
            client.deactivate();
        };
    }, []);

    // Fetch drones from SpringBoot API
    useEffect(() => {
        const fetchDrones = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/analytics/ids');
                const data = await response.json();
                setDrones(data);
            } catch (error) {
                console.error('Error fetching drones:', error);
            }
        };

        fetchDrones(); // ✅ CALL IT
    }, []); // ✅ run once on mount


    return (
        <div className="dashboard">
            <Header connected={connected} />
            <div className="main-content">
                {/*<Map drones={telemetry} />*/}
                <GrafanaEmbed />
                <div className="sidebar">
                    <DroneSelector
                        drones={drones}
                        selectedDrone={selectedDrone}
                        onSelect={setSelectedDrone}
                        />
                    <TelemetryPanel drone={selectedDrone} />
                </div>
            </div>
        </div>
    );
}

export default App;