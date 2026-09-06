# 🛸 Drone Telemetry System

A high-performance, full-stack distributed telemetry ingestion pipeline designed to process real-time streaming data from simulated drone fleets. 

Built with an event-driven architecture using **Apache Kafka** and **Java Spring Boot**, the system ingests high-frequency telemetry, persists historical records to **PostgreSQL**, and streams live vehicle updates to a **React dashboard** over WebSockets (STOMP/SockJS). Fully containerized and deployable via **Docker Compose** or directly to **Google Cloud Platform (GCP)**.

---

## 🍿 Demo

[![Demo Video](https://img.youtube.com/vi/R61GLLwc1SQ/maxresdefault.jpg)](https://youtu.be/R61GLLwc1SQ)  
*▶ Click the image above to watch the project demonstration*

---

## 🏗️ Architecture

<p align="center">
  <img src="docs/drone_telemetry_sim.drawio (1).svg" alt="System Diagram" width="1200">
</p>

### System Workflow
1. **Simulation Layer:** Python worker threads simulate real-time telemetry events (coordinates, speed, altitude, battery status).
2. **Streaming & Message Broker:** Multi-threaded producers push events to Apache Kafka over optimized topics (`drone-data`).
3. **Ingestion & Processing:** Spring Boot backend consumes batch streams via multi-threaded Kafka listeners with custom error handling and retry policies.
4. **Persistence Layer:** PostgreSQL / Cloud SQL stores historical telemetry logs with indexed primary keys for efficient queries.
5. **Real-time Visualization:** Spring WebSocket broker broadcasts low-latency updates directly to the React/TypeScript frontend.

---

## 📊 Performance Metrics

| Metric | Benchmark |
| :--- | :--- |
| **Ingestion Throughput** | **25,000+** messages/second |
| **End-to-End Latency** | **20ms - 30ms** average |
| **Containerized Services** | **5** microservices |
| **Deployment Environments** | Docker Compose / Google Cloud Platform |

---

## ☁️ Cloud Infrastructure (GCP)

In addition to local Docker Compose orchestration, the entire pipeline is architected for production deployment on **Google Cloud Platform**:

* **Serverless Compute:** Backend ingestion APIs and simulation workers deployed via **GCP Cloud Run**.
* **Distributed Messaging:** **Apache Kafka** broker hosted on a Compute Engine (GCE) VM within a private VPC network.
* **Managed Database:** Persistence powered by **GCP Cloud SQL (PostgreSQL)**.
* **Container Registry:** Image management and versioning via **GCP Artifact Registry**.

---

## ⚙️ Tech Stack

* **Languages:** Java 17, Python 3, TypeScript, SQL
* **Backend Frameworks:** Spring Boot, Spring Data JPA, Spring WebSocket
* **Messaging & Streaming:** Apache Kafka, STOMP / SockJS
* **Frontend:** React, TypeScript
* **Database:** PostgreSQL / Cloud SQL
* **DevOps & Cloud:** Docker, Docker Compose, Google Cloud Platform (Cloud Run, GCE, Cloud SQL, Artifact Registry)

---

## 🎯 Key Engineering Highlights

* **High-Throughput Optimization:** Tuned producer batching, parallel stream consumer containers, and Spring Data batch database inserts to scale throughput from 2,700 to 25,000+ msgs/sec while holding processing latency under 25ms.
* **Fault-Tolerant Consumer Pipeline:** Implemented custom Spring Kafka container factories with `DefaultErrorHandler` and backoff retry logic to handle initial broker synchronization and topic creation gracefully.
* **Real-time Telemetry Dashboard:** Integrated full-duplex WebSocket connections to deliver instant spatial state visualizations without client polling overhead.
