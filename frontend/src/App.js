import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previousScore, setPreviousScore] = useState(null);

  const handleAnalyze = async () => {
    if (!input.trim()) {
      alert("Please enter a plan");
      return;
    }

    try {
      setLoading(true);

      // Store previous score before updating
      if (data && data["Clarity Score"]) {
        setPreviousScore(data["Clarity Score"]);
      }

      const res = await axios.post(
        "https://kalnet-explain-my-plan.onrender.com/analyze",
        { input }
      );

      setData(res.data);
    } catch (err) {
      console.error("ERROR:", err.response?.data || err.message);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Explain My Plan</h1>
      <p>Transform vague ideas into structured, actionable plans</p>

      <textarea
        placeholder="e.g. I want to start a YouTube channel and earn money quickly"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button onClick={handleAnalyze}>
        {loading ? "Analyzing..." : "Analyze Plan"}
      </button>

      <button onClick={() => setData(null)}>New Plan</button>

      {/* Iteration Hint */}
      <p style={{ marginTop: "10px", fontSize: "14px" }}>
        Modify your input and re-run analysis to observe improvements.
      </p>

      {data && (
        <div className="result">
          <h2>Clarity Score</h2>
          <p>{data["Clarity Score"]} / 100</p>

          {/* ✅ Iteration Feature */}
          {previousScore !== null && (
            <p style={{ color: "green" }}>
              Previous Score: {previousScore} → Current Score:{" "}
              {data["Clarity Score"]}
            </p>
          )}

          <h3>🎯 Goal</h3>
          <p>{data.Goal}</p>

          <h3>⚙️ Method / Approach</h3>
          <p>{data.Method}</p>

          <h3>⏳ Timeline</h3>
          <p>{data.Timeline}</p>

          <h3>📋 Steps</h3>
          <ul>
            {data.Steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ul>

          <h3>✨ Simplified Version</h3>
          <p>{data["Simplified Version"]}</p>

          <h3>⚠️ Missing Elements</h3>
          <ul>
            <li>Goal clarity: {data["Missing Elements"]["Goal clarity"]}</li>
            <li>
              Execution steps: {data["Missing Elements"]["Execution steps"]}
            </li>
            <li>Resources: {data["Missing Elements"]["Resources"]}</li>
            <li>Timeline: {data["Missing Elements"]["Timeline"]}</li>
          </ul>

          <h3>🚀 Actionable Steps</h3>
          <ul>
            {data["Actionable Steps"].map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;