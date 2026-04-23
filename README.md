#  Drone Telemetry System

A full-stack distributed system that simulates a fleet of reconnaissance drones, ingests high-throughput telemetry via Apache Kafka, processes and persists data through a Java Spring Boot backend with PostgreSQL, and streams live updates to a React dashboard over WebSockets (STOMP/SockJS). Fully containerized with Docker Compose.

## 🍿 Demo

[![Demo Video](https://img.youtube.com/vi/R61GLLwc1SQ/maxresdefault.jpg)](https://youtu.be/R61GLLwc1SQ)
*▶ Click the image above to watch the full demo*


## 📖 Architecture
<p align="center">
  <img src="docs/drone_telemetry_sim.drawio (1).svg" alt="System Diagram" width="1200">
</p>

## ⚙️ Tech Stack

- `Python`
- `Java`
- `Apache Kafka`
- `Spring Boot`
- `PostgreSQL`
- `React`
- `TypeScript`
- `WebSocket (STOMP)`
- `Docker`


## 📊 Performance

- **25,000+** messages/second throughput
- **20 to 30** average latency (ms)
- **5** containerized services


## 🎯 Purpose

- Explore event-driven architecture and real-time data streaming
- Gain hands-on experience with containerization and service orchestration
- Build a full-stack distributed system from simulation to visualization

