import { useState, useEffect } from 'react'
import CareerAnalysis from './CareerAnalysis.jsx'
import AIToolsHub from './AIToolsHub.jsx'
import LearningRoadmap from './LearningRoadmap.jsx'
import AITeacher from './AITeacher.jsx'
import Opportunities from './Opportunities.jsx'
import './Dashboard.css'
import StudentProfile from './StudentProfile.jsx';

const steps = [
  { id: 'assessment', number: 1, title: 'Discover Your Career', description: 'Choose a career that matches your interests.', icon: '🎯', color: 'purple' },
  { id: 'roadmap', number: 2, title: 'Your Skill Roadmap', description: 'Explore the skills and AI tools to learn.', icon: '🗺️', color: 'teal' },
  { id: 'classroom', number: 3, title: 'Learn with AI Teacher', description: 'Learn through lessons, examples and notes.', icon: '👨‍🏫', color: 'orange' },
  { id: 'practice', number: 4, title: 'Practice & Evaluation', description: 'Test your understanding with practical tasks.', icon: '⚡', color: 'blue' },
  { id: 'project', number: 5, title: 'Build a Real Project', description: 'Apply your knowledge to a real-world project.', icon: '🚀', color: 'pink' },
  { id: 'opportunities', number: 6, title: 'Explore Opportunities', description: 'Explore relevant jobs and internships.', icon: '💼', color: 'green' },
]

function studentFromUser(user) {
  const meta = user?.user_metadata || {}
  const email = user?.email || ''
  return {
    name: meta.full_name || meta.name || email.split('@')[0] || 'Student',
    email,
    avatar: meta.avatar_url || meta.picture || '',
  }
}

function Dashboard({ user, onGoHome, onLogout, profile: initialProfile }) {
  const student = studentFromUser(user)
  const [view, setView] = useState(
    initialProfile?.careerGoal ? 'roadmap' : 'overview'
  )
  const [studentProfile, setStudentProfile] = useState(initialProfile || null)
  const [selectedCareer, setSelectedCareer] = useState(
    initialProfile?.careerGoal || ''
  )
  const [selectedSkill, setSelectedSkill] = useState('Python')
  const [language, setLanguage] = useState('English')
  const [customCourse, setCustomCourse] = useState('')
  const [completedSteps, setCompletedSteps] = useState([])
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (initialProfile) setStudentProfile(initialProfile)
  }, [initialProfile])

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`navigator-progress-${user?.id || user?.email || 'student'}`)
      if (saved) {
        const data = JSON.parse(saved)
        if (Array.isArray(data.completedSteps)) setCompletedSteps(data.completedSteps)
        if (data.selectedCareer) setSelectedCareer(data.selectedCareer)
        if (data.selectedSkill) setSelectedSkill(data.selectedSkill)
      }
    } catch {
      // Ignore invalid saved progress.
    }
  }, [user?.id, user?.email])

  useEffect(() => {
    try {
      localStorage.setItem(
        `navigator-progress-${user?.id || user?.email || 'student'}`,
        JSON.stringify({ completedSteps, selectedCareer, selectedSkill })
      )
    } catch {
      // Progress remains available for the current session if storage is unavailable.
    }
  }, [completedSteps, selectedCareer, selectedSkill, user?.id, user?.email])

  function openView(id) {
    setView(id)
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function completeStep(id) {
    setCompletedSteps((previous) =>
      previous.includes(id) ? previous : [...previous, id]
    )
  }

  function startCareer(career) {
    setSelectedCareer(career)
    completeStep('assessment')
    openView('roadmap')
  }

  const progress = Math.round((completedSteps.length / steps.length) * 100)

  return (
    <div className="dashboard journey-dashboard">
      <aside className={`dash-sidebar ${menuOpen ? 'open' : ''}`}>
        <button className="dash-brand" type="button" onClick={() => openView('overview')}>
          <span className="dash-mark">A✦</span>
          <span>AI Skill Navigator</span>
        </button>

        <div className="journey-sidebar-label">YOUR LEARNING JOURNEY</div>

        <nav className="dash-nav" aria-label="Learning journey">
          <button
            type="button"
            className={view === 'overview' ? 'active' : ''}
            onClick={() => openView('overview')}
          >
            <span>🏠</span> My Dashboard
          </button>

          {steps.map((step) => (
            <button
              type="button"
              key={step.id}
              className={view === step.id ? 'active' : ''}
              onClick={() => openView(step.id)}
            >
              <span>{step.icon}</span>
              {step.title}
              {completedSteps.includes(step.id) && <span className="journey-check">✓</span>}
            </button>
          ))}
<button
  type="button"
  className={view === 'certificates' ? 'active' : ''}
  onClick={() => openView('certificates')}
>
  <span>🏆</span> Certificates
</button>

          <button
            type="button"
            className={view === 'profile' ? 'active' : ''}
            onClick={() => openView('profile')}
          >
            <span>👤</span> My Profile
          </button>
          <button
  type="button"
  className={view === 'certificates' ? 'active' : ''}
  onClick={() => openView('certificates')}
>
  <span>🏆</span> Certificates
</button>
          <button
            type="button"
            className={view === 'ai-tools' ? 'active' : ''}
            onClick={() => openView('ai-tools')}
          >
            <span>🤖</span> AI Tools Hub
          </button>
        </nav>

        <div className="journey-sidebar-bottom">
          <p>Small steps. Big careers.</p>
          <button className="dash-logout" type="button" onClick={onLogout}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {menuOpen && (
        <button
          type="button"
          className="dash-backdrop"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <main className="dash-main">
        <header className="dash-topbar">
          <button
            className="dash-menu"
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
          >
            ☰ Menu
          </button>

          <div className="journey-heading">
            <p className="dash-kicker">YOUR PERSONAL LEARNING SPACE</p>
            <h1>{view === 'overview' ? `Welcome, ${student.name.split(' ')[0]}!` : getPageTitle(view)}</h1>
          </div>

          <div className="dash-top-actions">
            <label className="language-selector">
              🌐
              <select value={language} onChange={(event) => setLanguage(event.target.value)}>
                <option value="English">English</option>
                <option value="Telugu">తెలుగు</option>
                <option value="Hindi">हिन्दी</option>
                <option value="Tamil">தமிழ்</option>
                <option value="Kannada">ಕನ್ನಡ</option>
                <option value="Malayalam">മലയാളം</option>
              </select>
            </label>

            <button
              className="dash-user-chip"
              type="button"
              onClick={() => openView('profile')}
              title="Open profile"
            >
              {student.avatar ? (
                <img src={student.avatar} alt="" referrerPolicy="no-referrer" />
              ) : (
                <span className="dash-avatar-fallback">
                  {student.name.slice(0, 1).toUpperCase()}
                </span>
              )}
              <div>
                <strong>{student.name}</strong>
                <small>{student.email}</small>
              </div>
            </button>
          </div>
        </header>

        {view === 'overview' && (
          <div className="journey-page">
            <section className="journey-hero">
              <div className="journey-hero-content">
                <span className="journey-pill">✨ YOUR FUTURE STARTS HERE</span>
                <h2>Turn your skills into a career.</h2>
                <p>
                  Follow your personalized learning journey, learn with your AI
                  Teacher, build projects and prepare for real opportunities.
                </p>
                <button
                  className="journey-primary-btn"
                  type="button"
                  onClick={() => openView(
                    completedSteps.length === 0
                      ? 'assessment'
                      : (steps.find((step) => !completedSteps.includes(step.id))?.id || 'opportunities')
                  )}
                >
                  {completedSteps.length === 0 ? 'Discover My Career' : 'Continue My Journey'}
                  <span>→</span>
                </button>
              </div>
              <div className="journey-hero-art" aria-hidden="true">
                <div className="journey-orbit orbit-one" />
                <div className="journey-orbit orbit-two" />
                <div className="journey-hero-emoji">🎓</div>
                <span className="journey-float float-one">💡</span>
                <span className="journey-float float-two">🚀</span>
                <span className="journey-float float-three">✨</span>
              </div>
            </section>

            <section className="journey-progress-panel">
              <div className="journey-progress-heading">
                <div>
                  <p className="dash-kicker">YOUR PROGRESS</p>
                  <h2>One step at a time</h2>
                </div>
                <strong>{progress}%</strong>
              </div>
              <div
                className="journey-progress-track"
                role="progressbar"
                aria-label="Learning journey progress"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <span style={{ width: `${progress}%` }} />
              </div>
              <p>{completedSteps.length} of {steps.length} journey stages marked complete.</p>
            </section>

            <section className="journey-steps-section">
              <div className="journey-section-heading">
                <div>
                  <p className="dash-kicker">YOUR ROADMAP</p>
                  <h2>Follow these steps</h2>
                </div>
                <span className="journey-step-count">{steps.length} stages</span>
              </div>

              <div className="journey-step-list">
                {steps.map((step, index) => {
                  const completed = completedSteps.includes(step.id)
                  const locked = index > 0 && !completedSteps.includes(steps[index - 1].id)

                  return (
                    <article
                      key={step.id}
                      className={`journey-step-card theme-${step.color} ${completed ? 'is-complete' : ''}`}
                      style={{ animationDelay: `${index * 70}ms` }}
                    >
                      <div className="journey-step-icon">{completed ? '✓' : step.icon}</div>
                      <div className="journey-step-copy">
                        <span className="journey-step-label">STEP {step.number}</span>
                        <h3>{step.title}</h3>
                        <p>{step.description}</p>
                      </div>
                      <button
                        type="button"
                        className="journey-step-btn"
                        onClick={() => openView(step.id)}
                      >
                        {completed ? 'Review' : 'Open'}
                        <span>→</span>
                      </button>
                    </article>
                  )
                })}
              </div>
            </section>
          </div>
        )}
{view === 'certificates' && (
  <Opportunities onBack={() => openView('overview')} />
)}
        {view === 'assessment' && (
          <CareerAnalysis
            profile={studentProfile}
            onContinue={startCareer}
          />
        )}

{view === 'roadmap' && (
  <section className="journey-page">
    <LearningRoadmap
      career={selectedCareer}
      onSelectSkill={(skill) => {
        setSelectedSkill(skill)
      }}
    />

    <div className="journey-feature-panel">
      <h2>Ready to Start Learning?</h2>

      <p>
        Your Career: <strong>{selectedCareer}</strong>
      </p>

      <p>
        Your learning roadmap and AI tools are ready.
        Continue to your AI Teacher Classroom to begin
        the lessons step by step.
      </p>

      <button
        type="button"
        className="journey-primary-btn"
        onClick={() => {
          completeStep('roadmap')
          openView('classroom')
        }}
      >
        Continue to Learn →
      </button>
    </div>
  </section>
)}
 
        {view === 'classroom' && (
          <AITeacher
            career={selectedCareer}
            language={language}
            initialSkill={selectedSkill}
          />
        )}

        {view === 'practice' && (
          <section className="journey-feature-panel theme-blue">
            <span className="journey-feature-icon">⚡</span>
            <p className="dash-kicker">STEP 4</p>
            <h2>Practice & Evaluation</h2>
            <p>
              Practice tasks and evaluation will be connected here. Your
              learning progress should be marked complete only after you finish
              the relevant exercises.
            </p>
            <button className="journey-secondary-btn" type="button" onClick={() => openView('classroom')}>
              Return to AI Teacher →
            </button>
          </section>
        )}

        {view === 'project' && (
          <section className="journey-feature-panel theme-pink">
            <span className="journey-feature-icon">🚀</span>
            <p className="dash-kicker">STEP 5</p>
            <h2>Build a Real-World Project</h2>
            <p>
              Complete a practical project to demonstrate your skills.
              Certificate eligibility should be decided after project evaluation.
            </p>
            <button className="journey-secondary-btn" type="button" onClick={() => openView('practice')}>
              Go to Practice →
            </button>
          </section>
        )}
{view === 'certificates' && (
  <Opportunities
  onBack={() => openView('overview')}
  selectedCourse={selectedSkill}
  selectedCareer={selectedCareer}
/>
)}

{view === 'jobs' && (
  <Opportunities onBack={() => openView('overview')} />
)}

{view === 'internships' && (
  <Opportunities onBack={() => openView('overview')} />
)}

{view === 'opportunities' && (
  <Opportunities
    onBack={() => openView('overview')}
  />
)}
        {view === 'profile' && (
          <StudentProfile
            initialProfile={studentProfile}
            onContinue={(profile) => {
              setStudentProfile(profile)
              openView('assessment')
            }}
          />
        )}

        {view === 'ai-tools' && <AIToolsHub />}
      </main>
    </div>
  )
}

function getPageTitle(view) {
  const titles = {
    assessment: 'Discover Your Career',
    roadmap: 'Your Skill Roadmap',
    classroom: 'Learn with AI Teacher',
    practice: 'Practice & Evaluation',
    project: 'Build a Real Project',
    opportunities: 'Jobs & Internships',
    profile: 'My Profile',
    'ai-tools': 'AI Tools Hub',
  }
  return titles[view] || 'AI Skill Navigator'
}

export default Dashboard
