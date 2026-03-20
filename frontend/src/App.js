import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [previousScore, setPreviousScore] = useState(null);
  const [previousInput, setPreviousInput] = useState("");
  const [lastInput, setLastInput] = useState("");

  const handleAnalyze = async () => {
    if (!input.trim()) {
      alert("Please enter a plan");
      return;
    }

    try {
      setLoading(true);

      // ✅ Store previous values BEFORE updating
      if (data) {
        setPreviousScore(data["Clarity Score"]);
        setPreviousInput(lastInput); // correct previous input
      }

      const res = await axios.post(
        "https://kalnet-explain-my-plan.onrender.com/analyze",
        { input }
      );

      setData(res.data);

      // ✅ Save current input for next iteration
      setLastInput(input);

    } catch (err) {
      console.error(err);
      alert("Error analyzing plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="header">
        <h1>Explain My Plan</h1>
        <p>Transform vague ideas into structured, actionable plans</p>
      </div>

      <div className="card">
        <h3>📝 Your Idea or Plan</h3>

        <textarea
          placeholder="e.g., I want to start a YouTube channel..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="buttons">
          <button onClick={handleAnalyze}>
            {loading ? "Analyzing..." : "Analyze Plan"}
          </button>
        </div>

        {data && (
          <>
            <div className="score">
              <h2>Clarity Score</h2>
              <p>{data["Clarity Score"]} / 100</p>

              {/* ✅ ITERATION DISPLAY */}
              {previousScore !== null && (
                <div className="iteration-box">
                  <p><strong>Previous Input:</strong> {previousInput}</p>
                  <p><strong>Current Input:</strong> {input}</p>
                  <p>
                    <strong>Score Improvement:</strong> {previousScore} →{" "}
                    {data["Clarity Score"]}
                  </p>
                </div>
              )}
            </div>

            <div className="grid">
              <div className="box">
                <h3>🎯 Goal</h3>
                <p>{data.Goal}</p>
              </div>

              <div className="box">
                <h3>⚙️ Method</h3>
                <p>{data.Method}</p>
              </div>

              <div className="box">
                <h3>⏳ Timeline</h3>
                <p>{data.Timeline}</p>
              </div>
            </div>

            <div className="box">
              <h3>📋 Steps</h3>
              <ul>
                {data.Steps.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="box">
              <h3>✨ Simplified</h3>
              <p>{data["Simplified Version"]}</p>
            </div>

            <div className="box red">
              <h3>⚠️ Missing Elements</h3>
              <ul>
                <li>{data["Missing Elements"]["Goal clarity"]}</li>
                <li>{data["Missing Elements"]["Execution steps"]}</li>
                <li>{data["Missing Elements"]["Resources"]}</li>
                <li>{data["Missing Elements"]["Timeline"]}</li>
              </ul>
            </div>

            <div className="box yellow">
              <h3>🚀 Actionable Steps</h3>
              <ul>
                {data["Actionable Steps"].map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;