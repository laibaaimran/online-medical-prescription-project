// diet.js

async function showDiet() {
    const diagnosis = document.getElementById("diagnosis").value;

    if (!diagnosis) {
        alert("Enter diagnosis first");
        return;
    }

    try {
        const res = await fetch("/api/diet", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ diagnosis })
        });

        const data = await res.json();

        // DISPLAY IN TABLE FORMAT
        document.getElementById("dietContainer").innerHTML = `
            <div style="margin-top:15px;">
                <h4>AI Diet Plan</h4>
                <table border="1" style="width:100%; text-align:center;">
                    <tr><td>${data.diet}</td></tr>
                </table>
            </div>
        `;

        // SAVE FOR PDF
        document.getElementById("diet").value = data.diet;

    } catch (err) {
        alert("Diet generation failed");
        console.log(err);
    }
}