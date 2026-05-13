const API_URL = "http://localhost:3000/api";

async function fetchData(endpoint) {
  const response = await fetch(`${API_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(`Error fetching ${endpoint}`);
  }

  return response.json();
}

async function loadPatients() {
  const patients = await fetchData("/patients");

  document.getElementById("patientsCount").textContent = patients.length;

  const table = document.getElementById("patientsTable");
  table.innerHTML = "";

  patients.forEach((patient) => {
    table.innerHTML += `
      <tr>
        <td>${patient.id}</td>
        <td>${patient.name}</td>
        <td>${patient.email}</td>
        <td>${patient.phone || ""}</td>
      </tr>
    `;
  });
}

async function loadDoctors() {
  const doctors = await fetchData("/doctors");

  document.getElementById("doctorsCount").textContent = doctors.length;

  const table = document.getElementById("doctorsTable");
  table.innerHTML = "";

  doctors.forEach((doctor) => {
    table.innerHTML += `
      <tr>
        <td>${doctor.id}</td>
        <td>${doctor.name}</td>
        <td>${doctor.specialty}</td>
        <td>${doctor.email}</td>
      </tr>
    `;
  });
}

async function loadAppointments() {
  const appointments = await fetchData("/appointments");

  document.getElementById("appointmentsCount").textContent = appointments.length;

  const table = document.getElementById("appointmentsTable");
  table.innerHTML = "";

  appointments.forEach((appointment) => {
    const statusClass =
      appointment.status === "cancelled"
        ? "status-cancelled"
        : "status-created";

    table.innerHTML += `
      <tr>
        <td>${appointment.id}</td>
        <td>${appointment.patient_id}</td>
        <td>${appointment.doctor_id}</td>
        <td>${appointment.date}</td>
        <td>${appointment.time}</td>
        <td class="${statusClass}">${appointment.status}</td>
        <td>
          ${
            appointment.status === "created"
              ? `<button class="cancel-btn" onclick="cancelAppointment(${appointment.id})">Cancel</button>`
              : "-"
          }
        </td>
      </tr>
    `;
  });
}

async function loadAllData() {
  try {
    await loadPatients();
    await loadDoctors();
    await loadAppointments();
  } catch (error) {
    document.getElementById("message").textContent =
      "Error loading data. Please check if API Gateway is running.";
  }
}

async function createAppointment(event) {
  event.preventDefault();

  const appointment = {
    patient_id: parseInt(document.getElementById("patientId").value),
    doctor_id: parseInt(document.getElementById("doctorId").value),
    date: document.getElementById("date").value,
    time: document.getElementById("time").value,
  };

  try {
    const response = await fetch(`${API_URL}/appointments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(appointment),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error creating appointment");
    }

    document.getElementById("message").textContent =
      `Appointment ${data.id} created successfully. Kafka event sent.`;

    document.getElementById("appointmentForm").reset();

    await loadAppointments();
  } catch (error) {
    document.getElementById("message").textContent = error.message;
  }
}

async function cancelAppointment(id) {
  try {
    const response = await fetch(`${API_URL}/appointments/${id}/cancel`, {
      method: "PUT",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error cancelling appointment");
    }

    document.getElementById("message").textContent =
      `Appointment ${data.id} cancelled successfully. Kafka event sent.`;

    await loadAppointments();
  } catch (error) {
    document.getElementById("message").textContent = error.message;
  }
}
async function createPatient(event) {
  event.preventDefault();

  const patient = {
    name: document.getElementById("patientName").value,
    email: document.getElementById("patientEmail").value,
    phone: document.getElementById("patientPhone").value,
  };

  try {
    const response = await fetch(`${API_URL}/patients`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(patient),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error creating patient");
    }

    document.getElementById("message").textContent =
      `Patient ${data.id} added successfully.`;

    document.getElementById("patientForm").reset();

    await loadPatients();
  } catch (error) {
    document.getElementById("message").textContent = error.message;
  }
}

async function createDoctor(event) {
  event.preventDefault();

  const doctor = {
    name: document.getElementById("doctorName").value,
    specialty: document.getElementById("doctorSpecialty").value,
    email: document.getElementById("doctorEmail").value,
    phone: document.getElementById("doctorPhone").value,
  };

  try {
    const response = await fetch(`${API_URL}/doctors`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(doctor),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error creating doctor");
    }

    document.getElementById("message").textContent =
      `Doctor ${data.id} added successfully.`;

    document.getElementById("doctorForm").reset();

    await loadDoctors();
  } catch (error) {
    document.getElementById("message").textContent = error.message;
  }
}
document
  .getElementById("patientForm")
  .addEventListener("submit", createPatient);

document
  .getElementById("doctorForm")
  .addEventListener("submit", createDoctor);

document
  .getElementById("appointmentForm")
  .addEventListener("submit", createAppointment);

loadAllData();