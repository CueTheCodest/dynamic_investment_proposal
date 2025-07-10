import React, { useEffect, useState } from "react";
import './App.css';

const word = "Strategies";

// Five example sections for Strategies
const sections = [
  {
    title: "Gross Receipts",
    content: "Offering Cash Back and subscription based services with new incentives greatly increases customer acquisition."
  },
  {
    title: "Capital Management",
    content: "Special software makes generating 38-42% per month, coupled with an investment in credit availability make this a key strategy."
  },
  {
    title: "Positve Equity",
    content: "With no shortage on new and struggling business, gaining equity in exchange for customer and consistency, allows up to increase the value of the equity gained."
  },
  {
    title: "Data Mining",
    content: "Data has more value than, money, gold, crypto, stock, any medium of exchange. Reflex and Enhanced Intelligence technology leverage this data for immense value, within to the trillions."
  },
  {
    title: "SMO Social Media Optimization",
    smoLines: ["SMO Social Media", "Optimization"],
    content: "Social proof of cash back from all customers. Leverage customer testimonials and shared results to build trust and amplify Cash Back Contractors reach."
  }
];

function AnimatedStrategies() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [showPresentation, setShowPresentation] = useState(false);
  const [sectionVisible, setSectionVisible] = useState([false, false, false, false, false]);
  const [sectionLetterCounts, setSectionLetterCounts] = useState([0, 0, 0, 0, 0]);

  // Animate header from left to right
  useEffect(() => {
    setVisibleCount(0);
    const interval = setInterval(() => {
      setVisibleCount((count) => {
        if (count < word.length) return count + 1;
        clearInterval(interval);
        return count;
      });
    }, 120);
    return () => clearInterval(interval);
  }, []);

  // Animate sections one after another, each letter from left to right
  useEffect(() => {
    if (!showPresentation) {
      setSectionVisible([false, false, false, false, false]);
      setSectionLetterCounts([0, 0, 0, 0, 0]);
      return;
    }
    let sectionIdx = 0;
    let letterIdx = 0;
    const timePerLetter = 60;
    const timers = [];

    function animateSection() {
      const title = sections[sectionIdx].title;
      if (letterIdx <= title.length) {
        setSectionLetterCounts((prev) => {
          const updated = [...prev];
          updated[sectionIdx] = letterIdx;
          return updated;
        });
        letterIdx++;
        timers.push(setTimeout(animateSection, timePerLetter));
      } else {
        setSectionVisible((prev) => {
          const updated = [...prev];
          updated[sectionIdx] = true;
          return updated;
        });
        sectionIdx++;
        letterIdx = 0;
        if (sectionIdx < sections.length) {
          timers.push(setTimeout(animateSection, 400));
        }
      }
    }
    animateSection();
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line
  }, [showPresentation]);

  // Helper to animate a string from left to right, letter by letter, with spacing between words
  function AnimatedLTRText({ text, visibleLetters, className }) {
    const chars = text.split("");
    let wordIndices = [];
    let lastSpace = -1;
    // Find the start index of each word
    text.split(" ").forEach((word, idx) => {
      wordIndices.push(lastSpace + 1);
      lastSpace += word.length + 1;
    });

    return (
      <span className={className}>
        {chars.map((char, i) => {
          // Add extra spacing after each word except the last
          const isSpace = char === " ";
          const isWordEnd = isSpace && i !== 0 && i !== chars.length - 1;
          return (
            <span
              key={i}
              style={{
                opacity: i < visibleLetters ? 1 : 0,
                transition: "opacity 0.12s",
                display: "inline-block",
                color: "#fff",
                textShadow:
                  "0 2px 4px #222, 0 0 2px #fff, 0 0 8px #3a3a3a, 2px 2px 0 #222, 0 0 6px #fff",
                marginRight: isWordEnd ? "0.6em" : undefined // Add spacing after each word
              }}
            >
              {char}
            </span>
          );
        })}
      </span>
    );
  }

  // Positioning for each section: 0=top-left, 1=top-right, 2=bottom-left, 3=bottom-right, 4=center
  const sectionPositions = [
    { gridArea: "topleft" },
    { gridArea: "topright" },
    { gridArea: "bottomleft" },
    { gridArea: "bottomright" },
    { gridArea: "center" }
  ];

  return (
    <>
      <h2
        className="tools-heading chalk-animated"
        style={{
          marginTop: 0,
          cursor: "pointer",
          color: "#fff",
          textShadow:
            "0 0 12px #f59e42, 0 0 24px #f59e42, 0 2px 4px #222, 0 0 2px #fff, 0 0 8px #3a3a3a, 2px 2px 0 #222, 0 0 6px #fff"
        }}
        onClick={() => setShowPresentation((prev) => !prev)}
        title="Click to view strategies presentation"
      >
        <span>
          {word.split("").map((char, i) => (
            <span
              key={i}
              style={{
                opacity: i < visibleCount ? 1 : 0,
                transition: "opacity 0.1s",
                display: "inline-block",
                color: "#f59e42",
                textShadow:
                  "0 0 12px #f59e42, 0 0 24px #f59e42, 0 2px 4px #222, 0 0 2px #fff, 0 0 8px #3a3a3a, 2px 2px 0 #222, 0 0 6px #fff"
              }}
            >
              {char}
            </span>
          ))}
        </span>
      </h2>
      {showPresentation && (
        <div
          className="chalkboard-section-grid"
          style={{
            background: "#222",
            color: "#fff",
            borderRadius: "10px",
            padding: "2em 1.5em",
            margin: "1.5em auto",
            maxWidth: 700,
            minHeight: 400,
            boxShadow: "0 0 24px #111",
            fontFamily: "'Permanent Marker', 'Share Tech Mono', 'Consolas', monospace",
            border: "3px solid #fff",
            display: "grid",
            gridTemplateAreas: `
              "topleft topright"
              "center center"
              "bottomleft bottomright"
            `,
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "1fr auto 1fr",
            gap: "1.2em"
          }}
        >
          {sections.map((section, idx) => (
            <div
              key={idx}
              style={{
                ...sectionPositions[idx],
                background: "rgba(30,40,30,0.7)",
                borderRadius: "8px",
                padding: "1.1em 1em",
                margin: 0,
                opacity: sectionVisible[idx] ? 1 : 0.6,
                transition: "opacity 0.5s",
                minHeight: "120px",
                minWidth: 0,
                display: "flex",
                flexDirection: "column"
              }}
            >
              <h3
                style={{
                  color: "#fff",
                  fontFamily: "'Permanent Marker', 'Share Tech Mono', 'Consolas', monospace",
                  fontSize: "1.2em",
                  marginBottom: "0.5em",
                  textShadow:
                    "0 2px 4px #222, 0 0 2px #fff, 0 0 8px #3a3a3a, 2px 2px 0 #222, 0 0 6px #fff"
                }}
              >
                {typeof section.title === "string" ? (
                  <AnimatedLTRText
                    text={section.title}
                    visibleLetters={sectionLetterCounts[idx]}
                    className="chalk-animated"
                  />
                ) : (
                  // For the SMO section, animate each line separately
                  <>
                    <AnimatedLTRText
                      text="SMO Social Media"
                      visibleLetters={sectionLetterCounts[idx] >= 16 ? 16 : sectionLetterCounts[idx]}
                      className="chalk-animated"
                    />
                    <br />
                    <AnimatedLTRText
                      text="Optimization"
                      visibleLetters={sectionLetterCounts[idx] > 16 ? sectionLetterCounts[idx] - 16 : 0}
                      className="chalk-animated"
                    />
                  </>
                )}
              </h3>
              <div
                style={{
                  fontSize: "1.02em",
                  color: "#fff",
                  fontFamily: "'Share Tech Mono', 'Consolas', monospace",
                  borderLeft: "3px solid #fff",
                  paddingLeft: "0.7em",
                  marginTop: "0.2em",
                  textShadow:
                    "0 2px 4px #222, 0 0 2px #fff, 0 0 8px #3a3a3a, 2px 2px 0 #222, 0 0 6px #fff"
                }}
              >
                {section.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default AnimatedStrategies;