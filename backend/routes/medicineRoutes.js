import express from "express";
import fs from "fs";

const router = express.Router();

router.get("/:name", (req, res) => {
    try {
        const data = fs.readFileSync("./data/medicine.json", "utf8");
        const medicines = JSON.parse(data);

        const med = medicines[req.params.name]; // ✅ ONLY THIS

        if (!med) {
            return res.status(404).json({ message: "Not found" });
        }

        res.json({
            name: req.params.name,
            ...med
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
export default router;