import React, { useEffect, useState, useRef } from 'react';
import Header from './components/Header.jsx';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

import './App.css';
import AnalyticsDashboard from "./components/AnalyticsDashboard.jsx";
import DroneSelector from "./components/DroneSelector.jsx";
import TelemetryPanel from "./components/TelemetryPanel.jsx";
import DroneMap from "./components/DroneMap.jsx";

const normalizeId = (id) => String(id);

function App() {
    const [connected, setConnected] = useState(false);
    const [backendReady, setBackendReady] = useState(false);
    const [telemetry, setTelemetry] = useState({});
    const [drones, setDrones] = useState([]);
    const [selectedDrone, setSelectedDrone] = useState(null);
    const clientRef = useRef(null);

    // 1. Poll for backend readiness, then fetch drones + connect WebSocket
    useEffect(() => {
        let cancelled = false;
        const waitForBackend = async () => {
            console.log('Waiting for backend...');
            while (!cancelled) {
                try {
                    const res = await fetch('http://localhost:8080/api/analytics/ids');
                    if (res.ok) {
                        const data = await res.json();
    
                        if (data.length === 0) {
                            console.log('Backend is up but no drones yet, retrying in 2s...');
                            await new Promise(r => setTimeout(r, 2000));
                            continue;
                        }
    
                        console.log('Backend is ready, fetched drone IDs:', data);
                        const initialDrones = data.map(dto => ({
                            id: normalizeId(dto.droneID),
                            name: dto.droneID,
                            status: 'WAITING',
                        }));
    
                        if (!cancelled) {
                            setDrones(initialDrones);
                            setBackendReady(true);
                        }
                        return;
                    }
                } catch (e) {
                    console.log('Backend not ready yet, retrying in 2s...');
                }
                await new Promise(r => setTimeout(r, 2000));
            }
        };
        waitForBackend();
        return () => {
            cancelled = true;
        };
    }, []);

    // 2. Once backend is ready, connect WebSocket
    useEffect(() => {
        if (!backendReady) return;

        const client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            onConnect: () => {
                console.log('WebSocket connected');
                setConnected(true);

                client.subscribe('/topic/dronetelemetry', (message) => {
                    const data = JSON.parse(message.body);

                    if (Array.isArray(data)) {
                        data.forEach(telemetryItem => {
                            if (!telemetryItem.droneId) {
                                console.warn('Telemetry item missing droneId:', telemetryItem);
                                return;
                            }

                            setTelemetry(prev => ({
                                ...prev,
                                [telemetryItem.droneId]: telemetryItem,
                            }));

                            setDrones(prevDrones => {
                                const droneIndex = prevDrones.findIndex(d => d.id === telemetryItem.droneId);

                                if (droneIndex >= 0) {
                                    const updatedDrones = [...prevDrones];
                                    updatedDrones[droneIndex] = {
                                        ...updatedDrones[droneIndex],
                                        status: telemetryItem.status,
                                    };
                                    return updatedDrones;
                                }
                                return prevDrones;
                            });
                        });
                    } else {
                        if (!data.droneId) {
                            console.warn('Received telemetry without droneId:', data);
                            return;
                        }

                        setTelemetry(prev => ({
                            ...prev,
                            [data.droneId]: data,
                        }));

                        setDrones(prevDrones => {
                            const droneIndex = prevDrones.findIndex(d => d.id === data.droneId);

                            if (droneIndex >= 0) {
                                const updatedDrones = [...prevDrones];
                                updatedDrones[droneIndex] = {
                                    ...updatedDrones[droneIndex],
                                    status: data.status || 'ON MISSION',
                                };
                                return updatedDrones;
                            } else {
                                return [...prevDrones, {
                                    id: data.droneId,
                                    name: data.name || data.droneId,
                                    status: data.status || 'ON MISSION',
                                }];
                            }
                        });
                    }
                });
            },
            onDisconnect: () => {
                console.log('WebSocket disconnected');
                setConnected(false);
            },
            onStompError: (frame) => {
                console.error('STOMP error:', frame.headers['message']);
            },
            onWebSocketError: (event) => {
                console.error('WebSocket error:', event);
            },
            reconnectDelay: 3000,
        });

        clientRef.current = client;
        client.activate();

        return () => {
            client.deactivate();
        };
    }, [backendReady]);

    return (
        <div className="dashboard">
            <Header connected={connected} />
            <div className="dashboard-container">
                <DroneMap
                drones={Object.values(telemetry)}
                selectedDrone={selectedDrone}
                onSelect={setSelectedDrone}
                />
                <AnalyticsDashboard
                    telemetry={telemetry}
                    selectedDrone={selectedDrone}
                />
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