import { useMemo, useState } from "react";
import { supabase } from './supabaseClient';
const tools = [
  {
    name: "ChatGPT",
    category: "AI Assistant",
    skills: ["Python", "Writing", "Problem Solving"],
    pricing: "Free and Paid",
    description: "An AI assistant for learning, coding, writing and research.",
    about:
      "ChatGPT is an AI assistant that can explain concepts, answer questions and help you develop ideas.",
    uses: ["Learning", "Coding", "Writing", "Research"],
    installation:
      "Open the official website in your browser. You can start using the web version without installing desktop software. Sign in if required.",
    howToUse:
      "Enter your question or instruction in the message box. Explain what you need and ask follow-up questions if necessary.",
    example: "Explain Python loops in simple Telugu with examples.",
    website: "https://chatgpt.com/",
  },
  {
    name: "Google Gemini",
    category: "AI Assistant",
    skills: ["Research", "Python", "Problem Solving"],
    pricing: "Free and Paid",
    description: "Explore ideas, understand concepts and research topics.",
    about:
      "Google Gemini is an AI assistant that helps with questions, explanations, research and creative work.",
    uses: ["Research", "Learning", "Writing", "Idea Generation"],
    installation:
      "Open the official Gemini website in your browser. Follow the sign-in instructions to access the available features.",
    howToUse:
      "Type a question, upload supported content if needed, and review the answer. Verify important information using reliable sources.",
    example: "Explain HTML and CSS differences for a beginner.",
    website: "https://gemini.google.com/",
  },
  {
    name: "Claude",
    category: "AI Assistant",
    skills: ["Python", "Coding", "Writing"],
    pricing: "Free and Paid",
    description: "Understand code, write content and work through problems.",
    about:
      "Claude is an AI assistant useful for understanding documents, writing and reasoning through coding problems.",
    uses: ["Coding", "Writing", "Document Analysis", "Learning"],
    installation:
      "Visit the official website and use the browser version. Follow the available account and access instructions.",
    howToUse:
      "Describe your task clearly. You can paste code or supported text and ask for an explanation or suggestions.",
    example: "Explain this Python function line by line for a beginner.",
    website: "https://claude.ai/",
  },
  {
    name: "Cursor",
    category: "AI Coding",
    skills: ["Python", "JavaScript", "Web Development"],
    pricing: "Free tier and Paid",
    description: "Develop software with AI-assisted coding features.",
    about:
      "Cursor is an AI-assisted code editor that helps developers understand, write and modify code.",
    uses: ["Coding", "Debugging", "Project Development", "Code Explanation"],
    installation:
      "Visit the official Cursor website, download the installer for your operating system, run it and follow the setup instructions.",
    howToUse:
      "Open your project folder in Cursor. Ask its AI features to explain code or help with a specific change. Review generated changes before accepting them.",
    example: "Explain how this React component works without changing any files.",
    website: "https://cursor.com/",
  },
  {
    name: "GitHub",
    category: "Development",
    skills: ["Git", "Coding", "Project Development"],
    pricing: "Free and Paid",
    description: "Store code, track changes and collaborate on projects.",
    about:
      "GitHub is a platform for hosting Git repositories and collaborating on software development.",
    uses: ["Code Hosting", "Version Control", "Collaboration", "Portfolio"],
    installation:
      "You can use GitHub through its official website. Git is a separate tool that you can install if you want to manage repositories from your computer.",
    howToUse:
      "Create a repository, add your project files and use commits to record changes. Never upload passwords, API keys or private credentials.",
    example: "Create a repository for my beginner Python projects.",
    website: "https://github.com/",
  },
  {
    name: "Hugging Face",
    category: "AI Development",
    skills: ["AI/ML", "Python", "Machine Learning"],
    pricing: "Free and Paid",
    description: "Explore AI models, datasets and machine-learning resources.",
    about:
      "Hugging Face provides a platform for discovering and sharing machine-learning models, datasets and applications.",
    uses: ["AI/ML Learning", "Model Discovery", "Datasets", "Experiments"],
    installation:
      "Many resources can be explored in your browser. Some development workflows require Python and relevant libraries installed on your computer.",
    howToUse:
      "Search for a model or dataset, read its documentation and check its license and hardware requirements before using it.",
    example: "Find a beginner-friendly text classification model.",
    website: "https://huggingface.co/",
  },
  {
    name: "Canva",
    category: "Design",
    skills: ["Design", "Presentations", "AI Content Creation"],
    pricing: "Free and Paid",
    description: "Create presentations, posters and visual content.",
    about:
      "Canva is a visual design platform for creating presentations, social media graphics and other designs.",
    uses: ["Presentations", "Posters", "Social Media", "Visual Design"],
    installation:
      "Open Canva in your browser. If you prefer a mobile or desktop application, check the official website for available options.",
    howToUse:
      "Choose a design type or template, edit the text and visual elements, and export your design using the available options.",
    example: "Create a clean presentation cover for an AI project.",
    website: "https://www.canva.com/",
  },
];

const categories = [
  "All",
  "AI Assistant",
  "AI Coding",
  "Development",
  "AI Development",
  "Design",
];

const skillOptions = [
  "Python",
  "JavaScript",
  "Web Development",
  "AI/ML",
  "Git",
  "Design",
  "Writing",
  "Problem Solving",
];

export default function AIToolsHub() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [liveQuery, setLiveQuery] = useState('');
const [liveResults, setLiveResults] = useState([]);
const [liveLoading, setLiveLoading] = useState(false);
const [liveError, setLiveError] = useState('');
  const [activeSection, setActiveSection] = useState("Discover");
  const [selectedSkills, setSelectedSkills] = useState([
    "Python",
    "Web Development",
  ]);
  const [selectedTool, setSelectedTool] = useState(null);
  const searchWebForTools = async (event) => {
    event.preventDefault();
  
    if (!liveQuery.trim()) {
      setLiveError('Please enter a search topic.');
      return;
    }
  
    setLiveLoading(true);
    setLiveError('');
    setLiveResults([]);
  
    try {
      const { data, error } = await supabase.functions.invoke(
        'ai-tools-search',
        {
          body: { query: liveQuery.trim() },
        }
      );
  
      if (error) {
        throw error;
      }
  
      setLiveResults(data?.results ?? []);
    } catch (error) {
      console.error('AI tools search error:', error);
      setLiveError('Search failed. Please try again.');
    } finally {
      setLiveLoading(false);
    }
  };
  const filteredTools = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tools.filter((tool) => {
      const searchableText = [
        tool.name,
        tool.category,
        tool.description,
        tool.about,
        ...tool.skills,
        ...tool.uses,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchableText.includes(query);
      const matchesCategory =
        category === "All" || tool.category === category;
      const matchesSection =
        activeSection === "Discover" ||
        (activeSection === "Free Tools" &&
          tool.pricing.toLowerCase().includes("free")) ||
        (activeSection === "My Skills" &&
          tool.skills.some((skill) => selectedSkills.includes(skill))) ||
        (activeSection === "What's New" && tool.isNew === true) ||
        (activeSection === "Recently Updated" &&
          tool.isUpdated === true);

      return matchesSearch && matchesCategory && matchesSection;
    });
  }, [search, category, activeSection, selectedSkills]);

  function toggleSkill(skill) {
    setSelectedSkills((current) =>
      current.includes(skill)
        ? current.filter((item) => item !== skill)
        : [...current, skill]
    );
  }

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div>
          <div style={styles.eyebrow}>AI SKILL NAVIGATOR / DISCOVERY</div>
          <h1 style={styles.title}>AI Tools Radar ✨</h1>
          <p style={styles.subtitle}>
            Discover AI tools, learn their uses and find out how to get started.
          </p>
        </div>
        <div style={styles.heroIcon}>⌘</div>
      </section>
      <section style={{ padding: '20px', marginBottom: '20px', background: '#f5f7ff', borderRadius: '12px' }}>
  <h2>🔎 Discover AI Tools Online</h2>

  <form onSubmit={searchWebForTools}>
    <input
      type="text"
      value={liveQuery}
      onChange={(e) => setLiveQuery(e.target.value)}
      placeholder="Search AI tools for students..."
      style={{ padding: '12px', width: '70%', maxWidth: '450px' }}
    />

    <button type="submit" disabled={liveLoading} style={{ padding: '12px', marginLeft: '8px' }}>
      {liveLoading ? 'Searching...' : 'Search Web'}
    </button>
  </form>

  {liveError && <p style={{ color: 'red' }}>{liveError}</p>}

  {liveResults.map((item, index) => (
    <article key={item.url || index} style={{ marginTop: '16px', padding: '12px', background: 'white', borderRadius: '8px' }}>
      <h3>{item.title}</h3>
      <p>{item.content}</p>
      <a href={item.url} target="_blank" rel="noreferrer">
        Visit Website ↗
      </a>
    </article>
  ))}
</section>
      <section style={styles.stats}>
        <Stat label="Listed tools" value={tools.length} />
        <Stat label="Categories" value={categories.length - 1} />
        <Stat label="Selected skills" value={selectedSkills.length} />
      </section>

      <nav style={styles.tabs} aria-label="AI tool sections">
        {[
          "Discover",
          "What's New",
          "Recently Updated",
          "Free Tools",
          "My Skills",
        ].map((item) => (
          <button
            key={item}
            onClick={() => {
              setActiveSection(item);
              setSelectedTool(null);
            }}
            style={{
              ...styles.tab,
              ...(activeSection === item ? styles.activeTab : {}),
            }}
          >
            {item}
          </button>
        ))}
      </nav>

      <section style={styles.skillBox}>
        <h2 style={styles.sectionTitle}>🎯 Match tools to my skills</h2>
        <p style={styles.muted}>
          Select skills to see relevant tools from the current catalogue.
        </p>

        <div style={styles.skillList}>
          {skillOptions.map((skill) => (
            <label key={skill} style={styles.skillChip}>
              <input
                type="checkbox"
                checked={selectedSkills.includes(skill)}
                onChange={() => toggleSkill(skill)}
              />
              {skill}
            </label>
          ))}
        </div>
      </section>

      <section style={styles.searchRow}>
        <input
          type="search"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setSelectedTool(null);
          }}
          placeholder="Search listed tools, skills or uses..."
          aria-label="Search AI tools"
          style={styles.search}
        />

        <select
          value={category}
          onChange={(event) => {
            setCategory(event.target.value);
            setSelectedTool(null);
          }}
          aria-label="Filter by category"
          style={styles.select}
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </section>

      {selectedTool && (
        <section style={styles.guide}>
          <div style={styles.guideHeader}>
            <div>
              <span style={styles.category}>{selectedTool.category}</span>
              <h2 style={styles.guideTitle}>
                {selectedTool.name} — Quick Guide
              </h2>
            </div>
            <button
              onClick={() => setSelectedTool(null)}
              style={styles.closeButton}
              aria-label="Close tool guide"
            >
              ✕
            </button>
          </div>

          <h3 style={styles.guideHeading}>📘 About this tool</h3>
          <p style={styles.guideText}>{selectedTool.about}</p>

          <h3 style={styles.guideHeading}>🎯 Main uses</h3>
          <ul style={styles.usesList}>
            {selectedTool.uses.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h3 style={styles.guideHeading}>💻 Installation / Getting started</h3>
          <p style={styles.guideText}>{selectedTool.installation}</p>

          <h3 style={styles.guideHeading}>📖 How to use</h3>
          <p style={styles.guideText}>{selectedTool.howToUse}</p>

          <h3 style={styles.guideHeading}>💡 Example</h3>
          <div style={styles.example}>{selectedTool.example}</div>

          <a
            href={selectedTool.website}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.button}
          >
            Open official website ↗
          </a>
        </section>
      )}

      <div style={styles.resultsHeading}>
        <h2 style={styles.sectionTitle}>{activeSection}</h2>
        <span style={styles.muted}>{filteredTools.length} results</span>
      </div>

      {(activeSection === "What's New" ||
        activeSection === "Recently Updated") && (
        <div style={styles.notice}>
          <strong>Automatic discovery is not connected yet.</strong>
          <p>
            New tools and recent changes need a trusted search source and a
            backend service. This section does not currently fetch live updates.
          </p>
        </div>
      )}

      <section style={styles.grid}>
        {filteredTools.map((tool) => (
          <article key={tool.name} style={styles.card}>
            <div style={styles.cardTop}>
              <span style={styles.toolIcon}>
                {tool.category === "Design"
                  ? "🎨"
                  : tool.category === "Development"
                    ? "💻"
                    : tool.category === "AI Development"
                      ? "🧠"
                      : tool.category === "AI Coding"
                        ? "🧑‍💻"
                        : "🤖"}
              </span>
              <span style={styles.category}>{tool.category}</span>
            </div>

            <h3 style={styles.toolName}>{tool.name}</h3>
            <p style={styles.description}>{tool.description}</p>

            <div style={styles.skillTags}>
              {tool.skills.slice(0, 3).map((skill) => (
                <span key={skill} style={styles.tag}>
                  {skill}
                </span>
              ))}
            </div>

            <p style={styles.pricing}>💳 {tool.pricing}</p>

            <button
              onClick={() => {
                setSelectedTool(tool);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              style={styles.button}
            >
              Learn More
            </button>

            <a
              href={tool.website}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.secondaryButton}
            >
              Official website ↗
            </a>
          </article>
        ))}
      </section>

      {filteredTools.length === 0 && (
        <div style={styles.empty}>
          <strong>No matching tools found in the current catalogue.</strong>
          <p>
            This search only checks the tools included in this component. It
            does not search the entire internet yet.
          </p>
          <p>
            Try another search term or clear the category filter.
          </p>
        </div>
      )}

      <section style={styles.future}>
        <h2 style={styles.sectionTitle}>🔄 Automatic AI Updates</h2>
        <p>
          Planned next: connect a trusted search source, verify tool information,
          and store approved catalogue updates using a backend.
        </p>
        <span style={styles.status}>Discovery engine: Not connected</span>
      </section>

      <p style={styles.footer}>
        This is a starter catalogue. Pricing, availability and features may
        change. Check each official website for the latest information.
      </p>
    </main>
  );
}

function Stat({ label, value }) {
  return (
    <div style={styles.stat}>
      <strong style={styles.statValue}>{value}</strong>
      <span style={styles.statLabel}>{label}</span>
    </div>
  );
}

const styles = {
  page: {
    maxWidth: "1180px",
    margin: "0 auto",
    padding: "26px 20px 40px",
    fontFamily: "Arial, sans-serif",
    color: "#172033",
  },
  hero: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    padding: "30px",
    borderRadius: "22px",
    background: "linear-gradient(120deg, #eef2ff, #f5f3ff, #ecfeff)",
  },
  eyebrow: {
    color: "#5b52c5",
    fontSize: "11px",
    letterSpacing: "1.8px",
    fontWeight: "bold",
  },
  title: {
    fontSize: "clamp(28px, 4vw, 42px)",
    margin: "12px 0",
  },
  subtitle: {
    color: "#596579",
    lineHeight: 1.7,
    maxWidth: "600px",
  },
  heroIcon: {
    fontSize: "50px",
    color: "#5145cd",
    padding: "18px",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.7)",
  },
  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "14px",
    margin: "20px 0",
  },
  stat: {
    padding: "18px",
    border: "1px solid #e4e7ec",
    borderRadius: "14px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  statValue: {
    fontSize: "26px",
    color: "#5145cd",
  },
  statLabel: {
    fontSize: "13px",
    color: "#667085",
  },
  tabs: {
    display: "flex",
    gap: "8px",
    overflowX: "auto",
    padding: "5px 0 14px",
    marginBottom: "12px",
  },
  tab: {
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid #e4e7ec",
    background: "white",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  activeTab: {
    background: "#5145cd",
    borderColor: "#5145cd",
    color: "white",
  },
  skillBox: {
    padding: "20px",
    border: "1px solid #e4e7ec",
    borderRadius: "16px",
    marginBottom: "20px",
  },
  sectionTitle: {
    fontSize: "20px",
    margin: "0",
  },
  muted: {
    color: "#667085",
    fontSize: "13px",
  },
  skillList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "15px",
  },
  skillChip: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    border: "1px solid #e4e7ec",
    borderRadius: "20px",
    padding: "9px 12px",
    fontSize: "13px",
  },
  searchRow: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "22px",
  },
  search: {
    flex: "1",
    minWidth: "220px",
    padding: "13px",
    border: "1px solid #d0d5dd",
    borderRadius: "10px",
    fontSize: "14px",
  },
  select: {
    padding: "13px",
    border: "1px solid #d0d5dd",
    borderRadius: "10px",
    background: "white",
  },
  resultsHeading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
    marginBottom: "15px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "16px",
  },
  card: {
    border: "1px solid #e4e7ec",
    borderRadius: "16px",
    padding: "20px",
    background: "white",
    boxShadow: "0 4px 16px rgba(16,24,40,0.04)",
  },
  cardTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
  },
  toolIcon: {
    fontSize: "26px",
  },
  category: {
    fontSize: "11px",
    color: "#5145cd",
    background: "#f0efff",
    borderRadius: "20px",
    padding: "6px 9px",
  },
  toolName: {
    fontSize: "21px",
    margin: "17px 0 8px",
  },
  description: {
    color: "#596579",
    lineHeight: 1.6,
    minHeight: "48px",
    fontSize: "14px",
  },
  skillTags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    margin: "14px 0",
  },
  tag: {
    padding: "5px 8px",
    background: "#f2f4f7",
    borderRadius: "6px",
    fontSize: "11px",
    color: "#475467",
  },
  pricing: {
    fontSize: "13px",
    color: "#667085",
  },
  button: {
    display: "inline-block",
    marginTop: "10px",
    marginRight: "8px",
    padding: "11px 13px",
    borderRadius: "9px",
    border: "none",
    background: "#5145cd",
    color: "white",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  secondaryButton: {
    display: "inline-block",
    marginTop: "10px",
    padding: "11px 13px",
    borderRadius: "9px",
    border: "1px solid #d0d5dd",
    background: "white",
    color: "#344054",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: "bold",
  },
  guide: {
    padding: "22px",
    marginBottom: "26px",
    border: "1px solid #dcd9ff",
    borderRadius: "16px",
    background: "#f8f9ff",
    lineHeight: 1.7,
  },
  guideHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "12px",
  },
  guideTitle: {
    margin: "14px 0 18px",
    fontSize: "24px",
  },
  closeButton: {
    padding: "8px 12px",
    border: "1px solid #d0d5dd",
    borderRadius: "8px",
    background: "white",
    cursor: "pointer",
  },
  guideHeading: {
    fontSize: "16px",
    margin: "18px 0 6px",
  },
  guideText: {
    color: "#475467",
    lineHeight: 1.7,
    margin: "6px 0",
  },
  usesList: {
    color: "#475467",
    paddingLeft: "22px",
    lineHeight: 1.8,
  },
  example: {
    padding: "14px",
    background: "white",
    border: "1px solid #e4e7ec",
    borderRadius: "10px",
    color: "#344054",
  },
  notice: {
    padding: "18px",
    marginBottom: "20px",
    borderRadius: "12px",
    background: "#fff7e6",
    color: "#8a5200",
    lineHeight: 1.7,
  },
  empty: {
    textAlign: "center",
    padding: "35px 15px",
    color: "#667085",
    border: "1px dashed #d0d5dd",
    borderRadius: "14px",
    lineHeight: 1.7,
  },
  future: {
    marginTop: "28px",
    padding: "22px",
    borderRadius: "16px",
    background: "#f4f3ff",
    color: "#4338a8",
    lineHeight: 1.7,
  },
  status: {
    display: "inline-block",
    marginTop: "8px",
    padding: "7px 10px",
    background: "#e4e7ec",
    color: "#344054",
    borderRadius: "20px",
    fontSize: "12px",
  },
  footer: {
    marginTop: "22px",
    color: "#667085",
    fontSize: "12px",
    lineHeight: 1.6,
  },
};