import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!input) return;

    setLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:5000/analyze", {
        input,
      });

      setOutput(res.data);
    } catch (err) {
      console.error("ERROR:", err.response?.data || err.message);
      alert(JSON.stringify(err.response?.data || err.message));
    }

    setLoading(false);
  };

  return (
    <div className="app">
      <div className="header">
        <h1>Explain My Plan</h1>
        <p>Transform vague ideas into structured, actionable plans</p>
      </div>

      <div className="container">
        <h3>📝 Your Idea or Plan</h3>

        <textarea
          placeholder="e.g., I want to start a YouTube channel and earn money quickly..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="buttons">
          <button onClick={handleAnalyze}>
            {loading ? "Analyzing..." : "Analyze Plan"}
          </button>
          <button onClick={() => setInput("")}>New Plan</button>
        </div>

        {output && (
          <div className="results">

            {/* SCORE */}
            <div className="score">
              <h2>Clarity Score</h2>
              <p>{output["Clarity Score"]} / 100</p>
            </div>

            {/* GOAL + METHOD */}
            <div className="grid">
              <div className="card">
                <h3>🎯 Goal</h3>
                <p>{output.Goal}</p>
              </div>

              <div className="card">
                <h3>⚙️ Method/Approach</h3>
                <p>{output.Method}</p>
              </div>
            </div>

            {/* TIMELINE */}
            <div className="card timeline">
              <h3>⏳ Timeline</h3>
              <p>{output.Timeline}</p>
            </div>

            {/* STEPS */}
            <div className="card">
              <h3>📋 Steps</h3>
              <ul>
                {output.Steps.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            {/* SIMPLIFIED */}
            <div className="card simplified">
              <h3>✨ Simplified Version</h3>
              <p>{output["Simplified Version"]}</p>
            </div>

            {/* MISSING */}
            <div className="card missing">
              <h3>⚠️ Missing Elements</h3>
              <ul>
                {Object.entries(output["Missing Elements"]).map(([k, v]) => (
                  <li key={k}>
                    {v}
                  </li>
                ))}
              </ul>
            </div>

            {/* ACTION STEPS */}
            <div className="card action">
              <h3>🚀 Actionable Next Steps</h3>
              <ul>
                {output["Actionable Steps"].map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default App;