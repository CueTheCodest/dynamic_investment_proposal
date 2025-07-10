import React, { useState, useEffect, useRef } from "react";
import './App.css'
import axios from 'axios';
import InvestmentLevelsChecklist from "./InvestmentLevelsChecklist";
import Technologies from "./Technologies";
import AnimatedStrategies from './AnimatedStrategies';
import Catalyst from './Catalyst';
import ReactClock from "./ReactClock";

function App() {
  const [levels, setLevels] = useState([]);
  const [checked, setChecked] = useState({
    oneMonthLevel: false,
    tenXLevel: false,
    // ...other levels
  });
  const [amount, setAmount] = useState("");
  const [dailyAmount, setDailyAmount] = useState("");
  const [showTechPresentation, setShowTechPresentation] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState(10000);

  // Value Summary state and logic
  const [showValueSummary, setShowValueSummary] = useState(false);
  const [valueSummaryClosedOnce, setValueSummaryClosedOnce] = useState(false);
  const valueSummaryTimeout = useRef(null);

  // Format date as DD-Month-YYYY (e.g., 05-July-2025)
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const month = monthNames[d.getMonth()];
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Find levels
  const oneMonthLevel = levels.find(lvl => lvl.toLowerCase() === "1 month");
  const dailyLevel = levels.find(lvl => lvl.toLowerCase() === "daily");

  // ROI for 1 Month
  const showRoi =
    oneMonthLevel && checked[oneMonthLevel] && amount && !isNaN(amount.replace(/,/g, ''));

  let startDate = "";
  let roiDate = "";
  let roiAmount = "";

  if (showRoi) {
    const now = new Date();
    startDate = formatDate(now);

    const roi = new Date(now);
    roi.setDate(roi.getDate() + 33); // 33 days from now
    roiDate = formatDate(roi);

    const amt = parseFloat(amount.replace(/,/g, '')) || 0;
    roiAmount = (amt * 1.1).toFixed(2); // ROI = amount + 10%
  }

  // ROI for Daily
  const dailyEnabled = oneMonthLevel && checked[oneMonthLevel];
  const showDaily = dailyLevel && checked[dailyLevel] && dailyEnabled && dailyAmount && !isNaN(dailyAmount.replace(/,/g, ''));

  let dailyStartDate = "";
  let dailyRoiDate = "";
  let dailyRoiAmount = "";
  let payoutCalendar = [];
  let monthlyInvestmentAmount = "";

  if (showDaily) {
    const now = new Date();
    dailyStartDate = formatDate(now);

    // Parse input as daily amount
    const dailyBase = parseFloat(dailyAmount.replace(/,/g, '')) || 0;
    monthlyInvestmentAmount = (dailyBase * 30).toFixed(2);
    dailyRoiAmount = (dailyBase * 1.1).toFixed(2); // Daily payout with 10% ROI

    // First month: show daily investment (original dailyBase)
    // Second month: show daily payout (dailyBase + 10%)
    for (let i = 0; i < 60; i++) {
      const payoutDate = new Date(now);
      payoutDate.setDate(now.getDate() + i);

      if (i < 30) {
        payoutCalendar.push({
          date: formatDate(payoutDate),
          label: "Invest",
          amount: dailyBase.toFixed(2)
        });
      } else {
        payoutCalendar.push({
          date: formatDate(payoutDate),
          label: "Payout",
          amount: dailyRoiAmount
        });
      }
    }
    dailyRoiDate = payoutCalendar[payoutCalendar.length - 1].date;
  }

  const fetchApi = async () => {
    const response = await axios.get('/api');
    setLevels(response.data.levels);
    const initialChecked = {};
    response.data.levels.forEach(level => {
      initialChecked[level] = false;
    });
    setChecked(initialChecked);
  };

  useEffect(() => {
    fetchApi();
  }, []);

  // Only allow one of 1 Month or 10X to be checked at a time
  const handleCheck = (level) => {
    setChecked(prev => {
      // Only allow one of "1 Month" or "10X" to be checked at a time
      if (level === "1 Month") {
        return { ...prev, ["1 Month"]: !prev["1 Month"], ["10X"]: false };
      }
      if (level === "10X") {
        return { ...prev, ["10X"]: !prev["10X"], ["1 Month"]: false };
      }
      // For all other levels, just toggle
      return { ...prev, [level]: !prev[level] };
    });
  };

  const handleAmountChange = (e) => {
    let value = e.target.value.replace(/[^0-9.]/g, '');
    if (value) {
      const parts = value.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      value = parts.join('.');
    }
    setAmount(value);
  };

  const handleDailyAmountChange = (e) => {
    let value = e.target.value.replace(/[^0-9.]/g, '');
    if (value) {
      const parts = value.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      value = parts.join('.');
    }
    setDailyAmount(value);
  };

  const greenShades = [
    '#14532d', // Darkest green
    '#22c55e', // Dark green
    '#86efac', // Light green
    '#dcfce7'  // Lightest green
  ];

  const payoutMultiplier = 1.1; // 10% payout after 1 month
  const payoutAmount = amount
    ? (parseFloat(amount.replace(/,/g, "")) * payoutMultiplier).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    : "$0.00";

  const handleValueSummaryClick = () => {
    setShowValueSummary(true);
    if (valueSummaryTimeout.current) clearTimeout(valueSummaryTimeout.current);
    valueSummaryTimeout.current = setTimeout(() => {
      setShowValueSummary(false);
      setValueSummaryClosedOnce(true);
    }, 10000);
  };

  useEffect(() => {
    return () => {
      if (valueSummaryTimeout.current) clearTimeout(valueSummaryTimeout.current);
    };
  }, []);

  // After your checked state and levels are set:
  const selectedLevel =
    checked["1 Month"] ? "1 Month" :
    checked["10X"] ? "10X" :
    checked["100X"] ? "100X" :
    null;

  // Responsive state
  const [isMobile, setIsMobile] = useState(window.innerWidth < 700);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 700);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Progress sliders for each section
  const [techProgress, setTechProgress] = useState(0);
  const [catalystProgress, setCatalystProgress] = useState(0);
  const [strategiesProgress, setStrategiesProgress] = useState(0);

  // Add the ROI payout date as a milestone before "600k Raise" on each progress bar when 1 Month investment is selected
  const roiPayoutDate = startDate && roiDate ? roiDate : "2025-07-15"; // fallback if not set
  const showRoiMilestone = oneMonthLevel && checked[oneMonthLevel] && roiAmount;

  // Helper to format date as "MMM DD"
  function formatShortDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { month: "short", day: "2-digit" });
  }

  // Helper: milestone structure for each section
  const techMilestones = [
    { label: "Beta Complete", color: "#22c55e" },
    { label: "ROI Payout", color: "#22c55e", isRoi: true },
    { label: "600k Raise", color: "#22c55e" },
    { label: "Launch", color: "#22c55e" },
    { label: "Scale", color: "#22c55e" },
    { label: "Full Release", color: "#22c55e" }
  ];
  const catalystMilestones = [
    { label: "Software Beta", color: "#0ea5e9" },
    { label: "ROI Payout", color: "#0ea5e9", isRoi: true },
    { label: "600k Raise", color: "#0ea5e9" },
    { label: "AR Glasses", color: "#0ea5e9" },
    { label: "Campaigns", color: "#0ea5e9" },
    { label: "National Rollout", color: "#0ea5e9" }
  ];
  const strategiesMilestones = [
    { label: "Capital Management", color: "#f59e42" },
    { label: "ROI Payout", color: "#f59e42", isRoi: true },
    { label: "600k Raise", color: "#f59e42" },
    { label: "Equity", color: "#f59e42" },
    { label: "Data Mining", color: "#f59e42" },
    { label: "SMO", color: "#f59e42" }
  ];

  // Helper: milestone progress points (in percent, adjust as needed)
  const milestonePercents = [0, 15, 35, 60, 80, 100];

  // Helper: get milestone content
  function getMilestoneContent(m, section) {
    if (m.isRoi && showRoiMilestone) {
      return (
        <>
          {roiAmount
            ? parseFloat(roiAmount).toLocaleString("en-US", { style: "currency", currency: "USD" })
            : "$0.00"}
          <br />
          <span style={{ fontSize: "0.85em" }}>
            {formatShortDate(roiPayoutDate)}
          </span>
        </>
      );
    }
    return m.label;
  }

  // Add after your ROI milestone logic:
  const show10XMilestone =
    checked["10X"] &&
    amount &&
    !isNaN(amount.replace(/,/g, "")) &&
    parseFloat(amount.replace(/,/g, "")) >= 50000 &&
    parseFloat(amount.replace(/,/g, "")) <= 99999;

  // Helper for 10X milestone content
  function get10XMilestoneContent() {
    if (!show10XMilestone) return null;
    const amt = parseFloat(amount.replace(/,/g, ""));
    return (
      <>
      Pay Out<br />
      {(amt * 10).toLocaleString("en-US", { style: "currency", currency: "USD" })}
      <br />
      <span style={{ fontSize: "0.85em" }}>10X</span>
    </>
    );
  }

  // Add after your 10X milestone logic:
  const show100XMilestone =
    checked["100X"] &&
    amount &&
    !isNaN(amount.replace(/,/g, "")) &&
    parseFloat(amount.replace(/,/g, "")) >= 100000;

  // Helper for 100X milestone content
  function get100XMilestoneContent() {
    if (!show100XMilestone) return null;
    const amt = parseFloat(amount.replace(/,/g, ""));
    return (
      <>
      Pay Out<br />
      {(amt * 100).toLocaleString("en-US", { style: "currency", currency: "USD" })}
      <br />
      <span style={{ fontSize: "0.85em" }}>100X</span>
    </>
    );
  }

  return (
    <div
      style={{
        fontFamily: "'Share Tech Mono', 'Fira Mono', 'Consolas', monospace",
        background: "#181818",
        minHeight: "100vh",
        color: "#fff",
        padding: isMobile ? "0.5em" : "2em",
        boxSizing: "border-box",
        maxWidth: "100vw",
        overflowX: "hidden"
      }}
    >
      {/* Header with Clock and Title */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          marginBottom: "1.5em",
          marginTop: "1.5em",
          gap: "1.5em"
        }}
      >
        <ReactClock size={140} minSize={50} growDuration={30000} />
        <div style={{ display: "flex", alignItems: "center", flex: 1, justifyContent: "flex-end" }}>
          <h1 style={{
            margin: 0,
            paddingLeft: "2em",
            textAlign: "left",
            whiteSpace: "nowrap"
          }}>
            Investment Proposal
          </h1>
          <button
            style={{
              display: 'block',
              marginLeft: '2em',
              padding: valueSummaryClosedOnce ? '0.3em 0.8em' : '0.7em 1.5em',
              background: '#39FF14',
              color: '#111',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              fontSize: valueSummaryClosedOnce ? '0.95em' : '1.1em',
              boxShadow: '0 0 8px #39FF14',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onClick={handleValueSummaryClick}
            disabled={showValueSummary}
          >
            Value Summary
          </button>
        </div>
      </div>
      {showValueSummary && (
        <div
          style={{
            background: '#222',
            color: '#FFD700',
            border: '2px solid #FFD700',
            borderRadius: '8px',
            padding: '0.5em',
            margin: '0.2em auto',
            display: 'inline-block', // shrink to fit content
            fontSize: '0.95em',
            fontWeight: 'bold',
            boxShadow: '0 0 10px #39FF14',
            textAlign: 'center',
            wordBreak: 'break-word',
            maxWidth: 260 // optional: limit max width for readability
          }}
        >
          Our technology is more advanced than AI. Our businesses (Catalyst) have viral campaigns for mass customer acquisition. Our business strategies are more insulated than our competitors. This is a 500 million dollar per month campaign. Click around, enjoy.
        </div>
      )}
      <div className="card">
        <h2>Investment Level Types</h2>
        {/* Only render 1 Month input if 1 Month is checked */}
        {oneMonthLevel && checked[oneMonthLevel] && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em', marginBottom: '0.5em' }}>
            <label style={{ minWidth: '170px' }}>1 Month Investment Amount: </label>
            <input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0.00"
              style={{ minWidth: '120px' }}
            />
          </div>
        )}
        {showRoi && (
          <div
            style={{
              marginTop: '1em',
              padding: '0.9em 1.2em',
              background: "linear-gradient(135deg, #14532d 60%, #22c55e 100%)",
              borderRadius: '8px',
              color: '#fff',
              border: '2px solid #22c55e',
              boxShadow: '0 0 12px #22c55e',
              fontWeight: 'bold',
              fontSize: '1.08em',
              letterSpacing: '0.01em',
              maxWidth: 340,
              marginLeft: 0,
              marginRight: 0
            }}
          >
            <div style={{ marginBottom: '0.4em' }}>
              <span style={{ color: "#b4f3d6" }}>Start Date:</span>
              <span style={{ marginLeft: 8, color: "#fff", fontWeight: 700 }}>{startDate}</span>
            </div>
            <div style={{ marginBottom: '0.4em' }}>
              <span style={{ color: "#b4f3d6" }}>ROI Date:</span>
              <span style={{ marginLeft: 8, color: "#fff", fontWeight: 700 }}>{roiDate}</span>
            </div>
            <div>
              <span style={{ color: "#b4f3d6" }}>ROI Amount:</span>
              <span style={{ marginLeft: 8, color: "#fff", fontWeight: 700 }}>${roiAmount}</span>
            </div>
          </div>
        )}
        {/* Daily input and output */}
        {dailyEnabled && checked[dailyLevel] && (
          <div style={{ marginTop: '1em' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
              <label style={{ minWidth: '170px' }}>Daily Amount: </label>
              <input
                type="text"
                value={dailyAmount}
                onChange={handleDailyAmountChange}
                placeholder="0.00"
                style={{ minWidth: '120px' }}
              />
            </div>
            {showDaily && (
              <div style={{ marginTop: '1em', padding: '0.5em', background: '#f0fdf4', borderRadius: '4px', color: '#14532d' }}>
                <div><strong>Monthly Investment Amount:</strong> ${monthlyInvestmentAmount}</div>
                <div><strong>Daily Start Date:</strong> {dailyStartDate}</div>
                <div><strong>Daily ROI Date:</strong> {dailyRoiDate}</div>
                <div><strong>Daily ROI Amount:</strong> ${dailyRoiAmount}</div>
                <div style={{ marginTop: '0.5em' }}>
                  <strong>Payout Calendar:</strong>
                  <ul style={{ margin: 0, paddingLeft: '1.2em', maxHeight: '240px', overflowY: 'auto', fontSize: '0.95em' }}>
                    {payoutCalendar.map((p, i) => (
                      <li key={i}>
                        <span style={{ fontWeight: p.label === "Payout" ? "bold" : "normal" }}>
                          {p.date} — {p.label}: ${p.amount}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
        {/* Checkboxes */}
        <div style={{
          marginTop: '2em',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1em',
          justifyContent: isMobile ? 'center' : 'flex-start'
        }}>
          {levels.map((level, index) => {
            const isChecked = checked[level] || false;
            const isTech = level === "1 Month" || level === "10X" || level === "100X";
            const isCatalyst = level.toLowerCase().includes("catalyst");
            const isStrategy = level.toLowerCase().includes("strategy") || level.toLowerCase().includes("smo");
            // Pick a theme color based on section
            let theme = {
              bg: "#232323",
              border: "2px solid #444",
              color: "#fff",
              accent: "#39FF14"
            };
            if (isTech) theme = { bg: "linear-gradient(135deg, #14532d 60%, #22c55e 100%)", border: "2px solid #22c55e", color: "#fff", accent: "#22c55e" };
            if (isCatalyst) theme = { bg: "linear-gradient(135deg, #1e293b 60%, #0ea5e9 100%)", border: "2px solid #0ea5e9", color: "#fff", accent: "#0ea5e9" };
            if (isStrategy) theme = { bg: "linear-gradient(135deg, #222 60%, #f59e42 100%)", border: "2px solid #f59e42", color: "#fff", accent: "#f59e42" };

            // Special logic for disabling
            const isDaily = level.toLowerCase() === "daily";
            const is10X = level === "10X";
            const is100X = level === "100X";
            const disabled =
              (isDaily && !checked["1 Month"]) ||
              (is10X && checked["100X"]) ||
              (is100X && checked["10X"]);

            // Minimums for 10X/100X
            const minAmount = is10X ? 50000 : is100X ? 100000 : 0;
            const maxAmount = is10X ? 99999 : undefined;
            const numericAmount = parseFloat((amount || "").replace(/,/g, "")) || 0;

            return (
              <div
                key={index}
                style={{
                  background: theme.bg,
                  border: theme.border,
                  color: theme.color,
                  borderRadius: '10px',
                  padding: '1em 1.2em',
                  minWidth: isMobile ? 180 : 220,
                  boxShadow: isChecked ? `0 0 16px ${theme.accent}` : "0 0 8px #222",
                  opacity: disabled ? 0.5 : 1,
                  transition: "box-shadow 0.3s, background 0.3s, border 0.3s",
                  position: "relative"
                }}
              >
                <label style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.7em",
                  fontWeight: isChecked ? "bold" : "normal",
                  fontSize: "1.08em",
                  cursor: disabled ? "not-allowed" : "pointer"
                }}>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleCheck(level)}
                    disabled={disabled}
                    style={{
                      width: 22,
                      height: 22,
                      accentColor: theme.accent,
                      borderRadius: "6px",
                      border: `2px solid ${theme.accent}`,
                      boxShadow: isChecked ? `0 0 8px ${theme.accent}` : undefined,
                      marginRight: "0.5em"
                    }}
                  />
                  <span style={{
                    color: isChecked ? theme.accent : theme.color,
                    textShadow: isChecked ? `0 0 8px ${theme.accent}` : undefined,
                    letterSpacing: "0.02em"
                  }}>
                    {level}
                  </span>
                </label>
                {/* Render investment input for 10X and 100X when checked */}
                {(is10X || is100X) && isChecked && (
                  <div style={{ marginTop: '0.7em' }}>
                    <label
                      style={{
                        minWidth: '170px',
                        display: 'block',
                        color: theme.accent,
                        fontWeight: "bold"
                      }}
                    >
                      {level} Investment Amount (Minimum ${minAmount.toLocaleString()}{is10X ? ", Maximum $99,999" : ""}):
                    </label>
                    <input
                      type="text"
                      value={amount}
                      onChange={handleAmountChange}
                      placeholder={minAmount.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                      style={{
                        minWidth: '120px',
                        background: "#181818",
                        color: theme.accent,
                        border: `1.5px solid ${theme.accent}`,
                        borderRadius: "5px",
                        padding: "0.3em 0.7em",
                        fontSize: "1em",
                        marginTop: "0.3em"
                      }}
                    />
                    {amount && (
                      <>
                        {is10X && (numericAmount < 50000 || numericAmount > 99999) && (
                          <div style={{ color: '#FFD700', fontSize: '0.95em', marginTop: '0.2em' }}>
                            10X investment must be between $50,000 and $99,999
                          </div>
                        )}
                        {is100X && numericAmount < 100000 && (
                          <div style={{ color: '#FFD700', fontSize: '0.95em', marginTop: '0.2em' }}>
                            Minimum investment for 100X is $100,000
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
                {/* Show payout if amount is in the correct range */}
                {is10X && isChecked && numericAmount >= 50000 && numericAmount <= 99999 && (
                  <div
                    style={{
                      marginTop: '0.7em',
                      background: '#222',
                      color: '#FFD700',
                      border: '2px solid #FFD700',
                      borderRadius: '6px',
                      padding: '0.7em 1em',
                      fontWeight: 'bold',
                      fontSize: '1.1em',
                      boxShadow: "0 0 8px #FFD700"
                    }}
                  >
                    10X Return: {(numericAmount * 10).toLocaleString("en-US", { style: "currency", currency: "USD" })}
                  </div>
                )}
                {is100X && isChecked && numericAmount >= 100000 && (
                  <div
                    style={{
                      marginTop: '0.7em',
                      background: '#222',
                      color: '#FFD700',
                      border: '2px solid #FFD700',
                      borderRadius: '6px',
                      padding: '0.7em 1em',
                      fontWeight: 'bold',
                      fontSize: '1.1em',
                      boxShadow: "0 0 8px #FFD700"
                    }}
                  >
                    100X Return: {(numericAmount * 100).toLocaleString("en-US", { style: "currency", currency: "USD" })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {/* Technologies Section */}
      <div
        style={{
          margin: isMobile ? "0.5em 0" : "2em 0",
          padding: isMobile ? "0.7em 0.5em" : "1.5em 1em",
          background: "linear-gradient(135deg, #14532d 60%, #22c55e 100%)", // green gradient for Technologies
          borderRadius: "10px",
          boxShadow: "0 0 16px #22c55e",
          maxWidth: isMobile ? "100%" : "700px",
          width: "100%",
          marginLeft: "auto",
          marginRight: "auto",
          border: "2px solid #22c55e"
        }}
      >
        <div style={{ marginBottom: "1em" }}>
          <label style={{ color: "#22c55e", fontWeight: "bold" }}>
            Technologies Progress: {techProgress}%
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={techProgress}
            onChange={e => setTechProgress(Number(e.target.value))}
            style={{
              width: "100%",
              accentColor: "#22c55e",
              marginTop: "0.5em"
            }}
          />
          {/* Technologies Milestones */}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95em", color: "#22c55e", marginTop: "0.3em" }}>
            {techMilestones.map((m, i) => {
              // If ROI milestone, only show if showRoiMilestone
              if (m.isRoi && !showRoiMilestone) return null;
              const isActive = techProgress >= milestonePercents[i];
              return (
                <span
                  key={m.label}
                  style={{
                    color: isActive ? "#fff" : m.color,
                    background: isActive ? m.color : "transparent",
                    borderRadius: "6px",
                    padding: "0.1em 0.5em",
                    fontWeight: isActive ? "bold" : "normal",
                    boxShadow: isActive ? `0 0 8px ${m.color}` : undefined,
                    margin: "0 0.2em",
                    minWidth: 70,
                    textAlign: "center",
                    transition: "all 0.3s"
                  }}
                >
                  {getMilestoneContent(m, "tech")}
                </span>
              );
            })}
            {show10XMilestone && (
              <span
                style={{
                  color: "#fff",
                  background: "#FFD700",
                  borderRadius: "6px",
                  padding: "0.1em 0.5em",
                  fontWeight: "bold",
                  boxShadow: "0 0 8px #FFD700",
                  margin: "0 0.2em",
                  minWidth: 70,
                  textAlign: "center",
                  transition: "all 0.3s"
                }}
              >
                {get10XMilestoneContent()}
              </span>
            )}
            {show100XMilestone && (
              <span
                style={{
                  color: "#fff",
                  background: "#FFD700",
                  borderRadius: "6px",
                  padding: "0.1em 0.5em",
                  fontWeight: "bold",
                  boxShadow: "0 0 8px #FFD700",
                  margin: "0 0.2em",
                  minWidth: 70,
                  textAlign: "center",
                  transition: "all 0.3s"
                }}
              >
                {get100XMilestoneContent()}
              </span>
            )}
          </div>
        </div>
        <Technologies
          investmentAmount={amount}
          setInvestmentAmount={setAmount}
          selectedLevel={selectedLevel}
          isMobile={isMobile}
        />
      </div>
      {/* Catalyst Section */}
      <div
        style={{
          margin: isMobile ? "0.5em 0" : "2em 0",
          padding: isMobile ? "0.7em 0.5em" : "1.5em 1em",
          background: "linear-gradient(135deg, #1e293b 60%, #0ea5e9 100%)", // blue/teal for Catalyst
          borderRadius: "10px",
          boxShadow: "0 0 16px #0ea5e9",
          maxWidth: isMobile ? "100%" : "700px",
          width: "100%",
          marginLeft: "auto",
          marginRight: "auto",
          border: "2px solid #0ea5e9"
        }}
      >
        <div style={{ marginBottom: "1em" }}>
          <label style={{ color: "#0ea5e9", fontWeight: "bold" }}>
            Catalyst Progress: {catalystProgress}%
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={catalystProgress}
            onChange={e => setCatalystProgress(Number(e.target.value))}
            style={{
              width: "100%",
              accentColor: "#0ea5e9",
              marginTop: "0.5em"
            }}
          />
          {/* Catalyst Milestones */}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95em", color: "#0ea5e9", marginTop: "0.3em" }}>
            {catalystMilestones.map((m, i) => {
              if (m.isRoi && !showRoiMilestone) return null;
              const isActive = catalystProgress >= milestonePercents[i];
              return (
                <span
                  key={m.label}
                  style={{
                    color: isActive ? "#fff" : m.color,
                    background: isActive ? m.color : "transparent",
                    borderRadius: "6px",
                    padding: "0.1em 0.5em",
                    fontWeight: isActive ? "bold" : "normal",
                    boxShadow: isActive ? `0 0 8px ${m.color}` : undefined,
                    margin: "0 0.2em",
                    minWidth: 70,
                    textAlign: "center",
                    transition: "all 0.3s"
                  }}
                >
                  {getMilestoneContent(m, "catalyst")}
                </span>
              );
            })}
            {show10XMilestone && (
              <span
                style={{
                  color: "#fff",
                  background: "#FFD700",
                  borderRadius: "6px",
                  padding: "0.1em 0.5em",
                  fontWeight: "bold",
                  boxShadow: "0 0 8px #FFD700",
                  margin: "0 0.2em",
                  minWidth: 70,
                  textAlign: "center",
                  transition: "all 0.3s"
                }}
              >
                {get10XMilestoneContent()}
              </span>
            )}
            {show100XMilestone && (
              <span
                style={{
                  color: "#fff",
                  background: "#FFD700",
                  borderRadius: "6px",
                  padding: "0.1em 0.5em",
                  fontWeight: "bold",
                  boxShadow: "0 0 8px #FFD700",
                  margin: "0 0.2em",
                  minWidth: 70,
                  textAlign: "center",
                  transition: "all 0.3s"
                }}
              >
                {get100XMilestoneContent()}
              </span>
            )}
          </div>
        </div>
        <Catalyst />
      </div>
      {/* Strategies Section */}
      <div
        style={{
          margin: isMobile ? "0.5em 0" : "2em 0",
          padding: isMobile ? "0.7em 0.5em" : "1.5em 1em",
          background: "linear-gradient(135deg, #222 60%, #f59e42 100%)", // orange/gold for Strategies
          borderRadius: "10px",
          boxShadow: "0 0 16px #f59e42",
          maxWidth: isMobile ? "100%" : "700px",
          width: "100%",
          marginLeft: "auto",
          marginRight: "auto",
          border: "2px solid #f59e42"
        }}
      >
        <div style={{ marginBottom: "1em" }}>
          <label style={{ color: "#f59e42", fontWeight: "bold" }}>
            Strategies Progress: {strategiesProgress}%
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={strategiesProgress}
            onChange={e => setStrategiesProgress(Number(e.target.value))}
            style={{
              width: "100%",
              accentColor: "#f59e42",
              marginTop: "0.5em"
            }}
          />
          {/* Strategies Milestones */}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95em", color: "#f59e42", marginTop: "0.3em" }}>
            {strategiesMilestones.map((m, i) => {
              if (m.isRoi && !showRoiMilestone) return null;
              const isActive = strategiesProgress >= milestonePercents[i];
              return (
                <span
                  key={m.label}
                  style={{
                    color: isActive ? "#222" : m.color,
                    background: isActive ? m.color : "transparent",
                    borderRadius: "6px",
                    padding: "0.1em 0.5em",
                    fontWeight: isActive ? "bold" : "normal",
                    boxShadow: isActive ? `0 0 8px ${m.color}` : undefined,
                    margin: "0 0.2em",
                    minWidth: 70,
                    textAlign: "center",
                    transition: "all 0.3s"
                  }}
                >
                  {getMilestoneContent(m, "strategies")}
                </span>
              );
            })}
            {show10XMilestone && (
              <span
                style={{
                  color: "#fff",
                  background: "#FFD700",
                  borderRadius: "6px",
                  padding: "0.1em 0.5em",
                  fontWeight: "bold",
                  boxShadow: "0 0 8px #FFD700",
                  margin: "0 0.2em",
                  minWidth: 70,
                  textAlign: "center",
                  transition: "all 0.3s"
                }}
              >
                {get10XMilestoneContent()}
              </span>
            )}
            {show100XMilestone && (
              <span
                style={{
                  color: "#fff",
                  background: "#FFD700",
                  borderRadius: "6px",
                  padding: "0.1em 0.5em",
                  fontWeight: "bold",
                  boxShadow: "0 0 8px #FFD700",
                  margin: "0 0.2em",
                  minWidth: 70,
                  textAlign: "center",
                  transition: "all 0.3s"
                }}
              >
                {get100XMilestoneContent()}
              </span>
            )}
          </div>
        </div>
        <AnimatedStrategies isMobile={isMobile} />
      </div>
      <footer
        style={{
          textAlign: "center",
          marginTop: isMobile ? "1.5em" : "3em",
          fontSize: isMobile ? "0.95em" : "1.1em",
          color: "#aaa"
        }}
      >
        &copy; {new Date().getFullYear()} Dynamic Investment Proposal
      </footer>
    </div>
  );
}

export default App;
