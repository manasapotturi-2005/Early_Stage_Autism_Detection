import React, { useState } from "react";
import "./App.css";

function App() {
  const questions = {
  A1: "Has difficulty adapting to new environments or changes",
  A2: "Has difficulty with imaginative or pretend play",
  A3: "Often does not respond when their name is called",
  A4: "Has difficulty with social interaction",
  A5: "Has difficulty with communication",
  A6: "Pays unusual attention to small details",
  A7: "Is sensitive to sound, light, or touch",
  A8: "Strongly prefers routines and becomes upset with changes",
  A9: "Has difficulty understanding others' emotions",
  A10: "Has difficulty doing more than one task at a time"
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
      const response = await fetch("http://localhost:4000/api/predict", {
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
