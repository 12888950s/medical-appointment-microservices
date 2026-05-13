const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const db = require("./database");

const PROTO_PATH = path.join(__dirname, "../protos/appointment.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const appointmentProto = grpc.loadPackageDefinition(packageDefinition).appointment;

function CreateAppointment(call, callback) {
  const { patient_id, doctor_id, date, time } = call.request;

  if (!patient_id || !doctor_id || !date || !time) {
    return callback({
      code: grpc.status.INVALID_ARGUMENT,
      message: "patient_id, doctor_id, date and time are required",
    });
  }

  const status = "created";

  const sql = `
    INSERT INTO appointments (patient_id, doctor_id, date, time, status)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(sql, [patient_id, doctor_id, date, time, status], function (err) {
    if (err) {
      return callback({
        code: grpc.status.INTERNAL,
        message: err.message,
      });
    }

    callback(null, {
      id: this.lastID,
      patient_id,
      doctor_id,
      date,
      time,
      status,
    });
  });
}

function GetAppointment(call, callback) {
  const { id } = call.request;

  db.get("SELECT * FROM appointments WHERE id = ?", [id], (err, row) => {
    if (err) {
      return callback({
        code: grpc.status.INTERNAL,
        message: err.message,
      });
    }

    if (!row) {
      return callback({
        code: grpc.status.NOT_FOUND,
        message: "Appointment not found",
      });
    }

    callback(null, row);
  });
}

function GetAllAppointments(call, callback) {
  db.all("SELECT * FROM appointments", [], (err, rows) => {
    if (err) {
      return callback({
        code: grpc.status.INTERNAL,
        message: err.message,
      });
    }

    callback(null, { appointments: rows });
  });
}

function CancelAppointment(call, callback) {
  const { id } = call.request;

  db.run(
    "UPDATE appointments SET status = ? WHERE id = ?",
    ["cancelled", id],
    function (err) {
      if (err) {
        return callback({
          code: grpc.status.INTERNAL,
          message: err.message,
        });
      }

      if (this.changes === 0) {
        return callback({
          code: grpc.status.NOT_FOUND,
          message: "Appointment not found",
        });
      }

      db.get("SELECT * FROM appointments WHERE id = ?", [id], (err, row) => {
        if (err) {
          return callback({
            code: grpc.status.INTERNAL,
            message: err.message,
          });
        }

        callback(null, row);
      });
    }
  );
}

function GetAppointmentsByPatient(call, callback) {
  const { patient_id } = call.request;

  db.all(
    "SELECT * FROM appointments WHERE patient_id = ?",
    [patient_id],
    (err, rows) => {
      if (err) {
        return callback({
          code: grpc.status.INTERNAL,
          message: err.message,
        });
      }

      callback(null, { appointments: rows });
    }
  );
}

function GetAppointmentsByDoctor(call, callback) {
  const { doctor_id } = call.request;

  db.all(
    "SELECT * FROM appointments WHERE doctor_id = ?",
    [doctor_id],
    (err, rows) => {
      if (err) {
        return callback({
          code: grpc.status.INTERNAL,
          message: err.message,
        });
      }

      callback(null, { appointments: rows });
    }
  );
}

const server = new grpc.Server();

server.addService(appointmentProto.AppointmentService.service, {
  CreateAppointment,
  GetAppointment,
  GetAllAppointments,
  CancelAppointment,
  GetAppointmentsByPatient,
  GetAppointmentsByDoctor,
});

server.bindAsync(
  "0.0.0.0:50053",
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.error("Failed to start Appointment Service:", err);
      return;
    }

    console.log(`Appointment Service running on port ${port}`);
  }
);