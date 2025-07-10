// InvestmentLevelsChecklist.jsx
import React from "react";

const levels = [10000, 25000, 50000, 100000];

export default function InvestmentLevelsChecklist({ investmentAmount, setInvestmentAmount }) {
  return (
    <div style={{ marginBottom: "1em" }}>
      <h3 style={{ color: "#39FF14" }}>Investment Levels Checklist</h3>
      {levels.map(level => (
        <label key={level} style={{ marginRight: "1em", color: "#fff" }}>
          <input
            type="radio"
            value={level}
            checked={investmentAmount === level}
            onChange={() => setInvestmentAmount(level)}
            style={{ marginRight: "0.5em" }}
          />
          ${level.toLocaleString()}
        </label>
      ))}
    </div>
  );
}