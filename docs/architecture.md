# Architecture Documentation

## 1. General Architecture

The application is based on a microservices architecture.

The client does not communicate directly with the microservices. Instead, all external requests pass through the API Gateway.

```text
Client / Web Dashboard / Postman / Apollo Sandbox
        |
        | REST / GraphQL
        v
API Gateway
        |
        | gRPC
        v
Patient Service
Doctor Service
Appointment Service
        |
        | Kafka
        v
Notification Service
```

---

## 2. Main Components

### API Gateway

The API Gateway is the main entry point of the system.

It exposes:

- REST endpoints
- GraphQL endpoint

It communicates with the microservices using gRPC.

The API Gateway does not contain the main business logic. Its role is to receive client requests and forward them to the correct microservice.

---

### Patient Service

The Patient Service manages patient information.

Responsibilities:

- Create patients
- Retrieve patients
- Update patients
- Delete patients

Database:

```text
patients.db
```

Port:

```text
50051
```

---

### Doctor Service

The Doctor Service manages doctor information.

Responsibilities:

- Create doctors
- Retrieve doctors
- Update doctors
- Delete doctors
- Search doctors by specialty

Database:

```text
doctors.db
```

Port:

```text
50052
```

---

### Appointment Service

The Appointment Service manages medical appointments.

Responsibilities:

- Create appointments
- Retrieve appointments
- Cancel appointments
- Retrieve appointments by patient
- Retrieve appointments by doctor

Database:

```text
appointments.db
```

Port:

```text
50053
```

This service also publishes Kafka events when appointments are created or cancelled.

---

### Notification Service

The Notification Service consumes Kafka events and displays notifications in the console.

It listens to the following topics:

```text
appointment_created
appointment_cancelled
```

---

### Web Client

The Web Client is a simple HTML, CSS and JavaScript interface.

It communicates only with the API Gateway using REST.

It allows the user to:

- Add patients
- Add doctors
- Create appointments
- Cancel appointments
- View patients, doctors and appointments

---

## 3. Communication Types

### REST

REST is used between the client and the API Gateway for classical CRUD operations.

Example:

```http
GET /api/patients
POST /api/appointments
```

---

### GraphQL

GraphQL is used between the client and the API Gateway for flexible queries.

Example:

```graphql
query {
  doctors {
    id
    name
    specialty
  }
}
```

---

### gRPC

gRPC is used between the API Gateway and the microservices.

The `.proto` files define the communication contracts.

Files:

```text
protos/patient.proto
protos/doctor.proto
protos/appointment.proto
```

---

### Kafka

Kafka is used for asynchronous event-based communication.

The Appointment Service publishes events.

The Notification Service consumes events.

```text
Appointment Service → Kafka → Notification Service
```

---

## 4. Architecture Flow

### Create Appointment Flow

```text
1. The user creates an appointment from the Web Client or Postman.
2. The request is sent to the API Gateway using REST.
3. The API Gateway calls Appointment Service using gRPC.
4. Appointment Service stores the appointment in appointments.db.
5. Appointment Service publishes an appointment_created event to Kafka.
6. Notification Service consumes the event.
7. Notification Service displays a notification in the console.
```

---

### Cancel Appointment Flow

```text
1. The user cancels an appointment.
2. The request is sent to the API Gateway.
3. The API Gateway calls Appointment Service using gRPC.
4. Appointment Service updates the appointment status to cancelled.
5. Appointment Service publishes an appointment_cancelled event to Kafka.
6. Notification Service consumes the event.
7. Notification Service displays a cancellation notification.
```
