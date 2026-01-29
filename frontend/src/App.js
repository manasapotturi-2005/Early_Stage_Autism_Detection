import React, { useState } from "react";
import "./App.css";

function App() {
  const questions = {
    A1: "Notices small sounds when others do not",
    A2: "Focuses more on whole picture than details",
    A3: "Can do more than one thing at once",
    A4: "Understands how others feel easily",
    A5: "Finds it easy to make new friends",
    A6: "Understands jokes easily",
    A7: "Likes doing things in the same way every time",
    A8: "Finds social situations difficult",
    A9: "Notices details others miss",
    A10: "Finds it hard to understand others' intentions"
  };

  const initialState = Object.keys(questions).reduce((acc, key) => {
    acc[key] = "0";
    return acc;
  }, {});

  const [answers, setAnswers] = useState(initialState);
  const [result, setResult] = useState("");

  const handleChange = (e) => {
    setAnswers({ ...answers, [e.target.name]: e.target.value });
  };

  // ✅ ML-based prediction (NO score logic anymore)
  const handleSubmit = async () => {
    const features = Object.values(answers).map(Number);

    try {
      const response = await fetch("https://early-stage-autism-detection.onrender.com/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features })
      });

      const data = await response.json();

      if (data.prediction === 1) {
        setResult("Autism Detected (Positive)");
      } else {
        setResult("No Autism Detected (Negative)");
      }

    } catch (error) {
      setResult("Error connecting to server");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Autism Screening Web App</h1>
        <p style={styles.subtitle}>
          Answer the following questions (Yes / No)
        </p>

        {Object.keys(questions).map((key) => (
          <div key={key} style={styles.questionBox}>
            <label style={styles.label}>
              <b>{key}:</b> {questions[key]}
            </label>
            <select
              name={key}
              value={answers[key]}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="0">No</option>
              <option value="1">Yes</option>
            </select>
          </div>
        ))}

        <button onClick={handleSubmit} style={styles.button}>
          Predict Result
        </button>

        {result && <div style={styles.result}>{result}</div>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f2f6ff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial"
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    width: "600px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
  },
  title: {
    textAlign: "center",
    color: "#2c3e50"
  },
  subtitle: {
    textAlign: "center",
    color: "#555",
    marginBottom: "20px"
  },
  questionBox: {
    marginBottom: "15px"
  },
  label: {
    display: "block",
    marginBottom: "5px"
  },
  select: {
    width: "100%",
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },
  button: {
    width: "100%",
    padding: "10px",
    marginTop: "20px",
    background: "#4a6cf7",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px"
  },
  result: {
    marginTop: "20px",
    padding: "15px",
    background: "#eef3ff",
    borderRadius: "8px",
    fontWeight: "bold",
    textAlign: "center"
  }
};

export default App;
