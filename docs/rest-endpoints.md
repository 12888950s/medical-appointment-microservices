# REST Endpoints Documentation

## 1. Base URL

```text
http://localhost:3000/api
```

The REST API is exposed by the API Gateway.

---

## 2. Patient Endpoints

### Create Patient

```http
POST /patients
```

Request body:

```json
{
  "name": "Souha Guezguez",
  "email": "souha@example.com",
  "phone": "28777836"
}
```

Example response:

```json
{
  "id": 1,
  "name": "Souha Guezguez",
  "email": "souha@example.com",
  "phone": "28777836"
}
```

---

### Get All Patients

```http
GET /patients
```

Example response:

```json
[
  {
    "id": 1,
    "name": "Souha Guezguez",
    "email": "souha@example.com",
    "phone": "28777836"
  }
]
```

---

### Get Patient By ID

```http
GET /patients/:id
```

Example:

```http
GET /patients/1
```

---

### Update Patient

```http
PUT /patients/:id
```

Request body:

```json
{
  "name": "Souha Guezguez",
  "email": "souha.updated@example.com",
  "phone": "28000000"
}
```

---

### Delete Patient

```http
DELETE /patients/:id
```

Example:

```http
DELETE /patients/1
```

---

## 3. Doctor Endpoints

### Create Doctor

```http
POST /doctors
```

Request body:

```json
{
  "name": "Dr Ahmed Ben Ali",
  "specialty": "Cardiology",
  "email": "ahmed.doctor@example.com",
  "phone": "22111222"
}
```

Example response:

```json
{
  "id": 1,
  "name": "Dr Ahmed Ben Ali",
  "specialty": "Cardiology",
  "email": "ahmed.doctor@example.com",
  "phone": "22111222"
}
```

---

### Get All Doctors

```http
GET /doctors
```

---

### Get Doctor By ID

```http
GET /doctors/:id
```

Example:

```http
GET /doctors/1
```

---

### Search Doctors By Specialty

```http
GET /doctors/search/:specialty
```

Example:

```http
GET /doctors/search/Cardiology
```

---

### Update Doctor

```http
PUT /doctors/:id
```

Request body:

```json
{
  "name": "Dr Ahmed Ben Ali",
  "specialty": "Neurology",
  "email": "ahmed.updated@example.com",
  "phone": "22111222"
}
```

---

### Delete Doctor

```http
DELETE /doctors/:id
```

Example:

```http
DELETE /doctors/1
```

---

## 4. Appointment Endpoints

### Create Appointment

```http
POST /appointments
```

Request body:

```json
{
  "patient_id": 1,
  "doctor_id": 1,
  "date": "2026-05-28",
  "time": "11:00"
}
```

Example response:

```json
{
  "id": 2,
  "patient_id": 1,
  "doctor_id": 1,
  "date": "2026-05-28",
  "time": "11:00",
  "status": "created"
}
```

When an appointment is created, the Appointment Service also publishes a Kafka event to the `appointment_created` topic.

---

### Get All Appointments

```http
GET /appointments
```

---

### Get Appointment By ID

```http
GET /appointments/:id
```

Example:

```http
GET /appointments/2
```

---

### Get Appointments By Patient

```http
GET /appointments/patient/:patient_id
```

Example:

```http
GET /appointments/patient/1
```

---

### Get Appointments By Doctor

```http
GET /appointments/doctor/:doctor_id
```

Example:

```http
GET /appointments/doctor/1
```

---

### Cancel Appointment

```http
PUT /appointments/:id/cancel
```

Example:

```http
PUT /appointments/2/cancel
```

Example response:

```json
{
  "id": 2,
  "patient_id": 1,
  "doctor_id": 1,
  "date": "2026-05-28",
  "time": "11:00",
  "status": "cancelled"
}
```

When an appointment is cancelled, the Appointment Service publishes a Kafka event to the `appointment_cancelled` topic.
