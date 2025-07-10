import React, { useState } from "react";
import './App.css';

function Catalyst() {
  const [showCatalyst, setShowCatalyst] = useState(false);

  return (
    <>
      <h2
        className="catalyst-heading heartbeat"
        style={{
          cursor: 'pointer',
          fontFamily: "'Merriweather Sans', 'Segoe UI', 'Arial', sans-serif"
        }}
        onClick={() => setShowCatalyst((prev) => !prev)}
        title="Click to view The Catalyst"
      >
        Catalyst
      </h2>
      {showCatalyst && (
        <div
          className="catalyst-presentation"
          style={{
            background: '#f5f7fa',
            color: '#22223b',
            borderRadius: '8px',
            padding: '1.5em',
            margin: '1em auto',
            maxWidth: 600,
            boxShadow: '0 0 16px #bfc9d1',
            fontFamily: "'Merriweather Sans', 'Segoe UI', 'Arial', sans-serif",
            textAlign: 'left'
          }}
        >
          <h3 style={{ color: '#22223b', marginTop: 0 }}>
            Catalyst: Technologies & Businesses That Will Implement Reflex and Enhanced Intelligence
          </h3>
          <ul>
            <li>
              <strong>Universal Closer Desktop Edition (The Software)</strong>
              <ul>
                <li>Tone Analysis (In office work)</li>
                <li>Training (gamified practice drills)</li>
                <li>Analyze and refined data (Strengths and weaknesses)</li>
                <li>Admin: Management can adjust the settings for the field reps (in office training)</li>
              </ul>
            </li>
            <li style={{ marginTop: '1em' }}>
              <strong>Cash Back Contractors(The brick and mortar)</strong>
              <ul>
                <li>Mailer Campaigns (Call center reps using Universal Closer Technology)</li>
                <li>Door Hanagers (Field reps using AR Glasses technology)</li>
                <li>Social Media Advertising (SMO, paying customers to share and like our post)</li>
                <li>Referral Programs (Paying customers to refer friends and family)</li>
              </ul>
            </li>
            <li style={{ marginTop: '1em' }}>
              <strong>AR Glasses, Universal Closer Field Edition (The Hardware)</strong>
              <ul>
                <li>Face to Face (Field reps using AR Glasses technology)</li>
                <li>Tone Analysis (Uptones and Downtones)</li>
                <li>Body Language Analysis (Gestures, Posture, Eye Contact)</li>
                <li>Language Translation (Fast and Accurate Translation, Transcription, and Learning)</li>
              </ul>
            </li>
          </ul>
          <p style={{ marginTop: '1.5em' }}>
            <strong>The industry impact:</strong> <br />
            These technologies are catalysts for innovation, efficiency, competitive advantage, and mass adoption across all states.
          </p>
        </div>
      )}
    </>
  );
}

export default Catalyst;