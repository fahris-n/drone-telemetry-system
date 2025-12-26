import React, { useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

import './App.css';

function App() {
    const [connected, setConnected] = useState(false);
    const [telemetry, setTelemetry] = useState([]);

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

    return (
        <div>
            <Header connected={connected} />
            {/* other components */}
        </div>
    );
}

export default App;