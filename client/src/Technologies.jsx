import React, { useState, useEffect } from "react";
import './App.css';

// Helper to get a date N days from now
function getDateFromNow(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString();
}

function Technologies({ investmentAmount, setInvestmentAmount, payoutAmount, showOneMonthInput }) {
  const [showPresentation, setShowPresentation] = useState(false);
  const [showEnhancedNotes, setShowEnhancedNotes] = useState(false);
  const [showReflexNotes, setShowReflexNotes] = useState(false);

  // SLIDER: days passed (0 to 180)
  const totalDays = 180;
  const [daysPassed, setDaysPassed] = useState(0);

  // Add a state to track if 10X is clicked
  const [tenXClicked, setTenXClicked] = useState(false);

  // Milestones
  const milestones = [
    { day: 0, label: "Milestone 1: Beta version ready" },
    { day: 30, label: "Milestone 2: 600K raised" },
    { day: 30, label: "Milestone 3: Cash Back Contractor Campaign begins" },
    { day: 60, label: "Milestone 4: First campaign goal: 400k in revenue" },
    { day: 90, label: "Milestone 5: Second campaign goal: 4Million in revenue" },
    { day: 120, label: "Milestone 6: Third campaign goal: 400Million in revenue" },
    { day: 150, label: "Milestone 7: Payout 10X and 100X investors", type: "10x" }
  ];
  const completedMilestones = milestones.filter(m => daysPassed >= m.day);

  const parsedInvestment = parseFloat(investmentAmount?.toString().replace(/,/g, "")) || 0;
  const formattedPayoutAmount = parsedInvestment
    ? (parsedInvestment * 1.1).toLocaleString("en-US", { style: "currency", currency: "USD" })
    : "$0.00";

  const showOneMonthMilestone = daysPassed >= 30;

  // When the 10X milestone is reached, allow clicking to jump the slider to the last milestone
  useEffect(() => {
    if (tenXClicked) {
      setDaysPassed(totalDays); // Move slider to the last milestone
      setTenXClicked(false);    // Reset click state
    }
  }, [tenXClicked, totalDays, setDaysPassed]);

  return (
    <>
      <h2
        className="matrix-heading animated-matrix"
        style={{ marginTop: '2em', cursor: 'pointer' }}
        onClick={() => setShowPresentation((prev) => !prev)}
        title="Click to view presentation"
      >
        Technologies
      </h2>
      {showPresentation && (
        <div
          className="tech-presentation"
          style={{
            background: '#111',
            color: '#39FF14',
            borderRadius: '8px',
            padding: '1.5em',
            margin: '1em auto',
            maxWidth: 600,
            boxShadow: '0 0 16px #39FF14',
            fontFamily: "'Share Tech Mono', 'Fira Mono', 'Consolas', monospace",
            textAlign: 'left'
          }}
        >
          <h3 style={{ color: '#39FF14', marginTop: 0 }}>
            Reflex Intelligence + Enhanced Intelligence vs. Artificial Intelligence
          </h3>
          <ul>
            <li style={{ marginTop: '1em' }}>
              <strong>Enhanced Intelligence</strong> <br />
              <span style={{ color: '#baffc9' }}>
                Human intelligence amplified by technology, tools, or collaboration. Actively training the conscious mind for improved decision-making and problem-solving.<br />
                Example: Decision support systems, augmented reality, or teams using advanced analytics.
              </span>
              {/* Only render the following if showOneMonthInput is true */}
              {showOneMonthInput && (
                <div style={{ margin: "1.2em 0" }}>
                  <div style={{ marginBottom: "1em" }}>
                    <label style={{ color: "#39FF14", fontWeight: "bold" }}>
                      1 Month Investment Amount: $
                      <input
                        type="text"
                        value={investmentAmount}
                        onChange={e => setInvestmentAmount(e.target.value)}
                        style={{
                          background: "#232323",
                          color: "#39FF14",
                          border: "1px solid #39FF14",
                          borderRadius: "4px",
                          padding: "0.2em 0.5em",
                          fontFamily: "'Share Tech Mono', monospace",
                          width: "120px"
                        }}
                      />
                    </label>
                  </div>
                  <label style={{ color: "#39FF14", fontWeight: "bold" }}>
                    Days Passed: {daysPassed} ({getDateFromNow(daysPassed)})
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={totalDays}
                    value={daysPassed}
                    onChange={e => setDaysPassed(Number(e.target.value))}
                    style={{
                      width: "100%",
                      accentColor: "#39FF14",
                      marginTop: "0.5em"
                    }}
                  />
                  <div style={{ marginTop: "1em" }}>
                    <strong>Completed Milestones:</strong>
                    <ul>
                      {completedMilestones.length === 0 && <li>None yet</li>}
                      {completedMilestones.map((m, idx) => (
                        <li key={`${m.day}-${idx}`}>
                          {m.label} ({getDateFromNow(m.day)})
                        </li>
                      ))}
                      {/* Gold milestone for 1 month payout */}
                      {showOneMonthMilestone && (
                        <li
                          style={{
                            fontWeight: "bold",
                            color: "#FFD700",
                            fontSize: "1.1em",
                            border: "1px solid #FFD700",
                            borderRadius: "4px",
                            padding: "0.3em 0.7em",
                            marginTop: "0.5em",
                            background: "#222"
                          }}
                        >
                          <span role="img" aria-label="money bag" style={{ marginRight: 8 }}>💰</span>
                          1 Month Payout: {formattedPayoutAmount} on {getDateFromNow(30)}
                        </li>
                      )}
                      {/* 10X Investment Milestone */}
                      {completedMilestones.some(m => m.type === "10x") && (
                        <li
                          style={{
                            fontWeight: "bold",
                            color: "#39FF14",
                            fontSize: "1.1em",
                            border: "1px solid #39FF14",
                            borderRadius: "4px",
                            padding: "0.3em 0.7em",
                            marginTop: "0.5em",
                            background: "#222",
                            cursor: "pointer",
                            textDecoration: "underline"
                          }}
                          onClick={() => setTenXClicked(true)}
                          title="Click to jump to the final milestone"
                        >
                          <span role="img" aria-label="rocket" style={{ marginRight: 8 }}>🚀</span>
                          10X Investment Milestone Reached! (Click to view final payout)
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              )}
              <br />
              <button
                style={{
                  marginTop: '0.7em',
                  background: '#39FF14',
                  color: '#111',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '0.3em 0.8em',
                  fontFamily: "'Share Tech Mono', monospace",
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 0 6px #39FF14'
                }}
                onClick={() => setShowEnhancedNotes((prev) => !prev)}
              >
                {showEnhancedNotes ? "Hide" : "Learn about the Enhanced Intelligence Notes System"}
              </button>
              {showEnhancedNotes && (
                <div style={{
                  marginTop: '1em',
                  background: '#232323',
                  color: '#fff',
                  borderRadius: '6px',
                  padding: '1em',
                  boxShadow: '0 0 8px #39FF14',
                  fontSize: '1em'
                }}>
                  <h4 style={{ color: '#39FF14', marginTop: 0 }}>Enhanced Intelligence Hardware And Software Systems</h4>
                  <div>
                    The Enhanced Intelligence Notes System is a dynamic note-taking platform designed to gauge a user's ability to execute on tasks based on the notes they take.
                  </div>
                  <br />
                  <strong>How it Works:</strong>
                  <ul>
                    <li>Tracks the speed at which the task are completed based on the notes that are taken during a session</li>
                    <li>Analyzes the accuracy of notes compared to task requirements</li>
                    <li>Reverse engineers all processes to determine the optimal execution path</li>
                    <li>Reverse engineers tasks to determine the efficacy of all skillsets by the user</li>
                    <li>Uses historical data to map out optimized growth plans</li>
                  </ul>
                  <strong>Benefit:</strong>
                  <div>
                    Helps users improve their execution skills by measuring and enhancing speed, accuracy, and retention through actionable insights.
                  </div>
                  <br />
                  <strong>How Enhanced Intelligence Works with Reflex Intelligence:</strong>
                  <div>
                    Enhanced Intelligence works with Reflex Intelligence to reverse engineer all processes of plans and skills of the planner/executor.<br />
                    The initial use case is for business and personal productivity, but it will grow to support sports, dance, and all physical activities.
                  </div>
                </div>
              )}
            </li>
            <li style={{ marginTop: '1em' }}>
              <strong>Reflex Intelligence</strong> <br />
              <span style={{ color: '#baffc9' }}>
                Fast, instinctive, and automatic responses based on learned patterns and real-time feedback. Actively training the subconscious mind for improved reactions.<br />
                Example: Human reflexes, or a system that reacts instantly to environmental changes.
              </span>
              <br />
              <button
                style={{
                  marginTop: '0.7em',
                  background: '#39FF14',
                  color: '#111',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '0.3em 0.8em',
                  fontFamily: "'Share Tech Mono', monospace",
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 0 6px #39FF14'
                }}
                onClick={() => setShowReflexNotes((prev) => !prev)}
              >
                {showReflexNotes ? "Hide" : "Learn about the Reflex Intelligence System"}
              </button>
              {showReflexNotes && (
                <div style={{
                  marginTop: '1em',
                  background: '#232323',
                  color: '#fff',
                  borderRadius: '6px',
                  padding: '1em',
                  boxShadow: '0 0 8px #39FF14',
                  fontSize: '1em'
                }}>
                  <h4 style={{ color: '#39FF14', marginTop: 0 }}>Reflex Intelligence System</h4>
                  <div>
                    The Reflex Intelligence System is designed to enhance and measure instinctive, automatic responses through real-time feedback and pattern recognition.
                  </div>
                  <br />
                  <strong>How it Works:</strong>
                  <ul>
                    <li>Monitors user reactions and response times in various scenarios</li>
                    <li>Provides instant feedback to reinforce optimal reflexes</li>
                    <li>Uses repetition and adaptive challenges to improve subconscious performance</li>
                    <li>Tracks progress and identifies areas for further reflex training</li>
                  </ul>
                  <strong>Benefit:</strong>
                  <div>
                    Helps users develop faster, more accurate instinctive responses, improving performance in high-pressure or rapidly changing environments.
                  </div>
                  <br />
                  <strong>Integration:</strong>
                  <div>
                    Reflex Intelligence works in tandem with Enhanced Intelligence, providing a foundation of rapid, automatic skills that support higher-level subconscious decision-making.
                  </div>
                </div>
              )}
            </li>
            <li style={{ marginTop: '1em' }}>
              <strong>Artificial Intelligence</strong> <br />
              <span style={{ color: '#baffc9' }}>
                Machine-based intelligence that simulates human reasoning, learning, and problem-solving.<br />
                Example: Machine learning, neural networks, and autonomous agents.
              </span>
            </li>
          </ul>
          <div style={{ marginTop: '1.5em', fontStyle: 'italic', color: '#fff' }}>
            Reflex + Enhanced Intelligence focus on augmenting or accelerating human capabilities. Analyzing all lines: Life lines, time lines, pipelines, deadlines, finish lines, border lines. Maximizing the usefulness of all lines. Formulating the pros and cons of each line. Maximizing individual and collective leverage.<br />
            <span style={{ color: '#888' }}>
              Artificial Intelligence aims to replicate or surpass human cognition while ignoring the lines and leverage needed to maximize human potential.
            </span>
          </div>
          {/* Add this just below your Technologies Progress slider, before or after your main content */}
          {daysPassed === 0 && (
            <div
              style={{
                background: "#14532d",
                color: "#fff",
                border: "2px solid #22c55e",
                borderRadius: "8px",
                padding: "1em",
                marginBottom: "1em",
                marginTop: "0.5em",
                fontWeight: "bold",
                fontSize: "1.05em",
                boxShadow: "0 0 8px #22c55e"
              }}
            >
              <div>
                <span role="img" aria-label="rocket">🚀</span> Beta Version Complete:
              </div>
              <ul style={{ margin: "0.5em 0 0 1.2em" }}>
                <li>Reflex Intelligence Beta — <span style={{ color: "#FFD700" }}>07/09/2025</span></li>
                <li>Enhanced Intelligence Beta — <span style={{ color: "#FFD700" }}>07/09/2025</span></li>
              </ul>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Technologies;