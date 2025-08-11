import time
import random
import requests
from datetime import datetime, timezone


class Drone:
    def __init__(self, drone_id, base_lat, base_lon):
        self.id = drone_id
        self.lat = base_lat
        self.lon = base_lon
        self.altitude = random.uniform(50000, 65000)
        self.battery = 100.0
        self.speed = random.uniform(350, 400)
        self.status = "ON MISSION"

    def update_self(self):
        self.lat += random.uniform(-0.0005, 0.0005)
        self.lon += random.uniform(-0.0005, 0.0005)
        self.altitude += random.uniform(-5, 5)
        self.battery -= random.uniform(0.03, 0.015)
        self.speed += random.uniform(-0.05, 0.05)

    def generate_telemetry(self):
        data = {
            "droneId": self.id,
            "altitude": round(self.altitude, 2),
            "speed": round(self.speed, 2),
            "battery": round(self.battery, 2),
            "location": {
                "latitude": round(self.lat, 4),
                "longitude": round(self.lon, 4),
            },
            "status": self.status,
            "timestamp": datetime.now(timezone.utc).isoformat() + "Z"
        }
        return data

def main():

    fleet = [
        Drone("RECON-GAZA-2025-003", 31.5017, 34.4668),     # Gaza, Palestine
        Drone("RECON-SCS-2025-007", 15.4881, 114.4048),     # South China Sea
        Drone("RECON-UKR-2025-012", 49.9859, 36.2735),      # Kharkiv, Ukraine
        Drone("RECON-SK-2025-009", 37.568295, 126.997785),  # Pannumjon, South Korea
        Drone("RECON-NP-2025-004", 68.67167, 2.000819),      # Norwegian Sea
    ]

    while True:
        for drone in fleet:
            drone.update_self()
            telemetry = drone.generate_telemetry()
            requests.post("http://localhost:8080/api/drone-telemetry", json=telemetry)
            print("Running...")
        time.sleep(1)


if __name__ == "__main__":
    main()
