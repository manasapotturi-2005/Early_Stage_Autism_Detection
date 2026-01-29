const express = require("express");
const axios = require("axios");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

console.log("Server started...");

// -------------------
// MongoDB Connection
// -------------------
mongoose.connect(
  "mongodb+srv://potturimanasalakshmi_db_user:Manasa%4023@cluster0.4ya7die.mongodb.net/autismDB?retryWrites=true&w=majority&appName=Cluster0"
)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error("MongoDB Error:", err));

// -------------------
// Schema
// -------------------
const ResultSchema = new mongoose.Schema({
  answers: Array,
  prediction: Number,
  createdAt: { type: Date, default: Date.now }
});

const Result = mongoose.model("Result", ResultSchema);

// -------------------
// Routes
// -------------------
app.get("/", (req, res) => {
  res.send("Node backend is running!");
});

app.post("/api/predict", async (req, res) => {
  try {
    console.log("Received features:", req.body.features);

    const flaskResponse = await axios.post(
      "https://autism-ml-api.onrender.com/predict",
      { features: req.body.features }
    );

    const prediction = flaskResponse.data.prediction;

    await Result.create({
      answers: req.body.features,
      prediction: prediction
    });

    res.json({ prediction });

  } catch (error) {
    console.error("Prediction error:", error.message);
    res.status(500).json({ error: "Prediction failed" });
  }
});


// -------------------
app.listen(4000, () => {
  console.log("Backend running on port 4000");
});
