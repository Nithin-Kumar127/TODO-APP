import { useEffect, useState, useRef } from "react";

export default function FocusTimer() {
  const [timerMode, setTimerMode] = useState("focus");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const intervalRef = useRef(null);

  const timerModes = {
    focus: { label: "Focus (25 min)", duration: 25 * 60, icon: "🎯" },
    short: { label: "Short Break (5 min)", duration: 5 * 60, icon: "☕" },
    long: { label: "Long Break (15 min)", duration: 15 * 60, icon: "🌴" },
  };

  // Load saved timer state from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem("timerMode");
    const savedTime = localStorage.getItem("timeLeft");
    const savedSessions = localStorage.getItem("sessionsCompleted");

    if (savedMode) setTimerMode(savedMode);
    if (savedTime) setTimeLeft(Number(savedTime));
    if (savedSessions) setSessionsCompleted(Number(savedSessions));
    setIsRunning(false); // never auto-start
  }, []);

  // Save timer state to localStorage
  useEffect(() => {
    localStorage.setItem("timerMode", timerMode);
    localStorage.setItem("timeLeft", timeLeft);
    localStorage.setItem("sessionsCompleted", sessionsCompleted);
  }, [timerMode, timeLeft, sessionsCompleted]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    if (timerMode === "focus") setSessionsCompleted((prev) => prev + 1);
  };

  const handleStart = () => setIsRunning(true);

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(timerModes[timerMode].duration);
  };

  const handleModeChange = (mode) => {
    setTimerMode(mode);
    setTimeLeft(timerModes[mode].duration);
    setIsRunning(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Circular progress calculation
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const progress = ((timerModes[timerMode].duration - timeLeft) /
    timerModes[timerMode].duration) *
    circumference;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        paddingBottom: "50px",
      }}
    >
      <div className="container py-5" style={{ maxWidth: "900px" }}>
        {/* Header */}
        <div className="text-center mb-4">
          <h1
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "36px",
              fontWeight: "700",
              color: "#fff",
              marginBottom: "8px",
              letterSpacing: "-0.5px",
            }}
          >
            Focus Timer
          </h1>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "16px",
              color: "rgba(255,255,255,0.85)",
              marginBottom: 0,
            }}
          >
            Use the Pomodoro Technique to boost your productivity
          </p>
        </div>

        {/* Timer Card */}
        <div
          className="card border-0 mb-4"
          style={{
            borderRadius: "24px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            padding: "48px",
            background: "#fff",
          }}
        >
          {/* Mode Selector */}
          <div className="d-flex justify-content-center gap-3 mb-5">
            {Object.keys(timerModes).map((mode) => (
              <button
                key={mode}
                onClick={() => handleModeChange(mode)}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "14px",
                  fontWeight: "600",
                  padding: "12px 24px",
                  borderRadius: "12px",
                  border: "none",
                  background:
                    timerMode === mode
                      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                      : "#f7fafc",
                  color: timerMode === mode ? "#fff" : "#4a5568",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow:
                    timerMode === mode
                      ? "0 4px 12px rgba(102,126,234,0.3)"
                      : "none",
                }}
              >
                <span style={{ marginRight: "8px" }}>
                  {timerModes[mode].icon}
                </span>
                {timerModes[mode].label}
              </button>
            ))}
          </div>

          {/* Circular Timer Display */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "24px",
            }}
          >
            <svg width="220" height="220">
              <circle
                cx="110"
                cy="110"
                r={radius}
                stroke="#e2e8f0"
                strokeWidth="12"
                fill="transparent"
              />
              <circle
                cx="110"
                cy="110"
                r={radius}
                stroke="url(#gradient)"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - progress}
                strokeLinecap="round"
                transform="rotate(-90 110 110)"
              />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#667eea" />
                  <stop offset="100%" stopColor="#764ba2" />
                </linearGradient>
              </defs>
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dy="0.35em"
                fontSize="36"
                fontWeight="700"
                fill="#1a202c"
                fontFamily="'Inter', sans-serif"
              >
                {formatTime(timeLeft)}
              </text>
            </svg>
          </div>

          {/* Control Buttons */}
          <div className="d-flex justify-content-center gap-3">
            <button
              onClick={isRunning ? () => setIsRunning(false) : handleStart}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "16px",
                fontWeight: "600",
                padding: "16px 48px",
                borderRadius: "14px",
                border: "none",
                background:
                  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              {isRunning ? "⏸ Pause" : "▶ Start"}
            </button>

            <button
              onClick={handleReset}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "16px",
                fontWeight: "600",
                padding: "16px 48px",
                borderRadius: "14px",
                border: "2px solid #e2e8f0",
                background: "#fff",
                color: "#4a5568",
                cursor: "pointer",
              }}
            >
              🔄 Reset
            </button>
          </div>

          {/* Sessions Completed */}
          <div className="mt-5 text-center">
            <h3
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: "22px",
                color: "#1a202c",
              }}
            >
              Today's Progress
            </h3>
            <div
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "16px auto 0",
                boxShadow: "0 8px 24px rgba(102,126,234,0.3)",
              }}
            >
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "56px",
                  fontWeight: "700",
                  color: "#fff",
                }}
              >
                {sessionsCompleted}
              </span>
            </div>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "14px",
                fontWeight: "600",
                color: "#718096",
                marginTop: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Sessions Completed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
