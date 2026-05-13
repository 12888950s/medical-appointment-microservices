const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "appointment-service",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();

let isConnected = false;

async function connectProducer() {
  if (!isConnected) {
    await producer.connect();
    isConnected = true;
    console.log("Kafka Producer connected from Appointment Service");
  }
}

async function sendAppointmentCreatedEvent(appointment) {
  await connectProducer();

  const event = {
    event: "appointment_created",
    appointment_id: appointment.id,
    patient_id: appointment.patient_id,
    doctor_id: appointment.doctor_id,
    date: appointment.date,
    time: appointment.time,
    status: appointment.status,
    createdAt: new Date().toISOString(),
  };

  await producer.send({
    topic: "appointment_created",
    messages: [
      {
        key: String(appointment.id),
        value: JSON.stringify(event),
      },
    ],
  });

  console.log("Kafka event sent:", event);
}

async function sendAppointmentCancelledEvent(appointment) {
  await connectProducer();

  const event = {
    event: "appointment_cancelled",
    appointment_id: appointment.id,
    patient_id: appointment.patient_id,
    doctor_id: appointment.doctor_id,
    date: appointment.date,
    time: appointment.time,
    status: appointment.status,
    cancelledAt: new Date().toISOString(),
  };

  await producer.send({
    topic: "appointment_cancelled",
    messages: [
      {
        key: String(appointment.id),
        value: JSON.stringify(event),
      },
    ],
  });

  console.log("Kafka event sent:", event);
}

module.exports = {
  sendAppointmentCreatedEvent,
  sendAppointmentCancelledEvent,
};