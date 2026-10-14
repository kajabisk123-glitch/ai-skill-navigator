import { useState } from "react";

export default function StudentGuide({ onAccept }) {
  const [agreed, setAgreed] = useState(false);

  const instructions = [
    "Register and log in using your account.",
    "Complete your student profile with accurate information.",
    "Choose your career goal based on your interests.",
    "Complete the skill assessment honestly.",
    "Follow your recommended skill roadmap.",
    "Complete practice challenges and assessments.",
    "Track your learning progress and improve your skills.",
    "Check job and internship requirements before applying.",
    "Keep your profile and skills updated.",
    "Use the platform responsibly and provide accurate information."
  ];

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.icon}>📘</div>

        <h1 style={styles.title}>Student Instructions</h1>

        <p style={styles.subtitle}>
          AI Skill Navigator — Please read all instructions carefully
          before continuing.
        </p>

        <div style={styles.instructions}>
          {instructions.map((instruction, index) => (
            <div style={styles.item} key={index}>
              <span style={styles.number}>{index + 1}</span>
              <p>{instruction}</p>
            </div>
          ))}
        </div>

        <label style={styles.agreement}>
          <input
            type="checkbox"
            checked={agreed}
            onChange={(event) => setAgreed(event.target.checked)}
          />

          <span>
            <strong>I have read and agree to follow the Student Instructions.</strong>
          </span>
        </label>

        <button
          style={{
            ...styles.button,
            opacity: agreed ? 1 : 0.5,
            cursor: agreed ? "pointer" : "not-allowed"
          }}
          disabled={!agreed}
          onClick={() => onAccept?.()}
        >
          I Agree & Continue →
        </button>

        {!agreed && (
          <p style={styles.note}>
            Please accept the agreement to continue.
          </p>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #eef2ff, #f5f3ff)",
    padding: "30px 16px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial, sans-serif"
  },
  card: {
    width: "100%",
    maxWidth: "720px",
    background: "#fff",
    borderRadius: "20px",
    padding: "32px",
    boxSizing: "border-box",
    boxShadow: "0 12px 40px rgba(60, 50, 120, 0.12)"
  },
  icon: {
    fontSize: "42px",
    textAlign: "center"
  },
  title: {
    color: "#312e81",
    textAlign: "center",
    fontSize: "30px",
    marginBottom: "10px"
  },
  subtitle: {
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 1.7,
    marginBottom: "28px"
  },
  instructions: {
    display: "grid",
    gap: "12px"
  },
  item: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    padding: "12px",
    background: "#f8faff",
    borderRadius: "10px",
    color: "#374151",
    lineHeight: 1.6
  },
  number: {
    minWidth: "28px",
    height: "28px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#6366f1",
    color: "#fff",
    borderRadius: "50%",
    fontWeight: "bold"
  },
  agreement: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    marginTop: "26px",
    padding: "16px",
    background: "#eef2ff",
    borderRadius: "10px",
    color: "#312e81",
    lineHeight: 1.6,
    cursor: "pointer"
  },
  button: {
    width: "100%",
    marginTop: "20px",
    padding: "15px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "bold"
  },
  note: {
    textAlign: "center",
    fontSize: "13px",
    color: "#6b7280",
    marginTop: "12px"
  }
};