import os
import time
import random
import logging
import threading
from http.server import HTTPServer, BaseHTTPRequestHandler
from datetime import datetime, timezone
import orjson
from kafka import KafkaProducer
from kafka.errors import NoBrokersAvailable

# ---------------------------------------------------------
# 1. Background Health Check Server for Cloud Run
# ---------------------------------------------------------
class HealthCheckHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-type", "text/plain")
        self.end_headers()
        self.wfile.write(b"OK")

    def log_message(self, format, *args):
        # Mute HTTP access logs to keep terminal logs clean
        return

def start_health_server():
    port = int(os.environ.get("PORT", 8080))
    server = HTTPServer(('0.0.0.0', port), HealthCheckHandler)
    server.serve_forever()

# Launch the HTTP health server on a daemon thread
threading.Thread(target=start_health_server, daemon=True).start()

# ---------------------------------------------------------
# 2. Logging Setup
# ---------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s'
)
logging.info("=== TELEMETRY PRODUCER INITIALIZED ===")


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
        self.battery = max(0.0, self.battery - random.uniform(0.000003, 0.0000015))
        self.speed += random.uniform(-0.05, 0.05)

    def generate_telemetry(self):
        return {
            "droneId": self.id,
            "altitude": round(self.altitude, 2),
            "speed": round(self.speed, 2),
            "battery": round(self.battery, 2),
            "location": {
                "latitude": round(self.lat, 4),
                "longitude": round(self.lon, 4),
            },
            "status": self.status,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }


def main():
    BOOTSTRAP_SERVER = os.environ.get("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")
    # Supports both KAFKA_TOPIC and TOPIC_NAME flags
    TOPIC_NAME = os.environ.get("KAFKA_TOPIC", os.environ.get("TOPIC_NAME", "drone-data"))
    TARGET_MPS = float(os.environ.get("TARGET_MPS", "5"))
    DURATION_SECONDS = int(os.environ.get("DURATION_SECONDS", "0"))  # 0 = Run continuously

    logging.info(f"Targeting Kafka Broker: {BOOTSTRAP_SERVER} | Topic: {TOPIC_NAME}")

    attempt = 0
    producer = None
    max_retries = 15

    while attempt < max_retries:
        try:
            producer = KafkaProducer(
                bootstrap_servers=[BOOTSTRAP_SERVER],
                value_serializer=lambda v: orjson.dumps(v),
                batch_size=32000,
                linger_ms=5
            )
            logging.info("Connected to Kafka producer successfully.")
            break
        except NoBrokersAvailable:
            attempt += 1
            logging.warning(f"Kafka unavailable at {BOOTSTRAP_SERVER}. Retrying ({attempt}/{max_retries})...")
            time.sleep(2)
            if attempt == max_retries:
                logging.error("Exhausted retries connecting to Kafka. Exiting.")
                exit(1)

    fleet = [
        Drone("RECON-GAZA-2025-003", 31.5017, 34.4668),
        Drone("RECON-SCS-2025-007", 15.4881, 114.4048),
        Drone("RECON-UKR-2025-012", 49.9859, 36.2735),
        Drone("RECON-SK-2025-009", 37.568295, 126.997785),
        Drone("RECON-NP-2025-004", 68.67167, 2.000819),
    ]

    start_time = time.time()
    end_time = (start_time + DURATION_SECONDS) if DURATION_SECONDS > 0 else float("inf")
    frame_delay = (1.0 / TARGET_MPS) if TARGET_MPS > 0 else 0.0
    sent_count = 0

    try:
        while time.time() < end_time:
            for drone in fleet:
                drone.update_self()
                telemetry = drone.generate_telemetry()

                producer.send(TOPIC_NAME, value=telemetry)
                sent_count += 1

                if sent_count % 500 == 0:
                    elapsed = time.time() - start_time
                    logging.info(f"Sent {sent_count} messages in {elapsed:.2f}s ({sent_count / elapsed:.0f} msgs/sec)")

                if frame_delay > 0:
                    time.sleep(frame_delay)

    except KeyboardInterrupt:
        logging.info("Simulation interrupted by user.")
    finally:
        total_elapsed = time.time() - start_time
        if producer:
            producer.flush()
        logging.info(f"Finished sending {sent_count} messages in {total_elapsed:.2f}s")


if __name__ == "__main__":
    main()