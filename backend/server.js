//const express = require("express");
import express from "express";
import cors from "cors";
import dietRoutes from "./routes/dietRoutes.js";

import PDFDocument from "pdfkit";
import medicineRoutes from "./routes/medicineRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); //CORS CROSS ORIGIN RESOURCE SHARING 
app.use(express.json());

app.use("/api/diet", dietRoutes); //endpoint for DIET API ROUTER

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "../frontend")));

app.post("api/diet", (req, res) => {
    res.json({ diet: "direct route working" });
});


//const medicineRoutes = require(".routes/medicineRoutes");
app.use("/api/medicines", medicineRoutes); //middleware for prescription api


import fs from "fs";


app.get("/api/medicine/:name", (req, res) => {
    const name = req.params.name.toLowerCase();

    fs.readFile(path.join(__dirname, "data", "medicine.json"), "utf8", (err, data) => {
        if (err) {
            console.log("File error:", err);
            return res.status(500).json({ error: "File read error" });
        }

        const medicines = JSON.parse(data);

        const med = medicines.find(
            m => m.name.toLowerCase() === name
        );

        if (!med) {
            return res.status(404).json({ sideEffects: "Not found" });
        }

        res.json(med);
    });
});



let prescriptions = [];
//POST API (it saves data)
app.post("/api/prescription", (req, res) => {
    const data = req.body;
    prescriptions.push(data);
    console.log("Received Data: ", data);
    res.json({ message: "Prescription saved successfully" });
});

app.get("/api/prescriptions", (req, res) => {
    res.json(prescriptions);
})

//pdf downloader
app.post("/api/prescription/pdf", (req, res) => {
    try {
        console.log("PDF DATA:", req.body);
        const data = req.body;

        const doc = new PDFDocument();

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=prescription.pdf");

        doc.pipe(res);

        doc.fontSize(18).text("Medical Prescription", { align: "center" });
        doc.moveDown();

        doc.text(`Patient: ${data.patient || ""}`);
        doc.text(`Age:${data.age}`);
        doc.text(`Gender:${data.gender}`);
        doc.text(`BP:${data.bp}`);

        doc.moveDown();
        doc.text(`Diagnosis:${data.diagnosis}`);
        doc.moveDown();

        doc.text(`Diet Plan:${data.diet}`);
        doc.text(`Side Effects:${data.sideEffects}`);

        doc.moveDown();

        doc.text("Medicines:");

        if (data.meds && Array.isArray(data.meds)) {
            data.meds.forEach(m => doc.text(`- ${m}`));
        } else {
            doc.text("- No medicines");
        }

        doc.end();

    } catch (err) {
        console.error(err);
        res.status(500).send("Error generating PDF");
    }
});




app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/home.html"));
});



app.listen(PORT, () => {
    console.log(`Server is running on port${PORT}`);
});