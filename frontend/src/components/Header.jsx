import { useState, useEffect } from "react";

function Header({ connected }) {

    const [datetime, setDatetime] = useState("");

    useEffect(() => {
       const updateTime = () => {
           const now = new Date();
           const formatted = now.toISOString()
               .replace('T', ' // ')
               .slice(0, 22)
           + ' UTC';
           setDatetime(formatted)
       };

       updateTime();
       const interval = setInterval(updateTime, 1000);
    })

    return (
        <header className="header">
            <div className="header-left">
                <div className="logo">
                    <div className="logo-icon">◇</div>
                    <div className="logo-text">DRONE<span>TELEMETRY</span></div>
                </div>
                <div className="classification">SIMULATION MODE</div>
            </div>
            <div className="header-right">
                <div className="datetime">{datetime}</div>
                <div className="status-indicator">
                    <div className={`status-dot ${connected ? 'connected' : 'disconnected'}`}></div>
                    <span>{connected ? 'SYSTEM ONLINE' : 'SYSTEM OFFLINE'}</span>
                </div>
            </div>
        </header>
    );
}

export default Header;