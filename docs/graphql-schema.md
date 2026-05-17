# GraphQL Documentation

## 1. GraphQL Endpoint

```text
http://localhost:3000/graphql
```

GraphQL is exposed by the API Gateway.

It allows the client to request only the required fields.

---

## 2. Main Types

### Patient

```graphql
type Patient {
  id: ID!
  name: String!
  email: String!
  phone: String
}
```

---

### Doctor

```graphql
type Doctor {
  id: ID!
  name: String!
  specialty: String!
  email: String!
  phone: String
}
```

---

### Appointment

```graphql
type Appointment {
  id: ID!
  patient_id: Int!
  doctor_id: Int!
  date: String!
  time: String!
  status: String!
}
```

---

## 3. Queries

### Get All Patients

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

---

### Get Patient By ID

```graphql
query {
  patient(id: 1) {
    id
    name
    email
    phone
  }
}
```

---

### Get All Doctors

```graphql
query {
  doctors {
    id
    name
    specialty
    email
    phone
  }
}
```

---

### Get Doctor By ID

```graphql
query {
  doctor(id: 1) {
    id
    name
    specialty
    email
  }
}
```

---

### Search Doctors By Specialty

```graphql
query {
  searchDoctorsBySpecialty(specialty: "Cardiology") {
    id
    name
    specialty
  }
}
```

---

### Get All Appointments

```graphql
query {
  appointments {
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

### Get Appointment By ID

```graphql
query {
  appointment(id: 1) {
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

### Get Appointments By Patient

```graphql
query {
  appointmentsByPatient(patient_id: 1) {
    id
    doctor_id
    date
    time
    status
  }
}
```

---

### Get Appointments By Doctor

```graphql
query {
  appointmentsByDoctor(doctor_id: 1) {
    id
    patient_id
    date
    time
    status
  }
}
```

---

## 4. Mutations

### Create Patient

```graphql
mutation {
  createPatient(
    name: "Ali Mansour"
    email: "ali@example.com"
    phone: "22123456"
  ) {
    id
    name
    email
    phone
  }
}
```

---

### Update Patient

```graphql
mutation {
  updatePatient(
    id: 1
    name: "Ali Updated"
    email: "ali.updated@example.com"
    phone: "22000000"
  ) {
    id
    name
    email
    phone
  }
}
```

---

### Delete Patient

```graphql
mutation {
  deletePatient(id: 1)
}
```

---

### Create Doctor

```graphql
mutation {
  createDoctor(
    name: "Dr Ahmed Ben Ali"
    specialty: "Cardiology"
    email: "ahmed.doctor@example.com"
    phone: "22111222"
  ) {
    id
    name
    specialty
    email
    phone
  }
}
```

---

### Update Doctor

```graphql
mutation {
  updateDoctor(
    id: 1
    name: "Dr Ahmed Updated"
    specialty: "Neurology"
    email: "ahmed.updated@example.com"
    phone: "22111222"
  ) {
    id
    name
    specialty
    email
  }
}
```

---

### Delete Doctor

```graphql
mutation {
  deleteDoctor(id: 1)
}
```

---

### Create Appointment

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

### Cancel Appointment

```graphql
mutation {
  cancelAppointment(id: 1) {
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

## 5. GraphQL Usage Justification

GraphQL is useful in this project because it allows clients to request only the fields they need.

For example, a client can request only doctor names and specialties:

```graphql
query {
  doctors {
    name
    specialty
  }
}
```

This provides more flexibility than REST for customized data retrieval.
