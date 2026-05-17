# Kafka Topics Documentation

## 1. Kafka Role in the Project

Kafka is used for asynchronous communication between microservices.

In this project, the Appointment Service publishes events when appointments are created or cancelled. The Notification Service consumes these events and displays notifications in the console.

This makes the services more decoupled because the Appointment Service does not directly call the Notification Service.

---

## 2. Kafka Components

### Producer

```text
appointment-service
```

### Broker

```text
Kafka running on localhost:9092
```

### Consumer

```text
notification-service
```

### Topics

```text
appointment_created
appointment_cancelled
```

---

## 3. Topic: appointment_created

### Producer

```text
appointment-service
```

### Consumer

```text
notification-service
```

### Trigger

This event is produced when a new appointment is created.

### Example Message

```json
{
  "event": "appointment_created",
  "appointment_id": 2,
  "patient_id": 1,
  "doctor_id": 1,
  "date": "2026-05-28",
  "time": "11:00",
  "status": "created",
  "createdAt": "2026-05-13T22:26:28.702Z"
}
```

### Business Scenario

When the user creates an appointment, the Appointment Service stores the appointment in the SQLite database, then publishes an `appointment_created` event to Kafka.

The Notification Service consumes this event and displays a message such as:

```text
Notification: Appointment 2 created for patient 1 with doctor 1 on 2026-05-28 at 11:00.
```

---

## 4. Topic: appointment_cancelled

### Producer

```text
appointment-service
```

### Consumer

```text
notification-service
```

### Trigger

This event is produced when an appointment is cancelled.

### Example Message

```json
{
  "event": "appointment_cancelled",
  "appointment_id": 2,
  "patient_id": 1,
  "doctor_id": 1,
  "date": "2026-05-28",
  "time": "11:00",
  "status": "cancelled",
  "cancelledAt": "2026-05-13T22:30:00.000Z"
}
```

### Business Scenario

When the user cancels an appointment, the Appointment Service updates the appointment status in the SQLite database, then publishes an `appointment_cancelled` event to Kafka.

The Notification Service consumes this event and displays a cancellation notification.

---

## 5. Kafka Commands

### List Topics

```bash
./bin/kafka-topics.sh --list --bootstrap-server localhost:9092
```

### Create appointment_created Topic

```bash
./bin/kafka-topics.sh --create --partitions 3 --replication-factor 1 --topic appointment_created --bootstrap-server localhost:9092
```

### Create appointment_cancelled Topic

```bash
./bin/kafka-topics.sh --create --partitions 3 --replication-factor 1 --topic appointment_cancelled --bootstrap-server localhost:9092
```

---

## 6. Kafka Flow

```text
Appointment created or cancelled
        |
        v
Appointment Service
        |
        | Kafka Producer
        v
Kafka Topic
        |
        | Kafka Consumer
        v
Notification Service
        |
        v
Console Notification
```
