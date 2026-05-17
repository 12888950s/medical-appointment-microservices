# Medical Appointment Microservices

## 1. Project Description

This project is a Node.js microservices application for managing medical appointments.

The application allows users to manage patients, doctors and appointments through a microservices architecture. It includes an API Gateway that exposes REST and GraphQL interfaces. The internal communication between the API Gateway and the microservices is implemented using gRPC. Kafka is used for asynchronous event-based communication when appointments are created or cancelled.

This project was developed as part of the SOA and Microservices course.

---

## 2. Main Features

- Manage patients
- Manage doctors
- Create medical appointments
- Cancel appointments
- Visualize data using a simple web dashboard
- Expose REST endpoints
- Expose GraphQL queries and mutations
- Use gRPC for internal communication
- Use Kafka for asynchronous communication
- Use independent SQLite databases for each main microservice

---

## 3. Architecture Overview

The project follows a microservices architecture composed of:

- API Gateway
- Patient Service
- Doctor Service
- Appointment Service
- Notification Service
- Web Client
- Kafka Broker
- SQLite databases

General communication flow:

```text
Web Client / Postman / Apollo Sandbox
        |
        | REST / GraphQL
        v
API Gateway
        |
        | gRPC
        v
Patient Service      → patients.db
Doctor Service       → doctors.db
Appointment Service  → appointments.db
        |
        | Kafka Events
        v
Notification Service
```

---

## 4. Project Structure

```text
medical-appointment-microservices/
│
├── api-gateway/
│   ├── server.js
│   ├── graphql/
│   │   ├── schema.js
│   │   └── resolvers.js
│   └── package.json
│
├── patient-service/
│   ├── server.js
│   ├── database.js
│   └── package.json
│
├── doctor-service/
│   ├── server.js
│   ├── database.js
│   └── package.json
│
├── appointment-service/
│   ├── server.js
│   ├── database.js
│   ├── kafkaProducer.js
│   └── package.json
│
├── notification-service/
│   ├── consumer.js
│   └── package.json
│
├── web-client/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── protos/
│   ├── patient.proto
│   ├── doctor.proto
│   └── appointment.proto
│
├── docs/
│   ├── architecture.md
│   ├── rest-endpoints.md
│   ├── graphql-schema.md
│   ├── kafka-topics.md
│   ├── databases.md
│   └── installation.md
│
├── README.md
└── .gitignore
```

---

## 5. Microservices

### Patient Service

The Patient Service is responsible for managing patient data.

Port:

```text
50051
```

Database:

```text
patients.db
```

Main gRPC operations:

- CreatePatient
- GetPatient
- GetAllPatients
- UpdatePatient
- DeletePatient

---

### Doctor Service

The Doctor Service is responsible for managing doctor data.

Port:

```text
50052
```

Database:

```text
doctors.db
```

Main gRPC operations:

- CreateDoctor
- GetDoctor
- GetAllDoctors
- UpdateDoctor
- DeleteDoctor
- SearchDoctorsBySpecialty

---

### Appointment Service

The Appointment Service is responsible for managing medical appointments.

Port:

```text
50053
```

Database:

```text
appointments.db
```

Main gRPC operations:

- CreateAppointment
- GetAppointment
- GetAllAppointments
- CancelAppointment
- GetAppointmentsByPatient
- GetAppointmentsByDoctor

This service also produces Kafka events when an appointment is created or cancelled.

---

### Notification Service

The Notification Service consumes Kafka events and displays appointment notifications in the console.

Consumed topics:

- appointment_created
- appointment_cancelled

---

## 6. API Gateway

The API Gateway is the main entry point of the application.

Port:

```text
3000
```

It exposes:

- REST API
- GraphQL API

It communicates with the microservices using gRPC.

---

## 7. Technologies Used

- Node.js
- Express.js
- gRPC
- Protocol Buffers
- GraphQL
- Apollo Server
- Kafka
- KafkaJS
- SQLite3
- HTML
- CSS
- JavaScript
- Postman
- GitHub

---

## 8. REST API

Base URL:

```text
http://localhost:3000/api
```

### Patients

```http
POST   /api/patients
GET    /api/patients
GET    /api/patients/:id
PUT    /api/patients/:id
DELETE /api/patients/:id
```

### Doctors

```http
POST   /api/doctors
GET    /api/doctors
GET    /api/doctors/:id
PUT    /api/doctors/:id
DELETE /api/doctors/:id
GET    /api/doctors/search/:specialty
```

### Appointments

```http
POST   /api/appointments
GET    /api/appointments
GET    /api/appointments/:id
GET    /api/appointments/patient/:patient_id
GET    /api/appointments/doctor/:doctor_id
PUT    /api/appointments/:id/cancel
```

More details are available in:

```text
docs/rest-endpoints.md
```

---

## 9. GraphQL API

GraphQL endpoint:

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

More details are available in:

```text
docs/graphql-schema.md
```

---

## 10. Kafka

Kafka is used for asynchronous communication between Appointment Service and Notification Service.

Topics:

```text
appointment_created
appointment_cancelled
```

Producer:

```text
appointment-service
```

Consumer:

```text
notification-service
```

More details are available in:

```text
docs/kafka-topics.md
```

---

## 11. Databases

Each main microservice has its own independent SQLite database.

```text
Patient Service      → patients.db
Doctor Service       → doctors.db
Appointment Service  → appointments.db
```

More details are available in:

```text
docs/databases.md
```

---

## 12. Installation

Clone the repository:

```bash
git clone https://github.com/12888950s/medical-appointment-microservices.git
cd medical-appointment-microservices
```

Install dependencies for each service:

```bash
cd patient-service
npm install

cd ../doctor-service
npm install

cd ../appointment-service
npm install

cd ../api-gateway
npm install

cd ../notification-service
npm install
```

More details are available in:

```text
docs/installation.md
```

---

## 13. Running the Project

Start Kafka first.

Then run each service in a separate terminal.

### Patient Service

```bash
cd patient-service
npm start
```

### Doctor Service

```bash
cd doctor-service
npm start
```

### Appointment Service

```bash
cd appointment-service
npm start
```

### API Gateway

```bash
cd api-gateway
npm start
```

### Notification Service

```bash
cd notification-service
npm start
```

### Web Client

Open:

```text
web-client/index.html
```

or use Live Server.

---

## 14. Testing

REST API can be tested using Postman.

GraphQL can be tested using Apollo Sandbox:

```text
http://localhost:3000/graphql
```

Kafka can be tested by creating or cancelling an appointment and checking the Notification Service console.

The Web Client can be used to:

- Add patients
- Add doctors
- Create appointments
- Cancel appointments
- Visualize system data

---

## 15. Documentation

Detailed documentation is available in the `docs` folder:

- `docs/architecture.md`
- `docs/rest-endpoints.md`
- `docs/graphql-schema.md`
- `docs/kafka-topics.md`
- `docs/databases.md`
- `docs/installation.md`

---

## 16. Project Status

The project includes:

- Functional REST API
- Functional GraphQL API
- gRPC communication
- Kafka producer and consumer
- SQLite databases
- Web dashboard
- GitHub version control

---

## 17. Author

Souha Guezguez
