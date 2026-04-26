let allData = [];

// FETCH ALL PRESCRIPTIONS FROM BACKEND
fetch("/api/prescriptions")
    .then(res => res.json())
    .then(data => {
        allData = data;
        display(data);
    })
    .catch(err => {
        console.error("Error fetching data:", err);
    });


// DISPLAY FUNCTION
function display(data) {
    const container = document.getElementById("patientList");
    container.innerHTML = "";

    if (data.length === 0) {
        container.innerHTML = "<p>No patient data found</p>";
        return;
    }

    data.forEach(p => {
        container.innerHTML += `
      <div class="card shadow-sm border-0 mb-3">
        <div class="card-body">

          <h5 class="card-title">
            <i class="bi bi-person-circle"></i> ${p.patient}
          </h5>

          <p class="card-text">
            <i class="bi bi-clipboard2-pulse"></i> Diagnosis: ${p.diagnosis}
          </p>

          <p class="card-text">
            <i class="bi bi-capsule"></i> Medicines: ${p.meds.join(", ")}
          </p>

          <button class="btn btn-primary btn-sm" onclick="viewDetails('${p.patient}')">
            <i class="bi bi-eye"></i> View
          </button>

        </div>
      </div>
    `;
    });
}


// SEARCH FUNCTION
function searchPatient() {
    const value = document.getElementById("search").value.toLowerCase();

    const filtered = allData.filter(p =>
        p.patient.toLowerCase().includes(value)
    );

    display(filtered);
}


// VIEW DETAILS FUNCTION (OPTIONAL - BASIC ALERT FOR NOW)
function viewDetails(name) {
    const patient = allData.find(p => p.patient === name);

    if (patient) {
        const box = document.getElementById("detailsBox");

        box.innerHTML =
            `<div class="card p-3 mt-3 shadow">
<h5><strong>Patient Name:</strong>${patient.patient}<h5>
<p><strong>Diagnosis:</strong> ${patient.diagnosis}</p>
<p><strong>Medicines:</strong> ${patient.meds.join(", ")}</p>
<p><strong>Diet:</strong> ${patient.diet}</p>
<p><strong>Side Effects:</strong> ${patient.sideEffects}</p>
</div>`;

    }
}