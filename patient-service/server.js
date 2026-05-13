const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const db = require("./database");

const PROTO_PATH = path.join(__dirname, "../protos/patient.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const patientProto = grpc.loadPackageDefinition(packageDefinition).patient;

function CreatePatient(call, callback) {
  const { name, email, phone } = call.request;

  if (!name || !email) {
    return callback({
      code: grpc.status.INVALID_ARGUMENT,
      message: "Name and email are required",
    });
  }

  const sql = "INSERT INTO patients (name, email, phone) VALUES (?, ?, ?)";

  db.run(sql, [name, email, phone], function (err) {
    if (err) {
      return callback({
        code: grpc.status.INTERNAL,
        message: err.message,
      });
    }

    callback(null, {
      id: this.lastID,
      name,
      email,
      phone,
    });
  });
}

function GetPatient(call, callback) {
  const { id } = call.request;

  db.get("SELECT * FROM patients WHERE id = ?", [id], (err, row) => {
    if (err) {
      return callback({
        code: grpc.status.INTERNAL,
        message: err.message,
      });
    }

    if (!row) {
      return callback({
        code: grpc.status.NOT_FOUND,
        message: "Patient not found",
      });
    }

    callback(null, row);
  });
}

function GetAllPatients(call, callback) {
  db.all("SELECT * FROM patients", [], (err, rows) => {
    if (err) {
      return callback({
        code: grpc.status.INTERNAL,
        message: err.message,
      });
    }

    callback(null, { patients: rows });
  });
}

function UpdatePatient(call, callback) {
  const { id, name, email, phone } = call.request;

  const sql = `
    UPDATE patients
    SET name = ?, email = ?, phone = ?
    WHERE id = ?
  `;

  db.run(sql, [name, email, phone, id], function (err) {
    if (err) {
      return callback({
        code: grpc.status.INTERNAL,
        message: err.message,
      });
    }

    if (this.changes === 0) {
      return callback({
        code: grpc.status.NOT_FOUND,
        message: "Patient not found",
      });
    }

    callback(null, {
      id,
      name,
      email,
      phone,
    });
  });
}

function DeletePatient(call, callback) {
  const { id } = call.request;

  db.run("DELETE FROM patients WHERE id = ?", [id], function (err) {
    if (err) {
      return callback({
        code: grpc.status.INTERNAL,
        message: err.message,
      });
    }

    if (this.changes === 0) {
      return callback({
        code: grpc.status.NOT_FOUND,
        message: "Patient not found",
      });
    }

    callback(null, {
      message: "Patient deleted successfully",
    });
  });
}

const server = new grpc.Server();

server.addService(patientProto.PatientService.service, {
  CreatePatient,
  GetPatient,
  GetAllPatients,
  UpdatePatient,
  DeletePatient,
});

server.bindAsync(
  "0.0.0.0:50051",
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.error("Failed to start Patient Service:", err);
      return;
    }

    console.log(`Patient Service running on port ${port}`);
    
  }
);