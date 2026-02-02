import React, { useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

import './App.css';
import GrafanaEmbed from "./components/GrafanaEmbed.jsx";
import DroneSelector from "./components/DroneSelector.jsx";
import TelemetryPanel from "./components/TelemetryPanel.jsx";
import DroneMap from "./components/DroneMap.jsx";

function App() {
    const [connected, setConnected] = useState(false);
    const [telemetry, setTelemetry] = useState({});  // Stores live telemetry data by droneId
    const [drones, setDrones] = useState([]);  // List of drones for the selector
    const [selectedDrone, setSelectedDrone] = useState(null);

    // 1. Fetch initial list of drone IDs from the API when component mounts
    useEffect(() => {
        const fetchDrones = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/analytics/ids');
                const data = await response.json();

                // Transform the DTO to match our component format
                const initialDrones = data.map(dto => ({
                    id: dto.droneID,
                    name: `${String(dto.droneID).padStart(3, '0')}`,
                    status: 'WAITING'  // Initial status until WebSocket data arrives
                }));

                setDrones(initialDrones);
            } catch (error) {
                console.error('Error fetching drones:', error);
            }
        };

        fetchDrones();
    }, []);

    // 2. Connect to WebSocket and listen for live telemetry updates
    useEffect(() => {
        const client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            onConnect: () => {
                setConnected(true);

                client.subscribe('/topic/dronetelemetry', (message) => {
                    const data = JSON.parse(message.body);
                    console.log('Telemetry received:', data);

                    // Check if data is an array
                    if (Array.isArray(data)) {
                        // Process each telemetry item in the array
                        data.forEach(telemetryItem => {
                            if (!telemetryItem.droneId) {
                                console.warn('Telemetry item missing droneId:', telemetryItem);
                                return;
                            }

                            // Store telemetry data
                            setTelemetry(prev => ({
                                ...prev,
                                [telemetryItem.droneId]: telemetryItem
                            }));

                            // Update drone status
                            setDrones(prevDrones => {
                                const droneIndex = prevDrones.findIndex(d => d.id === telemetryItem.droneId);

                                if (droneIndex >= 0) {
                                    const updatedDrones = [...prevDrones];
                                    updatedDrones[droneIndex] = {
                                        ...updatedDrones[droneIndex],
                                        status: telemetryItem.status
                                    };
                                    return updatedDrones;
                                }
                            });
                        });
                    } else {
                        // Single telemetry object (old code path)
                        if (!data.droneId) {
                            console.warn('Received telemetry without droneId:', data);
                            return;
                        }

                        setTelemetry(prev => ({
                            ...prev,
                            [data.droneId]: data
                        }));

                        setDrones(prevDrones => {
                            const droneIndex = prevDrones.findIndex(d => d.id === data.droneId);

                            if (droneIndex >= 0) {
                                const updatedDrones = [...prevDrones];
                                updatedDrones[droneIndex] = {
                                    ...updatedDrones[droneIndex],
                                    status: data.status || 'ON MISSION'
                                };
                                return updatedDrones;
                            } else {
                                return [...prevDrones, {
                                    id: data.droneId,
                                    name: data.name || data.droneId,
                                    status: data.status || 'ON MISSION'
                                }];
                            }
                        });
                    }
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

    return (
        <div className="dashboard">
            <Header connected={connected} />
            <div className="dashboard-container">
                <DroneMap drones={Object.values(telemetry)} />
                <GrafanaEmbed />
                <DroneSelector
                    drones={drones}
                    selectedDrone={selectedDrone}
                    onSelect={setSelectedDrone}
                />
                <TelemetryPanel
                    drone={selectedDrone ? telemetry[selectedDrone.id] : null}
                />
            </div>
        </div>
    );
}

export default App;