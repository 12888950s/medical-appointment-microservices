# Installation and Execution Guide

## 1. Prerequisites

Before running the project, install:

- Node.js
- Git
- Java 17 or later
- Kafka 4.2
- Visual Studio Code
- Postman
- A web browser

---

## 2. Clone the Project

```bash
git clone https://github.com/12888950s/medical-appointment-microservices.git
cd medical-appointment-microservices
```

---

## 3. Install Dependencies

Each service has its own `package.json`.

### Patient Service

```bash
cd patient-service
npm install
```

### Doctor Service

```bash
cd ../doctor-service
npm install
```

### Appointment Service

```bash
cd ../appointment-service
npm install
```

### API Gateway

```bash
cd ../api-gateway
npm install
```

### Notification Service

```bash
cd ../notification-service
npm install
```

---

## 4. Start Kafka

Go to Kafka directory.

With Git Bash:

```bash
cd /c/kafka_2.13-4.2.0
```

Start Kafka:

```bash
./bin/kafka-server-start.sh config/server.properties
```

Keep this terminal open.

---

## 5. Create Kafka Topics

Open a second Git Bash terminal and run:

```bash
cd /c/kafka_2.13-4.2.0
```

Create the appointment_created topic:

```bash
./bin/kafka-topics.sh --create --partitions 3 --replication-factor 1 --topic appointment_created --bootstrap-server localhost:9092
```

Create the appointment_cancelled topic:

```bash
./bin/kafka-topics.sh --create --partitions 3 --replication-factor 1 --topic appointment_cancelled --bootstrap-server localhost:9092
```

List topics:

```bash
./bin/kafka-topics.sh --list --bootstrap-server localhost:9092
```

Expected topics:

```text
appointment_created
appointment_cancelled
```

---

## 6. Run the Services

Each service must be started in a separate terminal.

### Terminal 1: Patient Service

```bash
cd patient-service
npm start
```

Expected output:

```text
Connected to patients SQLite database.
Patient Service running on port 50051
```

---

### Terminal 2: Doctor Service

```bash
cd doctor-service
npm start
```

Expected output:

```text
Connected to doctors SQLite database.
Doctor Service running on port 50052
```

---

### Terminal 3: Appointment Service

```bash
cd appointment-service
npm start
```

Expected output:

```text
Connected to appointments SQLite database.
Appointment Service running on port 50053
```

---

### Terminal 4: API Gateway

```bash
cd api-gateway
npm start
```

Expected output:

```text
API Gateway running on port 3000
GraphQL endpoint ready at http://localhost:3000/graphql
```

---

### Terminal 5: Notification Service

```bash
cd notification-service
npm start
```

Expected output:

```text
Notification Service is listening to Kafka events...
```

---

## 7. Run the Web Client

Open the file:

```text
web-client/index.html
```

or use Live Server in Visual Studio Code.

The Web Client communicates with the API Gateway using REST.

---

## 8. Test REST API

Use Postman.

Examples:

```http
GET http://localhost:3000/api/patients
```

```http
GET http://localhost:3000/api/doctors
```

```http
GET http://localhost:3000/api/appointments
```

Create appointment:

```http
POST http://localhost:3000/api/appointments
```

Body:

```json
{
  "patient_id": 1,
  "doctor_id": 1,
  "date": "2026-05-28",
  "time": "11:00"
}
```

---

## 9. Test GraphQL

Open:

```text
http://localhost:3000/graphql
```

Example query:

```graphql
query {
  patients {
    id
    name
    email
    phone
  }
}
```

Example mutation:

```graphql
mutation {
  createAppointment(
    patient_id: 1
    doctor_id: 1
    date: "2026-05-28"
    time: "11:00"
  ) {
    id
    patient_id
    doctor_id
    date
    time
    status
  }
}
```

---

## 10. Test Kafka

To test Kafka, create an appointment using Postman, GraphQL or the Web Client.

Then check the Notification Service terminal.

Expected output:

```text
New Kafka Event Received
Topic: appointment_created
Notification: Appointment 2 created for patient 1 with doctor 1 on 2026-05-28 at 11:00.
```

Cancel an appointment:

```http
PUT http://localhost:3000/api/appointments/2/cancel
```

Expected output in Notification Service:

```text
New Kafka Event Received
Topic: appointment_cancelled
Notification: Appointment 2 has been cancelled.
```

---

## 11. Common Problems

### API Gateway does not respond

Check that the API Gateway is running:

```bash
cd api-gateway
npm start
```

### GraphQL does not work

Check that all microservices are running.

### Kafka event is not received

Check that:

- Kafka server is running
- Topics exist
- Appointment Service is running
- Notification Service is running

### Port already in use

Stop the old terminal process with:

```text
Ctrl + C
```

Then restart the service.

---

## 12. Execution Order Summary

Recommended execution order:

```text
1. Start Kafka
2. Start Patient Service
3. Start Doctor Service
4. Start Appointment Service
5. Start API Gateway
6. Start Notification Service
7. Open Web Client
8. Test REST, GraphQL and Kafka
```
