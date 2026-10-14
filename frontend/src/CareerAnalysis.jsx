import { useState } from 'react'
import './CareerAnalysis.css'

const careerOptions = [
  { name: 'AI Engineer', icon: '🤖', interest: 'AI', skills: ['Python', 'AI Tools', 'Machine Learning'], color: '#8b5cf6' },
  { name: 'Machine Learning Engineer', icon: '🧠', interest: 'AI', skills: ['Python', 'Statistics', 'Machine Learning'], color: '#7c3aed' },
  { name: 'Full Stack Developer', icon: '💻', interest: 'Web Development', skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Backend'], color: '#0d9488' },
  { name: 'Frontend Developer', icon: '🌐', interest: 'Web Development', skills: ['HTML', 'CSS', 'JavaScript', 'React'], color: '#0891b2' },
  { name: 'Data Analyst', icon: '📊', interest: 'Data Analytics', skills: ['SQL', 'Python', 'Excel', 'Data Visualization'], color: '#d97706' },
  { name: 'Cybersecurity Analyst', icon: '🔐', interest: 'Cybersecurity', skills: ['Networking', 'Linux', 'Security Fundamentals'], color: '#2563eb' },
  { name: 'Game Developer', icon: '🎮', interest: 'Gaming', skills: ['Programming', 'Game Engines', '3D Basics'], color: '#db2777' },
  { name: 'UI/UX Designer', icon: '🎨', interest: 'Design', skills: ['Figma', 'UI Design', 'UX Research'], color: '#e11d48' },
  { name: 'Mobile App Developer', icon: '📱', interest: 'App Development', skills: ['Java or Kotlin', 'Mobile Development', 'APIs'], color: '#059669' },
  { name: 'Cloud Engineer', icon: '☁️', interest: 'Cloud Computing', skills: ['Linux', 'Networking', 'Cloud Platforms'], color: '#4f46e5' },
  { name: 'AI Content Creator', icon: '🎬', interest: 'AI Content Creation', skills: ['AI Content Tools', 'Prompt Writing', 'Video Editing'], color: '#c026d3' },
  { name: 'Robotics Engineer', icon: '🦾', interest: 'Robotics', skills: ['Programming', 'Electronics', 'Robotics'], color: '#475569' },
]

const questions = [
  {
    title: 'What are you interested in?',
    subtitle: 'Choose all areas that interest you.',
    key: 'interests',
    multiple: true,
    options: [
      'AI', 'Web Development', 'Data Analytics', 'Cybersecurity',
      'Gaming', 'Design', 'App Development', 'Cloud Computing',
      'AI Content Creation', 'Robotics',
    ],
  },
  {
    title: 'Which skills do you already know?',
    subtitle: 'Select your current skills. Beginners can choose none.',
    key: 'skills',
    multiple: true,
    options: [
      'Python', 'Java', 'HTML', 'CSS', 'JavaScript', 'SQL',
      'AI Tools', 'Design', 'Networking', 'None yet',
    ],
  },
  {
    title: 'What kind of work do you enjoy?',
    subtitle: 'Choose the type of work you would like to do.',
    key: 'work',
    multiple: true,
    options: [
      'Building applications', 'Solving logical problems',
      'Working with data', 'Designing interfaces',
      'Creating videos and content', 'Protecting systems',
      'Building games or robots', 'Exploring AI tools',
    ],
  },
  {
    title: 'What is your current experience level?',
    subtitle: 'Choose the option that best describes you.',
    key: 'experience',
    multiple: false,
    options: ['Beginner', 'Basic knowledge', 'Intermediate', 'Experienced'],
  },
  {
    title: 'What is your main goal?',
    subtitle: 'This helps us tailor your learning roadmap.',
    key: 'goal',
    multiple: false,
    options: [
      'Get a job', 'Find an internship',
      'Build real-world projects', 'Explore careers first',
    ],
  },
  {
    title: 'How much time can you learn each day?',
    subtitle: 'Choose a realistic daily learning target.',
    key: 'time',
    multiple: false,
    options: ['30 minutes', '1 hour', '2 hours', '3+ hours'],
  },
]

export default function CareerAnalysis({ profile, onContinue }) {
  const [mode, setMode] = useState('choose')
  const [career, setCareer] = useState(profile?.careerGoal || '')
  const [answers, setAnswers] = useState({
    interests: [],
    skills: [],
    work: [],
    experience: '',
    goal: '',
    time: '',
  })
  const [questionIndex, setQuestionIndex] = useState(0)
  const [recommendations, setRecommendations] = useState([])
  const [error, setError] = useState('')

  const toggleAnswer = (key, value, multiple) => {
    setAnswers((previous) => {
      if (!multiple) return { ...previous, [key]: value }

      const current = previous[key]
      if (value === 'None yet') {
        return {
          ...previous,
          [key]: current.includes(value) ? [] : [value],
        }
      }

      const filtered = current.filter((item) => item !== 'None yet')

      return {
        ...previous,
        [key]: filtered.includes(value)
          ? filtered.filter((item) => item !== value)
          : [...filtered, value],
      }
    })
    setError('')
  }

  const submitCareer = (careerName) => {
    const cleanCareer = careerName.trim()

    if (!cleanCareer) {
      setError('Please enter your dream career.')
      return
    }

    if (typeof onContinue !== 'function') {
      setError('Career page is ready, but Dashboard navigation needs to be connected.')
      return
    }

    onContinue(cleanCareer)
  }

  const generateRecommendations = () => {
    if (!answers.interests.length) {
      setError('Please select at least one interest.')
      setQuestionIndex(0)
      return
    }

    if (!answers.experience || !answers.goal || !answers.time) {
      setError('Please answer all questions before continuing.')
      return
    }

    const ranked = careerOptions.map((item) => {
      let score = 0

      if (answers.interests.includes(item.interest)) score += 4

      const matchedSkills = item.skills.filter((skill) =>
        answers.skills.includes(skill),
      ).length

      score += matchedSkills * 2

      const workMap = {
        'Building applications': ['Full Stack Developer', 'Frontend Developer', 'Mobile App Developer'],
        'Solving logical problems': ['AI Engineer', 'Machine Learning Engineer', 'Robotics Engineer'],
        'Working with data': ['Data Analyst', 'Machine Learning Engineer'],
        'Designing interfaces': ['UI/UX Designer', 'Frontend Developer'],
        'Creating videos and content': ['AI Content Creator'],
        'Protecting systems': ['Cybersecurity Analyst'],
        'Building games or robots': ['Game Developer', 'Robotics Engineer'],
        'Exploring AI tools': ['AI Engineer', 'AI Content Creator', 'Machine Learning Engineer'],
      }

      if (
        answers.work.some((work) => workMap[work]?.includes(item.name))
      ) {
        score += 3
      }

      return { ...item, score }
    })

    ranked.sort((a, b) => b.score - a.score)

    const top = ranked.filter((item) => item.score > 0).slice(0, 3)

    setRecommendations(top.length ? top : ranked.slice(0, 3))
    setMode('results')
    setError('')
  }

  const currentQuestion = questions[questionIndex]

  return (
    <main className="career-page">
      <div className="career-progress-heading">
        <span>✦ AI SKILL NAVIGATOR</span>
        <span>{mode === 'questions' ? `QUESTION ${questionIndex + 1} OF ${questions.length}` : 'CAREER DISCOVERY'}</span>
      </div>

      <div className="career-progress-track">
        <span
          style={{
            width: mode === 'questions'
              ? `${((questionIndex + 1) / questions.length) * 100}%`
              : mode === 'results' ? '100%' : '15%',
          }}
        />
      </div>

      <section className="career-hero">
        <div className="career-hero-copy">
          <span className="career-badge">✨ YOUR FUTURE STARTS HERE</span>
          <h1>Discover a career <span>you love.</span></h1>
          <p>
            Know your dream career? Enter it directly. Not sure yet?
            Answer a few questions and explore careers that may suit you.
          </p>
        </div>
        <div className="career-hero-icon" aria-hidden="true">🧭</div>
      </section>

      {mode === 'choose' && (
        <section className="career-panel">
          <h2>🎯 Choose Your Career</h2>
          <p>Type any career name. You are not limited to the examples below.</p>

          <label className="career-label" htmlFor="career-name">
            Your dream career
          </label>
          <input
            id="career-name"
            className="career-input"
            value={career}
            maxLength={100}
            placeholder="e.g. AI Engineer, Robotics Engineer, Game Developer..."
            onChange={(event) => {
              setCareer(event.target.value)
              setError('')
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') submitCareer(career)
            }}
          />

          <button
            className="career-primary-btn"
            type="button"
            onClick={() => submitCareer(career)}
          >
            Continue with My Career <span>→</span>
          </button>

          <div className="career-divider"><span>OR EXPLORE CAREERS</span></div>

          <div className="career-options-grid">
            {careerOptions.slice(0, 6).map((item) => (
              <button
                key={item.name}
                type="button"
                className={`career-option ${career === item.name ? 'active' : ''}`}
                style={{ '--accent': item.color }}
                onClick={() => {
                  setCareer(item.name)
                  setError('')
                }}
              >
                <span className="career-option-icon">{item.icon}</span>
                <span>{item.name}</span>
                <span className="career-option-arrow">↗</span>
              </button>
            ))}
          </div>

          <div className="career-help-card">
            <div className="career-help-icon">🤔</div>
            <div className="career-help-copy">
              <h3>Don't know which career to choose?</h3>
              <p>Answer questions about your interests, skills and goals.</p>
            </div>
            <button
              type="button"
              className="career-secondary-btn"
              onClick={() => {
                setMode('questions')
                setQuestionIndex(0)
                setError('')
              }}
            >
              Find My Career →
            </button>
          </div>

          {error && <p className="career-error" role="alert">{error}</p>}
        </section>
      )}

      {mode === 'questions' && (
        <section className="career-panel career-animated" key={questionIndex}>
          <div className="career-question-number">
            STEP {questionIndex + 1} <span>OF {questions.length}</span>
          </div>

          <h2>{currentQuestion.title}</h2>
          <p>{currentQuestion.subtitle}</p>

          <div className="career-answer-grid">
            {currentQuestion.options.map((option) => {
              const selected = currentQuestion.multiple
                ? answers[currentQuestion.key].includes(option)
                : answers[currentQuestion.key] === option

              return (
                <button
                  key={option}
                  type="button"
                  className={`career-answer ${selected ? 'selected' : ''}`}
                  onClick={() =>
                    toggleAnswer(currentQuestion.key, option, currentQuestion.multiple)
                  }
                >
                  <span className="career-answer-check">
                    {selected ? '✓' : '+'}
                  </span>
                  {option}
                </button>
              )
            })}
          </div>

          {error && <p className="career-error" role="alert">{error}</p>}

          <div className="career-question-actions">
            <button
              type="button"
              className="career-back-btn"
              onClick={() => {
                if (questionIndex === 0) {
                  setMode('choose')
                } else {
                  setQuestionIndex((previous) => previous - 1)
                }
                setError('')
              }}
            >
              ← Back
            </button>

            {questionIndex < questions.length - 1 ? (
              <button
                type="button"
                className="career-primary-btn"
                onClick={() => {
                  const selected = answers[currentQuestion.key]
                  if (!selected.length && currentQuestion.multiple) {
                    setError('Please select at least one option.')
                    return
                  }
                  if (!selected && !currentQuestion.multiple) {
                    setError('Please select an option to continue.')
                    return
                  }
                  setQuestionIndex((previous) => previous + 1)
                  setError('')
                }}
              >
                Next Question →
              </button>
            ) : (
              <button
                type="button"
                className="career-primary-btn"
                onClick={generateRecommendations}
              >
                Find My Careers ✨
              </button>
            )}
          </div>
        </section>
      )}

      {mode === 'results' && (
        <section className="career-panel career-animated">
          <span className="career-badge">✨ YOUR PERSONALIZED SUGGESTIONS</span>
          <h2>Careers worth exploring</h2>
          <p>
            These suggestions are based on your selected interests, skills
            and preferred work. They are guidance, not a guarantee of job fit.
          </p>

          <div className="career-results-grid">
            {recommendations.map((item, index) => (
              <article
                className="career-result-card"
                key={item.name}
                style={{ '--accent': item.color }}
              >
                <div className="career-result-top">
                  <span className="career-result-icon">{item.icon}</span>
                  <span className="career-result-rank">MATCH {index + 1}</span>
                </div>
                <h3>{item.name}</h3>
                <p>Skills to learn</p>
                <div className="career-tags">
                  {item.skills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
                <button
                  type="button"
                  className="career-primary-btn"
                  onClick={() => submitCareer(item.name)}
                >
                  Choose This Career →
                </button>
              </article>
            ))}
          </div>

          <button
            type="button"
            className="career-back-btn"
            onClick={() => setMode('questions')}
          >
            ← Review My Answers
          </button>
          <button
            type="button"
            className="career-text-btn"
            onClick={() => {
              setMode('choose')
              setCareer('')
              setError('')
            }}
          >
            Enter a different career
          </button>

          {error && <p className="career-error" role="alert">{error}</p>}
        </section>
      )}
    </main>
  )
}