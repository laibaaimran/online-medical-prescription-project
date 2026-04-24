import express from "express";
const router = express.Router();

router.post("/", async(req, res) => {
    try {
        console.log("Incoming body:", req.body);

        // ✅ SAFE extraction (no ?, no destructuring)
        let diagnosis = "";
        if (req.body && req.body.diagnosis) {
            diagnosis = req.body.diagnosis;
        } else {
            diagnosis = "general";
        }

        let diet = "";

        // 🔹 TRY AI (optional, may fail silently)
        try {
            const aiRes = await fetch("https://api-inference.huggingface.co/models/google/flan-t5-small", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    inputs: `Give a simple diet plan for ${diagnosis} in breakfast, lunch, dinner`
                })
            });

            const aiData = await aiRes.json();

            if (aiData && aiData.length > 0 && aiData[0].generated_text) {
                diet = aiData[0].generated_text;
            }

        } catch (err) {
            console.log("AI failed, using fallback...");
        }

        // 🔹 FALLBACK (ALWAYS WORKS)
        if (!diet) {
            const d = diagnosis.toLowerCase();

            if (d.includes("fever")) {
                diet = "Breakfast: Warm water, fruits | Lunch: Khichdi | Dinner: Soup | Avoid: Oily food";
            } else if (d.includes("diabetes")) {
                diet = "Breakfast: Oats | Lunch: Chapati + Dal | Dinner: Salad | Avoid: Sugar";
            } else if (d.includes("bp") || d.includes("blood pressure")) {
                diet = "Breakfast: Fruits | Lunch: Low salt diet | Dinner: Soup | Avoid: Salt";
            } else {
                diet = "Breakfast: Milk, fruits | Lunch: Balanced diet | Dinner: Light food";
            }
        }

        // ✅ FINAL RESPONSE
        res.json({ diet });

    } catch (error) {
        console.log("ERROR:", error);
        res.status(500).json({ error: "Diet generation failed" });
    }
});

export default router;