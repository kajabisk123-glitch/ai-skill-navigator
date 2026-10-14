import { useEffect, useState } from 'react'
import './App.css'
import { supabase } from './supabaseClient'
import Dashboard from './Dashboard.jsx'
import StudentGuide from './StudentGuide'
import Opportunities from './Opportunities.jsx'

const careers = [
  {
    title: 'AI / ML Engineer',
    description: 'Learn Python, machine learning, data and AI tools.',
    skills: ['Python', 'Mathematics', 'Machine Learning'],
  },
  {
    title: 'Full Stack Developer',
    description: 'Build complete web applications from frontend to backend.',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'SQL'],
  },
  {
    title: 'Data Analyst',
    description: 'Understand data and turn it into useful insights.',
    skills: ['Python', 'SQL', 'Statistics', 'Data Visualization'],
  },
  {
    title: 'Cybersecurity Engineer',
    description: 'Learn network security, Linux and ethical security practices.',
    skills: ['Networking', 'Linux', 'Security', 'Python'],
  },
]

const getStorageKey = (userId) => `skill-navigator-${userId}`

function App() {
  const [page, setPage] = useState('welcome')
  const [mode, setMode] = useState('signup')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)
  const [authReady, setAuthReady] = useState(false)

  const [profile, setProfile] = useState({
    college: '',
    degree: 'B.Tech',
    branch: 'CSE',
    year: '3rd Year',
    graduationYear: '',
    skills: '',
    experience: 'Beginner',
    dailyTime: '1 hour',
    careerGoal: '',
  })

  const [language, setLanguage] = useState('English')

  useEffect(() => {
    let active = true

    async function initializeAuth() {
      const { data, error } = await supabase.auth.getSession()

      if (!active) return

      if (error) {
        setMessage(error.message)
      }

      const currentUser = data?.session?.user ?? null
      setUser(currentUser)

      if (currentUser) {
        loadStudentData(currentUser)
      } else {
        setPage('welcome')
      }

      setAuthReady(true)
    }

    initializeAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return

      const currentUser = session?.user ?? null
      setUser(currentUser)

      if (event === 'SIGNED_OUT') {
        setPage('welcome')
        setProfile({
          college: '',
          degree: 'B.Tech',
          branch: 'CSE',
          year: '3rd Year',
          graduationYear: '',
          skills: '',
          experience: 'Beginner',
          dailyTime: '1 hour',
          careerGoal: '',
        })
      } else if (event === 'SIGNED_IN' && currentUser) {
        loadStudentData(currentUser)
      }
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  function loadStudentData(currentUser) {
    setName(
      currentUser.user_metadata?.full_name ||
      currentUser.user_metadata?.name ||
      ''
    )
    setEmail(currentUser.email || '')

    try {
      const saved = localStorage.getItem(getStorageKey(currentUser.id))

      if (saved) {
        const parsed = JSON.parse(saved)
        setProfile((previous) => ({ ...previous, ...parsed.profile }))
        setLanguage(parsed.language || 'English')
        setPage(parsed.page || 'guide')
      } else {
        setPage('guide')
      }
    } catch {
      setPage('guide')
    }
  }

  async function handleAuth(event) {
    event.preventDefault()
    setMessage('')

    if (mode === 'signup' && password !== confirmPassword) {
      setMessage('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
          },
        })

        if (error) throw error

        if (data.user && !data.session) {
          setMessage('Account created. Check your email to confirm your account.')
        } else {
          setMessage('Account created successfully.')
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error
      }
    } catch (error) {
      setMessage(error.message || 'Authentication failed.')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setMessage('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    })

    if (error) setMessage(error.message)
  }

  async function handleLogout() {
    const { error } = await supabase.auth.signOut()

    if (error) {
      setMessage(error.message)
      return
    }
    setUser(null)
    setPage('welcome')
  }

  function saveStudentData(nextPage = 'dashboard') {
    if (!user) return

    const data = {
      profile,
      language,
      page: nextPage,
      updatedAt: new Date().toISOString(),
    }

    localStorage.setItem(getStorageKey(user.id), JSON.stringify(data))
    setPage(nextPage)
  }

  function updateProfile(field, value) {
    setProfile((previous) => ({ ...previous, [field]: value }))
  }

  if (!authReady) {
    return (
      <main className="app-loading">
        <div className="loading-orb">✦</div>
        <h2>AI Skill Navigator</h2>
        <p>Preparing your learning space…</p>
      </main>
    )
  }

  if (user && page === 'guide') {
    return (
      <StudentGuide
        user={user}
        onAccept={() => setPage('profile')}
        onContinue={() => setPage('profile')}
        onNext={() => setPage('profile')}
        onLogout={handleLogout}
      />
    )
  }

  if (user && page === 'profile') {
    return (
      <main className="navigator-page">
        <header className="navigator-header">
          <div className="brand-mark">✦</div>
          <div>
            <h1>Build your learning profile</h1>
            <p>We’ll use this information to personalize your roadmap.</p>
          </div>
          <button className="text-button" onClick={handleLogout}>Log out</button>
        </header>

        <form
          className="navigator-card profile-form"
          onSubmit={(event) => {
            event.preventDefault()
            saveStudentData('language')
          }}
        >
          <div className="section-kicker">YOUR PROFILE</div>
          <h2>Tell us about yourself</h2>

          <div className="form-grid">
            <label>
              Full name
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                required
              />
            </label>

            <label>
              Email
              <input value={email} readOnly />
            </label>

            <label>
              College
              <input
                value={profile.college}
                onChange={(event) => updateProfile('college', event.target.value)}
                placeholder="College name"
                required
              />
            </label>

            <label>
              Degree
              <select
                value={profile.degree}
                onChange={(event) => updateProfile('degree', event.target.value)}
              >
                <option>B.Tech</option>
                <option>B.E.</option>
                <option>B.Sc.</option>
                <option>BCA</option>
                <option>MCA</option>
                <option>Other</option>
              </select>
            </label>

            <label>
              Branch
              <input
                value={profile.branch}
                onChange={(event) => updateProfile('branch', event.target.value)}
                placeholder="e.g. CSE"
                required
              />
            </label>

            <label>
              Current year
              <select
                value={profile.year}
                onChange={(event) => updateProfile('year', event.target.value)}
              >
                <option>1st Year</option>
                <option>2nd Year</option>
                <option>3rd Year</option>
                <option>4th Year</option>
                <option>Graduated</option>
              </select>
            </label>

            <label>
              Graduation year
              <input
                type="number"
                min="2024"
                max="2035"
                value={profile.graduationYear}
                onChange={(event) => updateProfile('graduationYear', event.target.value)}
                placeholder="e.g. 2027"
                required
              />
            </label>

            <label>
              Experience level
              <select
                value={profile.experience}
                onChange={(event) => updateProfile('experience', event.target.value)}
              >
                <option>Beginner</option>
                <option>Basic knowledge</option>
                <option>Intermediate</option>
                <option>Experienced</option>
              </select>
            </label>

            <label>
              Daily learning time
              <select
                value={profile.dailyTime}
                onChange={(event) => updateProfile('dailyTime', event.target.value)}
              >
                <option>30 minutes</option>
                <option>1 hour</option>
                <option>2 hours</option>
                <option>3+ hours</option>
              </select>
            </label>

            <label className="full-width">
              Current skills
              <textarea
                value={profile.skills}
                onChange={(event) => updateProfile('skills', event.target.value)}
                placeholder="e.g. C, Python basics, HTML"
                rows={3}
              />
            </label>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => setPage('guide')}
            >
              Back
            </button>
            <button type="submit" className="primary-button">
              Continue →
            </button>
          </div>
        </form>
      </main>
    )
  }
  if (user && page === 'language') {
    return (
      <main className="navigator-page centered-page">
        <section className="navigator-card language-card">
          <div className="brand-mark large-mark">✦</div>
          <div className="section-kicker">PERSONALIZE YOUR CLASSROOM</div>
          <h1>Choose your learning language</h1>
          <p>Learn in the language that helps you understand concepts best.</p>

          <div className="language-options">
            {['English', 'Telugu'].map((item) => (
              <button
                type="button"
                key={item}
                className={`language-option ${language === item ? 'selected' : ''}`}
                onClick={() => setLanguage(item)}
              >
                <span>{item === 'Telugu' ? 'అ' : 'A'}</span>
                <strong>{item}</strong>
                <small>{item === 'Telugu' ? 'తెలుగులో నేర్చుకోండి' : 'Learn in English'}</small>
              </button>
            ))}
          </div>

          <div className="form-actions">
            <button className="secondary-button" onClick={() => setPage('profile')}>
              Back
            </button>
            <button className="primary-button" onClick={() => saveStudentData('career')}>
              Continue →
            </button>
          </div>
        </section>
      </main>
    )
  }

  if (user && page === 'career') {
    return (
      <main className="navigator-page">
        <header className="navigator-header">
          <div className="brand-mark">✦</div>
          <div>
            <h1>Choose your career direction</h1>
            <p>Start with a goal. You can change it later.</p>
          </div>
        </header>

        <section className="career-grid">
          {careers.map((career) => (
            <button
            className={`career-card ${profile.careerGoal === career.title ? 'selected' : ''}`}
            key={career.title}
            onClick={() => {
              const updatedProfile = {
                ...profile,
                careerGoal: career.title,
              }
          
              setProfile(updatedProfile)
          
              if (!user) return
          
              const data = {
                profile: updatedProfile,
                language,
                page: 'dashboard',
                updatedAt: new Date().toISOString(),
              }
          
              localStorage.setItem(getStorageKey(user.id), JSON.stringify(data))
              setPage('dashboard')
            }}
          >
              <div className="career-icon">✧</div>
              <h2>{career.title}</h2>
              <p>{career.description}</p>
              <div className="skill-tags">
                {career.skills.map((skill) => <span key={skill}>{skill}</span>)}
              </div>
            </button>
          ))}
        </section>

        <div className="center-actions">
  <button
    className="secondary-button"
    onClick={() => setPage('language')}
  >
    ← Back
  </button>
</div>
      </main>
    )
  }
  if (
    user &&
    ['certificates', 'jobs', 'internships'].includes(page)
  ) {
    return (
      <Opportunities
        onBack={() => setPage('dashboard')}
      />
    )
  }
  if (user && page === 'dashboard') {
    return (
      <Dashboard
        user={user}
        profile={profile}
        language={language}
        onLogout={handleLogout}
        onOpenProfile={() => setPage('profile')}
        onOpenCareer={() => setPage('career')}
        onOpenTeacher={() => setPage('classroom')}
      />
    )
  }

  if (user && page === 'classroom') {
    return (
      <main className="navigator-page">
        <header className="navigator-header">
          <div className="brand-mark">✦</div>
          <div>
            <h1>AI Teacher Classroom</h1>
            <p>Your personalized learning session.</p>
          </div>
          <button className="text-button" onClick={() => setPage('dashboard')}>← Dashboard</button>
        </header>

        <section className="navigator-card classroom-intro">
          <div className="section-kicker">YOUR LEARNING GOAL</div>
          <h2>{profile.careerGoal || 'Explore your career'}</h2>
          <p>
            Your teacher should explain each concept step by step, demonstrate examples,
            give practical exercises, and help you understand mistakes.
          </p>
          <button className="primary-button" onClick={() => setPage('dashboard')}>
            Return to dashboard
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="welcome-layout">
      <section className="welcome-panel">
        <div className="welcome-brand">
          <span className="brand-mark">✦</span>
          <span>AI Skill Navigator</span>
        </div>

        <div className="welcome-copy">
          <div className="section-kicker">YOUR FUTURE, YOUR ROADMAP</div>
          <h1>Learn smarter.<br /><span>Build your future.</span></h1>
          <p>
            Personalized learning roadmaps, a teacher that guides you step by step,
            practical projects, and career opportunities in one place.
          </p>

          <div className="welcome-highlights">
            <div><span>✦</span><p><strong>Personalized roadmap</strong><small>Built around your goals</small></p></div>
            <div><span>◈</span><p><strong>Teacher-guided learning</strong><small>Lessons, practice and feedback</small></p></div>
            <div><span>↗</span><p><strong>Career opportunities</strong><small>Prepare for jobs and internships</small></p></div>
          </div>
        </div>

        <div className="welcome-footer">LEARN · PRACTICE · GROW</div>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <div className="auth-mobile-brand">
            <span className="brand-mark">✦</span>
            <strong>AI Skill Navigator</strong>
          </div>

          <div className="section-kicker">
            {mode === 'signup' ? 'START YOUR JOURNEY' : 'WELCOME BACK'}
          </div>
          <h2>{mode === 'signup' ? 'Create your account' : 'Sign in to continue'}</h2>
          <p className="auth-subtitle">
            {mode === 'signup'
              ? 'Your personalized learning journey starts here.'
              : 'Continue your learning journey.'}
          </p>

          <button type="button" className="google-button" onClick={handleGoogle}>
            <span className="google-g">G</span>
            Continue with Google
          </button>

          <div className="divider"><span>or continue with email</span></div>

          <form onSubmit={handleAuth} className="auth-form">
            {mode === 'signup' && (
              <label>
                Full Name
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                />
              </label>
            )}

            <label>
              Email Address
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 6 characters"
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                minLength={6}
                required
              />
            </label>

            {mode === 'signup' && (
              <label>
                Confirm Password
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Re-enter password"
                  minLength={6}
                  required
                />
              </label>
            )}

            {message && <div className="auth-message" role="status">{message}</div>}

            <button type="submit" className="primary-button auth-submit" disabled={loading}>
              {loading
                ? 'Please wait…'
                : mode === 'signup'
                  ? 'Create account →'
                  : 'Sign in →'}
            </button>
          </form>

          <p className="auth-switch">
            {mode === 'signup' ? 'Already have an account?' : 'New to AI Skill Navigator?'}
            {' '}
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'signup' ? 'login' : 'signup')
                setMessage('')
              }}
            >
              {mode === 'signup' ? 'Sign in' : 'Create account'}
            </button>
          </p>
        </div>
      </section>
    </main>
  )
}

export default App