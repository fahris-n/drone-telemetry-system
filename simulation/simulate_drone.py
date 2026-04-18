import json
import time
import random
import orjson
import logging
from kafka import KafkaProducer
from datetime import datetime, timezone
from kafka.errors import NoBrokersAvailable


# Define bootstrap server and topic name for Kafka
BOOTSTRAP_SERVER = "kafka-broker:29092"
TOPIC_NAME = "drone-data"

# Configure logging
logging.basicConfig(
    filename='/app/logs/producer.log',
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s'
)
logging.info("=== MODULE LOADED ===")

class Drone:
    def __init__(self, drone_id, base_lat, base_lon):
        self.id = drone_id
        self.lat = base_lat
        self.lon = base_lon
        self.altitude = random.uniform(40000, 65000)
        self.battery = 100.0
        self.speed = random.uniform(350, 400)
        self.status = "ON MISSION"

    def update_self(self):
        self.lat += random.uniform(-0.0005, 0.0005)
        self.lon += random.uniform(-0.0005, 0.0005)
        self.altitude += random.uniform(-5, 5)
        self.battery = max(0, self.battery - random.uniform(0.000003, 0.0000015))
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

    # Setup retry logic for attempting to connect to Kafka server
    attempt = 0
    producer = None
    maxRetries = 15
    while attempt < maxRetries:
        try:
            producer = KafkaProducer(
                bootstrap_servers = [BOOTSTRAP_SERVER],
                value_serializer = lambda v: orjson.dumps(v),
                batch_size = 32000,
                linger_ms = 5
            )
            break
        except NoBrokersAvailable:
            attempt += 1
            if attempt == maxRetries:
                exit(1)

    # Send messages to topic
    duration_seconds = 60
    end_time = time.time() + duration_seconds
    sent_count = 0
    start_time = time.time()
    cpu_total = 0
    io_total = 0
    
    while time.time() < end_time:
        for drone in fleet:
            cpu_start = time.time()
            drone.update_self()
            telemetry = drone.generate_telemetry()
            cpu_end = time.time() - cpu_start
            cpu_total += cpu_end

            io_start = time.time()
            future = producer.send(TOPIC_NAME, value=telemetry)
            io_end = time.time() - io_start
            io_total += io_end
            sent_count += 1

            if sent_count % 1000 == 0:
                elapsed = time.time() - start_time
                logging.info(f"Sent {sent_count} messages in {elapsed:.2f}s ({sent_count/elapsed:.0f} msgs/sec)")

    logging.info(f"Finished sending {sent_count} messages in {time.time() - start_time:.2f}s -- IO_TOTAL {io_total:.2f}s -- CPU_TOTAL {cpu_total:.2f}s")

    # Close the producer
    producer.flush()

if __name__ == "__main__":
    main()