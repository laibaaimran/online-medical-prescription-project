function addMed() {
    const div = document.createElement("div");
    div.innerHTML = `<input class="med" placeholder="Medicine"><br>`;
    document.getElementById("meds").appendChild(div);

}

//AUTOMATICALLY FETCHED API SIDE EFFECTS 
async function fetchSideEffects() {
    try {
        const med = document.querySelector(".med").value;

        if (!med) return;

        const res = await fetch(
            `/api/medicines/${encodeURIComponent(med)}` //change 1 for deployment local host to /api/medicines/
        );

        const data = await res.json();

        console.log("API DATA:", data);

        document.getElementById("sideEffects").value =
            data.sideEffects || data.side_effects || "No data";

    } catch (err) {
        console.error("Side effect error:", err);
    }
}




//SUBMIT BUTTON FUNCTION 
function submitData() {
    const data = {
        patient: document.getElementById("patient").value,
        diagnosis: document.getElementById("diagnosis").value,
        age: document.getElementById("age").value,
        gender: document.getElementById("gender").value,
        bp: document.getElementById("bp").value,
        meds: [],
        diet: document.getElementById("diet").value,
        sideEffects: document.getElementById("sideEffects").value,
    };

    document.querySelectorAll(".med").forEach(m => {

        data.meds.push(m.value);
    });


    console.log(data);
    fetch("/api/prescription", { //change 2 for deploy...
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("Server error");
            }
            return res.json();
        })
        .then(response => {
            console.log("Saved:", response);
            alert("Prescription saved successfully");
            downloadPDF(data);
        })
        .catch(err => {
            console.error("ERROR:", err);
            alert("Error saving data");
        });

    //SAVE DATA TO BACKEND

}

function downloadPDF(data) {
    fetch("/api/prescription/pdf", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(response => response.blob())
        .then(blob => {
            const fileURL = URL.createObjectURL(blob);

            const newWindow = window.open();
            newWindow.document.write(
                `<iframe src="${fileURL}" width="100%" height="100%"></iframe>`
            );
        })
        .catch(err => console.error(err));
}