function grpcCall(client, method, payload) {
  return new Promise((resolve, reject) => {
    client[method](payload, (err, response) => {
      if (err) reject(err);
      else resolve(response);
    });
  });
}

function createResolvers(patientClient, doctorClient, appointmentClient) {
  return {
    Query: {
      patients: async () => {
        const response = await grpcCall(patientClient, "GetAllPatients", {});
        return response.patients;
      },

      patient: async (_, { id }) => {
        return await grpcCall(patientClient, "GetPatient", {
          id: parseInt(id),
        });
      },

      doctors: async () => {
        const response = await grpcCall(doctorClient, "GetAllDoctors", {});
        return response.doctors;
      },

      doctor: async (_, { id }) => {
        return await grpcCall(doctorClient, "GetDoctor", {
          id: parseInt(id),
        });
      },

      searchDoctorsBySpecialty: async (_, { specialty }) => {
        const response = await grpcCall(
          doctorClient,
          "SearchDoctorsBySpecialty",
          { specialty }
        );
        return response.doctors;
      },

      appointments: async () => {
        const response = await grpcCall(
          appointmentClient,
          "GetAllAppointments",
          {}
        );
        return response.appointments;
      },

      appointment: async (_, { id }) => {
        return await grpcCall(appointmentClient, "GetAppointment", {
          id: parseInt(id),
        });
      },

      appointmentsByPatient: async (_, { patient_id }) => {
        const response = await grpcCall(
          appointmentClient,
          "GetAppointmentsByPatient",
          { patient_id }
        );
        return response.appointments;
      },

      appointmentsByDoctor: async (_, { doctor_id }) => {
        const response = await grpcCall(
          appointmentClient,
          "GetAppointmentsByDoctor",
          { doctor_id }
        );
        return response.appointments;
      },
    },

    Mutation: {
      createPatient: async (_, { name, email, phone }) => {
        return await grpcCall(patientClient, "CreatePatient", {
          name,
          email,
          phone,
        });
      },

      updatePatient: async (_, { id, name, email, phone }) => {
        return await grpcCall(patientClient, "UpdatePatient", {
          id: parseInt(id),
          name,
          email,
          phone,
        });
      },

      deletePatient: async (_, { id }) => {
        const response = await grpcCall(patientClient, "DeletePatient", {
          id: parseInt(id),
        });
        return response.message;
      },

      createDoctor: async (_, { name, specialty, email, phone }) => {
        return await grpcCall(doctorClient, "CreateDoctor", {
          name,
          specialty,
          email,
          phone,
        });
      },

      updateDoctor: async (_, { id, name, specialty, email, phone }) => {
        return await grpcCall(doctorClient, "UpdateDoctor", {
          id: parseInt(id),
          name,
          specialty,
          email,
          phone,
        });
      },

      deleteDoctor: async (_, { id }) => {
        const response = await grpcCall(doctorClient, "DeleteDoctor", {
          id: parseInt(id),
        });
        return response.message;
      },

      createAppointment: async (_, { patient_id, doctor_id, date, time }) => {
        return await grpcCall(appointmentClient, "CreateAppointment", {
          patient_id,
          doctor_id,
          date,
          time,
        });
      },

      cancelAppointment: async (_, { id }) => {
        return await grpcCall(appointmentClient, "CancelAppointment", {
          id: parseInt(id),
        });
      },
    },
  };
}

module.exports = createResolvers;