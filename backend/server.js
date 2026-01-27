const express = require("express");
const axios = require("axios");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

console.log("Server file started...");

// -------------------
// MongoDB Connection
// -------------------
mongoose.connect(
  "mongodb+srv://potturimanasalakshmi_db_user:Manasa%4023@cluster0.4ya7die.mongodb.net/autismDB?retryWrites=true&w=majority&appName=Cluster0"
)
.then(() => console.log("MongoDB Connected Successfully"))
.catch(err => {
  console.error("MongoDB Connection Failed ❌");
  console.error(err);
});

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
// Routes (your original logic kept)
// -------------------
app.get("/", (req, res) => {
  res.send("Node backend is running!");
});

app.post("/api/predict", async (req, res) => {
  try {
    const response = await axios.post("http://127.0.0.1:5000/predict", {
      features: req.body.features
    });

    // prediction result from Flask
    const prediction = response.data.prediction;

    // Save to MongoDB (added feature)
    await Result.create({
      answers: req.body.features,
      prediction: prediction
    });

    res.json({ prediction });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Prediction failed" });
  }
});

app.listen(4000, () => {
  console.log("Node backend running on http://localhost:4000");
});
