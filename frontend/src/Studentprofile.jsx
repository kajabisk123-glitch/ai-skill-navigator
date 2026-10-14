import { useState } from "react";

export default function StudentProfile({ onContinue, initialProfile }) {
  const [profile, setProfile] = useState(() => ({
    fullName: "",
    age: "",
    location: "",
    college: "",
    degree: "B.Tech",
    branch: "CSE",
    studyYear: "3rd Year",
    skills: [],
    interests: [],
    careerGoal: "",
    experience: "Beginner",
    dailyTime: "1 hour",
    workStyle: "",
    ...initialProfile,
  }));
const updateField = (field, value) => {
setProfile((previous) => ({ ...previous, [field]: value }));
};

const toggleItem = (field, item) => {
setProfile((previous) => ({
...previous,
[field]: previous[field].includes(item)
? previous[field].filter((value) => value !== item)
: [...previous[field], item],
}));
};

const skills = [
"C Programming",
"Python",
"Java",
"HTML/CSS",
"JavaScript",
"SQL",
"AI Tools",
"UI/UX Design",
"No technical skills yet",
];

const interests = [
"Web Development",
"App Development",
"Artificial Intelligence",
"Data Analytics",
"Cybersecurity",
"UI/UX Design",
"AI Content Creation",
"No-code Automation",
];

const submitProfile = (event) => {
event.preventDefault();

if (!profile.fullName.trim()) {
  alert("Please enter your name.");
  return;
}

if (profile.interests.length === 0) {
  alert("Please select at least one interest.");
  return;
}

if (!profile.careerGoal) {
  alert("Please select a career goal option.");
  return;
}

onContinue?.(profile);

};

return (
<div style={styles.page}>
<form style={styles.card} onSubmit={submitProfile}>
<h1 style={styles.title}>Student Profile</h1>
<p style={styles.subtitle}>
Tell us about yourself so we can personalize your career journey.
</p>

    <h2 style={styles.section}>1. Personal Details</h2>

    <label style={styles.label}>Full Name *</label>
    <input
      style={styles.input}
      value={profile.fullName}
      onChange={(e) => updateField("fullName", e.target.value)}
      placeholder="Enter your name"
      required
    />

    <label style={styles.label}>Age</label>
    <input
      style={styles.input}
      type="number"
      min="13"
      max="100"
      value={profile.age}
      onChange={(e) => updateField("age", e.target.value)}
      placeholder="Enter your age"
    />

    <label style={styles.label}>Location</label>
    <input
      style={styles.input}
      value={profile.location}
      onChange={(e) => updateField("location", e.target.value)}
      placeholder="City or district"
    />

    <h2 style={styles.section}>2. Education</h2>

    <label style={styles.label}>College / Institution</label>
    <input
      style={styles.input}
      value={profile.college}
      onChange={(e) => updateField("college", e.target.value)}
      placeholder="Enter college name"
    />

    <label style={styles.label}>Degree</label>
    <select
      style={styles.input}
      value={profile.degree}
      onChange={(e) => updateField("degree", e.target.value)}
    >
      <option>B.Tech</option>
      <option>B.E.</option>
      <option>B.Sc.</option>
      <option>BCA</option>
      <option>MCA</option>
      <option>M.Tech</option>
      <option>Diploma</option>
      <option>Other</option>
    </select>

    <label style={styles.label}>Branch / Department</label>
    <input
      style={styles.input}
      value={profile.branch}
      onChange={(e) => updateField("branch", e.target.value)}
      placeholder="e.g. CSE, ECE"
    />

    <label style={styles.label}>Current Year</label>
    <select
      style={styles.input}
      value={profile.studyYear}
      onChange={(e) => updateField("studyYear", e.target.value)}
    >
      <option>1st Year</option>
      <option>2nd Year</option>
      <option>3rd Year</option>
      <option>4th Year</option>
      <option>Graduated</option>
      <option>Other</option>
    </select>

    <h2 style={styles.section}>3. Current Skills</h2>
    <p style={styles.help}>Select all that apply.</p>

    <div style={styles.options}>
      {skills.map((skill) => (
        <label key={skill} style={styles.option} >
          <input
            type="checkbox"
            checked={profile.skills.includes(skill)}
            onChange={() => toggleItem("skills", skill)}
          />
          {skill}
        </label>
      ))}
    </div>

    <h2 style={styles.section}>4. Interests</h2>
    <p style={styles.help}>What would you like to explore?</p>

    <div style={styles.options}>
      {interests.map((interest) => (
        <label key={interest} style={styles.option}>
          <input
            type="checkbox"
            checked={profile.interests.includes(interest)}
            onChange={() => toggleItem("interests", interest)}
          />
          {interest}
        </label>
      ))}
    </div>

    <h2 style={styles.section}>5. Career Goal</h2>
    <div style={styles.options}>
      {[
        "Frontend Developer",
        "Backend Developer",
        "Full Stack Developer",
        "AI Application Developer",
        "Data Analyst",
        "UI/UX Designer",
        "AI Content Creator",
        "No-code Automation Specialist",
        "I don't know — help me discover",
      ].map((goal) => (
        <label key={goal} style={styles.option}>
          <input
            type="radio"
            name="careerGoal"
            checked={profile.careerGoal === goal}
            onChange={() => updateField("careerGoal", goal)}
          />
          {goal}
        </label>
      ))}
    </div>

    <h2 style={styles.section}>6. Experience Level</h2>
    <select
      style={styles.input}
      value={profile.experience}
      onChange={(e) => updateField("experience", e.target.value)}
    >
      <option>Beginner</option>
      <option>Learning basics</option>
      <option>Built small projects</option>
      <option>Have project experience</option>
      <option>Have internship experience</option>
    </select>

    <h2 style={styles.section}>7. Daily Learning Time</h2>
    <select
      style={styles.input}
      value={profile.dailyTime}
      onChange={(e) => updateField("dailyTime", e.target.value)}
    >
      <option>30 minutes</option>
      <option>1 hour</option>
      <option>2 hours</option>
      <option>3+ hours</option>
    </select>

    <h2 style={styles.section}>8. Preferred Work Style</h2>
    <div style={styles.options}>
      {[
        "Traditional coding",
        "AI-assisted coding",
        "Design and creativity",
        "No-code tools",
        "Not sure yet",
      ].map((style) => (
        <label key={style} style={styles.option}>
          <input
            type="radio"
            name="workStyle"
            checked={profile.workStyle === style}
            onChange={() => updateField("workStyle", style)}
          />
          {style}
        </label>
      ))}
    </div>

    <button type="submit" style={styles.button}>
      Continue to Career Recommendations →
    </button>
  </form>
</div>

);
}

const styles = {
page: {
minHeight: "100vh",
background: "#f1f5f9",
padding: "30px 16px",
fontFamily: "Arial, sans-serif",
},
card: {
maxWidth: "760px",
margin: "0 auto",
background: "#ffffff",
padding: "30px",
borderRadius: "18px",
boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
},
title: {
textAlign: "center",
color: "#1d4ed8",
marginBottom: "8px",
},
subtitle: {
textAlign: "center",
color: "#64748b",
marginBottom: "28px",
lineHeight: 1.6,
},
section: {
color: "#1e293b",
fontSize: "19px",
marginTop: "28px",
marginBottom: "14px",
borderBottom: "1px solid #e2e8f0",
paddingBottom: "8px",
},
label: {
display: "block",
marginTop: "14px",
marginBottom: "7px",
fontWeight: "bold",
color: "#334155",
},
input: {
width: "100%",
boxSizing: "border-box",
padding: "12px",
border: "1px solid #cbd5e1",
borderRadius: "8px",
fontSize: "15px",
background: "#ffffff",
},
help: {
color: "#64748b",
fontSize: "14px",
},
options: {
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
gap: "12px",
marginTop: "12px",
},
option: {
display: "flex",
alignItems: "center",
gap: "9px",
padding: "12px",
border: "1px solid #e2e8f0",
borderRadius: "9px",
color: "#334155",
background: "#f8fafc",
cursor: "pointer",
},
button: {
width: "100%",
marginTop: "32px",
padding: "15px",
border: "none",
borderRadius: "10px",
background: "#2563eb",
color: "#ffffff",
fontSize: "16px",
fontWeight: "bold",
cursor: "pointer",
},
};