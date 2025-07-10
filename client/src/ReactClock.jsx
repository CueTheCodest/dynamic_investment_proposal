import React, { useEffect, useRef, useState } from "react";

export default function ReactClock({ size = 140, minSize = 50, growDuration = 30000 }) {
  const canvasRef = useRef(null);
  const [currentSize, setCurrentSize] = useState(minSize);

  useEffect(() => {
    let animationFrame;
    let start = Date.now();

    function animate() {
      const elapsed = Date.now() - start;
      if (elapsed < growDuration) {
        const progress = elapsed / growDuration;
        const newSize = minSize + (size - minSize) * progress;
        setCurrentSize(newSize);
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCurrentSize(size);
      }
    }

    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [size, minSize, growDuration]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const radius = currentSize / 2;

    function drawClock() {
      ctx.save();
      ctx.clearRect(0, 0, currentSize, currentSize);
      ctx.translate(radius, radius);

      // Draw pie sections with highlight (drawn first, under border and text)
      const sectionSize = (2 * Math.PI) / 3; // 120 degrees per section
      const now = new Date();
      const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
      const angle = (seconds / 30) * 2 * Math.PI;

      // Pie section angles (in radians)
      const sectionAngles = [
        [-Math.PI / 3, Math.PI / 3], // Capital Management (top third, -60deg to +60deg)
        [Math.PI / 3, Math.PI],      // Positive Equity (right third, +60deg to +180deg)
        [Math.PI, (5 * Math.PI) / 3] // Cash Flow (left third, +180deg to +300deg)
      ];

      // Normalize angle to [0, 2PI)
      let normAngle = angle % (2 * Math.PI);
      if (normAngle < 0) normAngle += 2 * Math.PI;

      // Determine which section is active
      let activeSection = 0;
      if (
        (normAngle >= 0 && normAngle < sectionAngles[0][1]) ||
        (normAngle >= sectionAngles[0][0] + 2 * Math.PI && normAngle < 2 * Math.PI) ||
        (normAngle >= sectionAngles[0][0] && normAngle < 0)
      ) {
        activeSection = 0; // Capital Management
      } else if (normAngle >= sectionAngles[1][0] && normAngle < sectionAngles[1][1]) {
        activeSection = 1; // Positive Equity
      } else {
        activeSection = 2; // Cash Flow
      }

      // Draw business model labels
      ctx.font = `${radius * 0.18}px monospace`;
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";

      // Move labels further inwards by reducing the multiplier from 0.78 to 0.60
      // 12 o'clock: Capital Management (top, angle 0)
      ctx.save();
      ctx.rotate(0);
      ctx.translate(0, -radius * 0.60);
      ctx.fillStyle = activeSection === 0 ? "#39FF14" : "#FFD700";
      ctx.shadowColor = activeSection === 0 ? "#39FF14" : "transparent";
      ctx.shadowBlur = activeSection === 0 ? 16 : 0;
      ctx.fillText("Capital", 0, -18);
      ctx.fillText("Management", 0, 2);
      ctx.restore();

      // 4 o'clock: Positive Equity (angle +120deg)
      ctx.save();
      ctx.rotate((2 * Math.PI) / 3);
      ctx.translate(0, -radius * 0.60);
      ctx.rotate(-((2 * Math.PI) / 3));
      ctx.fillStyle = activeSection === 1 ? "#FFD700" : "#FFD700";
      ctx.shadowColor = activeSection === 1 ? "#FFD700" : "transparent";
      ctx.shadowBlur = activeSection === 1 ? 16 : 0;
      ctx.fillText("Positive", 0, -18);
      ctx.fillText("Equity", 0, 2);
      ctx.restore();

      // 8 o'clock: Cash Flow (angle -120deg or +240deg)
      ctx.save();
      ctx.rotate(-(2 * Math.PI) / 3);
      ctx.translate(0, -radius * 0.60);
      ctx.rotate((2 * Math.PI) / 3);
      ctx.fillStyle = activeSection === 2 ? "#00CFFF" : "#FFD700";
      ctx.shadowColor = activeSection === 2 ? "#00CFFF" : "transparent";
      ctx.shadowBlur = activeSection === 2 ? 16 : 0;
      ctx.fillText("Cash", 0, -18);
      ctx.fillText("Flow", 0, 2);
      ctx.restore();

      // Draw spinning hand (full circle in 30s)
      ctx.save();
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.lineWidth = 1; // even thinner hand
      ctx.strokeStyle = "#39FF14";
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -radius * 0.85);
      ctx.stroke();
      ctx.restore();

      ctx.restore();
    }

    drawClock();
    const interval = setInterval(drawClock, 30);
    return () => clearInterval(interval);
  }, [currentSize]);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: "2em",
        zIndex: 10,
        width: currentSize,
        height: currentSize,
        transition: "width 0.2s, height 0.2s",
      }}
    >
      <canvas
        ref={canvasRef}
        width={currentSize}
        height={currentSize}
        style={{
          borderRadius: "50%",
          display: "block",
          margin: "0 auto",
        }}
        aria-label="Business Model Animation"
      />
    </div>
  );
}