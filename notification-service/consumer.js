const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "notification-service",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({
  groupId: "notification-group",
});

async function runConsumer() {
  await consumer.connect();

  await consumer.subscribe({
    topic: "appointment_created",
    fromBeginning: true,
  });

  await consumer.subscribe({
    topic: "appointment_cancelled",
    fromBeginning: true,
  });

  console.log("Notification Service is listening to Kafka events...");

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const value = message.value.toString();
      const event = JSON.parse(value);

      console.log("---------------------------------------");
      console.log("New Kafka Event Received");
      console.log("Topic:", topic);
      console.log("Partition:", partition);
      console.log("Offset:", message.offset);
      console.log("Event:", event.event);

      if (topic === "appointment_created") {
        console.log(
          `Notification: Appointment ${event.appointment_id} created for patient ${event.patient_id} with doctor ${event.doctor_id} on ${event.date} at ${event.time}.`
        );
      }

      if (topic === "appointment_cancelled") {
        console.log(
          `Notification: Appointment ${event.appointment_id} has been cancelled.`
        );
      }

      console.log("---------------------------------------");
    },
  });
}

runConsumer().catch((error) => {
  console.error("Error in Notification Service:", error);
});