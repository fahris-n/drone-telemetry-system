function Header({ connected }) {
    console.log('Header rendering, connected:', connected);
    return (
        <header>
            <h1>Drone Telemetry System</h1>
            <span>{connected ? '🟢 Connected' : '🔴 Disconnected'}</span>
        </header>
    );
}

export default Header;