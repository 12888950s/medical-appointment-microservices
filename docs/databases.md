# Databases Documentation

## 1. Database Choice

The project uses SQLite3 as the database system.

SQLite3 was selected because the project data is structured and relational. The application uses tables for patients, doctors and appointments.

RxDB was not used because the project does not require a NoSQL document-oriented database.

---

## 2. Database Per Microservice

Each main microservice has its own independent database.

```text
Patient Service      → patients.db
Doctor Service       → doctors.db
Appointment Service  → appointments.db
```

This separation respects the microservices principle of service autonomy.

Each service is responsible for its own data and does not directly access the database of another service.

---

## 3. Patient Service Database

Database file:

```text
patients.db
```

Table:

```sql
CREATE TABLE patients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT
);
```

### Fields

| Field | Type | Description |
|---|---|---|
| id | INTEGER | Primary key |
| name | TEXT | Patient name |
| email | TEXT | Patient email |
| phone | TEXT | Patient phone number |

---

## 4. Doctor Service Database

Database file:

```text
doctors.db
```

Table:

```sql
CREATE TABLE doctors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT
);
```

### Fields

| Field | Type | Description |
|---|---|---|
| id | INTEGER | Primary key |
| name | TEXT | Doctor name |
| specialty | TEXT | Doctor specialty |
| email | TEXT | Doctor email |
| phone | TEXT | Doctor phone number |

---

## 5. Appointment Service Database

Database file:

```text
appointments.db
```

Table:

```sql
CREATE TABLE appointments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  doctor_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  status TEXT NOT NULL
);
```

### Fields

| Field | Type | Description |
|---|---|---|
| id | INTEGER | Primary key |
| patient_id | INTEGER | Patient identifier |
| doctor_id | INTEGER | Doctor identifier |
| date | TEXT | Appointment date |
| time | TEXT | Appointment time |
| status | TEXT | Appointment status |

---

## 6. Why Separate Databases?

Using a separate database for each microservice improves independence.

For example:

```text
Patient Service manages only patients.db
Doctor Service manages only doctors.db
Appointment Service manages only appointments.db
```

This means that a change in one service database does not directly affect the internal database of another service.

---

## 7. Database Files and Git

The `.db` files are generated locally when the services are started.

They should not be pushed to GitHub.

The `.gitignore` file contains:

```gitignore
*.db
node_modules/
.env
```
