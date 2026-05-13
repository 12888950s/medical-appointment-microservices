const express = require("express");
const cors = require("cors");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// Charger le fichier patient.proto
const PATIENT_PROTO_PATH = path.join(__dirname, "../protos/patient.proto");
const DOCTOR_PROTO_PATH = path.join(__dirname, "../protos/doctor.proto");

const patientPackageDefinition = protoLoader.loadSync(PATIENT_PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const doctorPackageDefinition = protoLoader.loadSync(DOCTOR_PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const patientProto = grpc.loadPackageDefinition(patientPackageDefinition).patient;
const doctorProto = grpc.loadPackageDefinition(doctorPackageDefinition).doctor;
// Créer le client gRPC vers Patient Service
const patientClient = new patientProto.PatientService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);
const doctorClient = new doctorProto.DoctorService(
  "localhost:50052",
  grpc.credentials.createInsecure()
);
// Route de test
app.get("/", (req, res) => {
  res.send("API Gateway is running");
});

// CREATE PATIENT
app.post("/api/patients", (req, res) => {
  const { name, email, phone } = req.body;

  patientClient.CreatePatient({ name, email, phone }, (err, response) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }

    res.status(201).json(response);
  });
});

// GET ALL PATIENTS
app.get("/api/patients", (req, res) => {
  patientClient.GetAllPatients({}, (err, response) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }

    res.json(response.patients);
  });
});

// GET PATIENT BY ID
app.get("/api/patients/:id", (req, res) => {
  const id = parseInt(req.params.id);

  patientClient.GetPatient({ id }, (err, response) => {
    if (err) {
      return res.status(404).json({
        error: err.message,
      });
    }

    res.json(response);
  });
});

// UPDATE PATIENT
app.put("/api/patients/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email, phone } = req.body;

  patientClient.UpdatePatient({ id, name, email, phone }, (err, response) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }

    res.json(response);
  });
});

// DELETE PATIENT
app.delete("/api/patients/:id", (req, res) => {
  const id = parseInt(req.params.id);

  patientClient.DeletePatient({ id }, (err, response) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }

    res.json(response);
  });
});
// CREATE DOCTOR
app.post("/api/doctors", (req, res) => {
  const { name, specialty, email, phone } = req.body;

  doctorClient.CreateDoctor({ name, specialty, email, phone }, (err, response) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }

    res.status(201).json(response);
  });
});

// GET ALL DOCTORS
app.get("/api/doctors", (req, res) => {
  doctorClient.GetAllDoctors({}, (err, response) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }

    res.json(response.doctors);
  });
});

// SEARCH DOCTORS BY SPECIALTY
app.get("/api/doctors/search/:specialty", (req, res) => {
  const specialty = req.params.specialty;

  doctorClient.SearchDoctorsBySpecialty({ specialty }, (err, response) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }

    res.json(response.doctors);
  });
});

// GET DOCTOR BY ID
app.get("/api/doctors/:id", (req, res) => {
  const id = parseInt(req.params.id);

  doctorClient.GetDoctor({ id }, (err, response) => {
    if (err) {
      return res.status(404).json({
        error: err.message,
      });
    }

    res.json(response);
  });
});

// UPDATE DOCTOR
app.put("/api/doctors/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { name, specialty, email, phone } = req.body;

  doctorClient.UpdateDoctor(
    { id, name, specialty, email, phone },
    (err, response) => {
      if (err) {
        return res.status(500).json({
          error: err.message,
        });
      }

      res.json(response);
    }
  );
});

// DELETE DOCTOR
app.delete("/api/doctors/:id", (req, res) => {
  const id = parseInt(req.params.id);

  doctorClient.DeleteDoctor({ id }, (err, response) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }

    res.json(response);
  });
});
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});