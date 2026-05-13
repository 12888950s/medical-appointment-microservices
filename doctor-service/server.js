const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const db = require("./database");

const PROTO_PATH = path.join(__dirname, "../protos/doctor.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const doctorProto = grpc.loadPackageDefinition(packageDefinition).doctor;

function CreateDoctor(call, callback) {
  const { name, specialty, email, phone } = call.request;

  if (!name || !specialty || !email) {
    return callback({
      code: grpc.status.INVALID_ARGUMENT,
      message: "Name, specialty and email are required",
    });
  }

  const sql =
    "INSERT INTO doctors (name, specialty, email, phone) VALUES (?, ?, ?, ?)";

  db.run(sql, [name, specialty, email, phone], function (err) {
    if (err) {
      return callback({
        code: grpc.status.INTERNAL,
        message: err.message,
      });
    }

    callback(null, {
      id: this.lastID,
      name,
      specialty,
      email,
      phone,
    });
  });
}

function GetDoctor(call, callback) {
  const { id } = call.request;

  db.get("SELECT * FROM doctors WHERE id = ?", [id], (err, row) => {
    if (err) {
      return callback({
        code: grpc.status.INTERNAL,
        message: err.message,
      });
    }

    if (!row) {
      return callback({
        code: grpc.status.NOT_FOUND,
        message: "Doctor not found",
      });
    }

    callback(null, row);
  });
}

function GetAllDoctors(call, callback) {
  db.all("SELECT * FROM doctors", [], (err, rows) => {
    if (err) {
      return callback({
        code: grpc.status.INTERNAL,
        message: err.message,
      });
    }

    callback(null, { doctors: rows });
  });
}

function UpdateDoctor(call, callback) {
  const { id, name, specialty, email, phone } = call.request;

  const sql = `
    UPDATE doctors
    SET name = ?, specialty = ?, email = ?, phone = ?
    WHERE id = ?
  `;

  db.run(sql, [name, specialty, email, phone, id], function (err) {
    if (err) {
      return callback({
        code: grpc.status.INTERNAL,
        message: err.message,
      });
    }

    if (this.changes === 0) {
      return callback({
        code: grpc.status.NOT_FOUND,
        message: "Doctor not found",
      });
    }

    callback(null, {
      id,
      name,
      specialty,
      email,
      phone,
    });
  });
}

function DeleteDoctor(call, callback) {
  const { id } = call.request;

  db.run("DELETE FROM doctors WHERE id = ?", [id], function (err) {
    if (err) {
      return callback({
        code: grpc.status.INTERNAL,
        message: err.message,
      });
    }

    if (this.changes === 0) {
      return callback({
        code: grpc.status.NOT_FOUND,
        message: "Doctor not found",
      });
    }

    callback(null, {
      message: "Doctor deleted successfully",
    });
  });
}

function SearchDoctorsBySpecialty(call, callback) {
  const { specialty } = call.request;

  db.all(
    "SELECT * FROM doctors WHERE specialty LIKE ?",
    [`%${specialty}%`],
    (err, rows) => {
      if (err) {
        return callback({
          code: grpc.status.INTERNAL,
          message: err.message,
        });
      }

      callback(null, { doctors: rows });
    }
  );
}

const server = new grpc.Server();

server.addService(doctorProto.DoctorService.service, {
  CreateDoctor,
  GetDoctor,
  GetAllDoctors,
  UpdateDoctor,
  DeleteDoctor,
  SearchDoctorsBySpecialty,
});

server.bindAsync(
  "0.0.0.0:50052",
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.error("Failed to start Doctor Service:", err);
      return;
    }

    console.log(`Doctor Service running on port ${port}`);
  }
);