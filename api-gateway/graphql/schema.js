const typeDefs = `#graphql
  type Patient {
    id: ID!
    name: String!
    email: String!
    phone: String
  }

  type Doctor {
    id: ID!
    name: String!
    specialty: String!
    email: String!
    phone: String
  }

  type Appointment {
    id: ID!
    patient_id: Int!
    doctor_id: Int!
    date: String!
    time: String!
    status: String!
  }

  type Query {
    patients: [Patient]
    patient(id: ID!): Patient

    doctors: [Doctor]
    doctor(id: ID!): Doctor
    searchDoctorsBySpecialty(specialty: String!): [Doctor]

    appointments: [Appointment]
    appointment(id: ID!): Appointment
    appointmentsByPatient(patient_id: Int!): [Appointment]
    appointmentsByDoctor(doctor_id: Int!): [Appointment]
  }

  type Mutation {
    createPatient(name: String!, email: String!, phone: String): Patient
    updatePatient(id: ID!, name: String!, email: String!, phone: String): Patient
    deletePatient(id: ID!): String

    createDoctor(name: String!, specialty: String!, email: String!, phone: String): Doctor
    updateDoctor(id: ID!, name: String!, specialty: String!, email: String!, phone: String): Doctor
    deleteDoctor(id: ID!): String

    createAppointment(patient_id: Int!, doctor_id: Int!, date: String!, time: String!): Appointment
    cancelAppointment(id: ID!): Appointment
  }
`;

module.exports = typeDefs;