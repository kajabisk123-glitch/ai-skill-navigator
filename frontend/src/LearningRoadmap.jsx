import { useEffect, useState } from 'react'
import './LearningRoadmap.css'
import { supabase } from './supabaseClient'
const roadmaps = {
  ai: [
    { name: 'ChatGPT', purpose: 'Learn prompting and AI problem-solving.', duration: '2 days', task: 'Create five prompts for an AI application.' },
    { name: 'Gemini', purpose: 'Research and understand AI concepts.', duration: '2 days', task: 'Prepare a structured AI topic summary.' },
    { name: 'Google AI Studio', purpose: 'Experiment with AI models and prompts.', duration: '3 days', task: 'Test three prompts and compare results.' },
    { name: 'Cursor', purpose: 'Build applications with AI-assisted coding.', duration: '4 days', task: 'Build a small working application.' },
    { name: 'Hugging Face', purpose: 'Explore available AI models.', duration: '3 days', task: 'Test a model and document its output.' },
    { name: 'AI Application Project', purpose: 'Combine your learning into a project.', duration: '5 days', task: 'Build and demonstrate an AI application.', project: true }
  ],
  content: [
    { name: 'ChatGPT', purpose: 'Create scripts and content ideas.', duration: '2 days', task: 'Write a short-video script.' },
    { name: 'Gemini', purpose: 'Research topics and develop outlines.', duration: '2 days', task: 'Prepare a researched video outline.' },
    { name: 'Canva AI', purpose: 'Design thumbnails and visual content.', duration: '2 days', task: 'Create a video thumbnail.' },
    { name: 'AI Video Tools', purpose: 'Generate clips from prompts.', duration: '3 days', task: 'Create a short video clip.' },
    { name: 'AI Voice Tools', purpose: 'Explore AI narration.', duration: '2 days', task: 'Create narration for your script.' },
    { name: 'Video Editing', purpose: 'Edit clips and add captions.', duration: '3 days', task: 'Create a complete edited video.' },
    { name: 'Real-World Video Project', purpose: 'Combine your content creation skills.', duration: '5 days', task: 'Submit a finished video project.', project: true }
  ],
  data: [
    { name: 'ChatGPT', purpose: 'Plan data analysis.', duration: '2 days', task: 'Identify questions to investigate in a dataset.' },
    { name: 'Gemini', purpose: 'Understand data and explain findings.', duration: '2 days', task: 'Summarize sample data.' },
    { name: 'Microsoft Copilot', purpose: 'Explore AI-assisted spreadsheets.', duration: '2 days', task: 'Prepare a data report.' },
    { name: 'Julius AI', purpose: 'Explore AI-assisted analysis.', duration: '3 days', task: 'Analyze sample data and create a chart.' },
    { name: 'Power BI', purpose: 'Create dashboards and visualizations.', duration: '3 days', task: 'Build a simple dashboard.' },
    { name: 'Data Analysis Project', purpose: 'Apply your skills to a real question.', duration: '5 days', task: 'Submit a report with charts and findings.', project: true }
  ],
  web: [
    { name: 'ChatGPT', purpose: 'Plan websites and learn frontend concepts.', duration: '2 days', task: 'Write a website specification.' },
    { name: 'Gemini', purpose: 'Research ideas and troubleshoot code.', duration: '2 days', task: 'Prepare a website plan.' },
    { name: 'Figma AI', purpose: 'Explore interface design.', duration: '2 days', task: 'Design a landing page.' },
    { name: 'Cursor', purpose: 'Build and debug websites.', duration: '3 days', task: 'Build a responsive webpage.' },
    { name: 'GitHub Copilot', purpose: 'Explore AI-assisted coding.', duration: '2 days', task: 'Review and test code suggestions.' },
    { name: 'AI Website Project', purpose: 'Combine web development and AI tools.', duration: '5 days', task: 'Build and demonstrate a complete website.', project: true }
  ],
  app: [
    { name: 'ChatGPT', purpose: 'Plan app features and user flows.', duration: '2 days', task: 'Write an app specification.' },
    { name: 'Gemini', purpose: 'Research app ideas.', duration: '2 days', task: 'Prepare an app feature plan.' },
    { name: 'FlutterFlow', purpose: 'Explore visual app development.', duration: '3 days', task: 'Create an app prototype.' },
    { name: 'Cursor', purpose: 'Build application features.', duration: '3 days', task: 'Build a small app feature.' },
    { name: 'Firebase', purpose: 'Explore backend services.', duration: '3 days', task: 'Connect a sample app to a backend.' },
    { name: 'AI App Project', purpose: 'Build a practical application.', duration: '5 days', task: 'Demonstrate a working app prototype.', project: true }
  ],
  design: [
    { name: 'ChatGPT', purpose: 'Develop user personas and design ideas.', duration: '2 days', task: 'Prepare a user persona.' },
    { name: 'Figma AI', purpose: 'Explore interface design.', duration: '3 days', task: 'Design an app screen.' },
    { name: 'Uizard', purpose: 'Create interface prototypes.', duration: '2 days', task: 'Build a simple prototype.' },
    { name: 'Canva AI', purpose: 'Create visual assets.', duration: '2 days', task: 'Prepare a design presentation.' },
    { name: 'Adobe Firefly', purpose: 'Explore AI-generated visuals.', duration: '2 days', task: 'Create visual concepts.' },
    { name: 'UI/UX Portfolio Project', purpose: 'Present your design work.', duration: '5 days', task: 'Submit a prototype and case study.', project: true }
  ],
  security: [
    { name: 'ChatGPT', purpose: 'Learn defensive security concepts.', duration: '2 days', task: 'Create a security checklist.' },
    { name: 'Gemini', purpose: 'Research common security threats.', duration: '2 days', task: 'Prepare a threat report.' },
    { name: 'Wireshark', purpose: 'Explore network traffic in an authorized lab.', duration: '3 days', task: 'Analyze a sample network capture.' },
    { name: 'VirusTotal', purpose: 'Study file and URL reputation reports.', duration: '2 days', task: 'Review a safe sample report.' },
    { name: 'Defensive Security Tools', purpose: 'Explore defensive workflows.', duration: '3 days', task: 'Document lab findings.' },
    { name: 'Security Project', purpose: 'Demonstrate defensive analysis.', duration: '5 days', task: 'Submit a lab report with recommendations.', project: true }
  ]
}

function getCareerName(career) {
  if (typeof career === 'string') return career
  return career?.title || career?.name || career?.career || ''
}

function getRoadmapKey(career) {
  const name = career.toLowerCase()

  if (/content|video|creator/.test(name)) return 'content'
  if (/data|analyst/.test(name)) return 'data'
  if (/web|full.?stack|frontend|backend/.test(name)) return 'web'
  if (/app|mobile|flutter/.test(name)) return 'app'
  if (/design|ui.?ux/.test(name)) return 'design'
  if (/cyber|security/.test(name)) return 'security'

  return 'ai'
}

export default function LearningRoadmap({ career, onSelectSkill }) {
  const careerName = getCareerName(career) || 'AI Engineer'
  const tools = roadmaps[getRoadmapKey(careerName)]

  const [completed, setCompleted] = useState([])
  const [activeStep, setActiveStep] = useState(0)
  const [activeLesson, setActiveLesson] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem(`last-lesson-${getCareerName(career) || 'AI Engineer'}`)
        || 'null'
      )
    } catch {
      return null
    }
  })
  const [generatedCourse, setGeneratedCourse] = useState(null)
  const [generating, setGenerating] = useState(false)
  const [generationError, setGenerationError] = useState('')

  useEffect(() => {
    setCompleted([])
    setActiveStep(0)
    setGeneratedCourse(null)
  
    if (careerName) {
      generateCourse()
    }
  }, [careerName])

  async function generateCourse() {
    setGenerating(true)
    setGenerationError('')
  
    const storageKey = `generated-course-${careerName}`
  
    try {
      // Restore the previously generated course
      const savedCourse = localStorage.getItem(storageKey)
  
      if (savedCourse) {
        setGeneratedCourse(JSON.parse(savedCourse))
        return
      }
  
      // Generate a new course if no saved course exists
      setGeneratedCourse(null)
  
      const { data, error } = await supabase.functions.invoke(
        'generate-course',
        {
          body: {
            courseName: careerName,
            language: 'English',
          },
        }
      )
  
      if (error) throw error
  
      if (!data?.success || !Array.isArray(data?.modules)) {
        throw new Error(data?.error || 'Invalid course response.')
      }
  
      // Save the generated course
      localStorage.setItem(storageKey, JSON.stringify(data))
      setGeneratedCourse(data)
    } catch (err) {
      setGenerationError(err.message || 'Course generation failed.')
    } finally {
      setGenerating(false)
    }
  }
  const progress = tools.length
    ? Math.round((completed.length / tools.length) * 100)
    : 0

  const currentStep = tools[activeStep]
  const allCompleted = completed.length === tools.length
  const projectCompleted = tools.some(
    (step, index) => step.project && completed.includes(index)
  )

  function markComplete() {
    if (!currentStep || completed.includes(activeStep)) return
  
    const updatedCompleted = [...completed, activeStep]
  
    setCompleted(updatedCompleted)
  
    localStorage.setItem(
      `roadmap-progress-${careerName}`,
      JSON.stringify(updatedCompleted)
    )
  
    if (activeStep < tools.length - 1) {
      setActiveStep(activeStep + 1)
    }
  }
  function startLearning() {
    if (currentStep) onSelectSkill?.(currentStep.name)
  }
  function openLesson(moduleIndex, lessonIndex) {
    const lessonPosition = {
      moduleIndex,
      lessonIndex,
    }
  
    setActiveLesson(lessonPosition)
  
    localStorage.setItem(
      `last-lesson-${careerName}`,
      JSON.stringify(lessonPosition)
    )
  }
  return (
    <main className="learning-index">
      <header className="learning-index-header">
        <p className="learning-eyebrow">YOUR PERSONAL LEARNING JOURNEY</p>
        <h1>AI Skill Navigator</h1>
        <h2>Skills to Careers</h2>
        <p>Career goal: <strong>{careerName}</strong></p>
        <p>Learn one step at a time, practise your skills and build a real-world project.</p>
        {generating && (
  <p className="roadmap-loading">
    AI is preparing your personalized career roadmap...
  </p>
)}

{generationError && (
  <p className="roadmap-error" role="alert">
    {generationError}
  </p>
)}

{generatedCourse && (
  <section className="generated-course">
    <h2>{generatedCourse.title}</h2>

    {generatedCourse.modules.map((module, index) => (
      <article key={`${module.title}-${index}`}>
        <h3>Module {index + 1}: {module.title}</h3>

        {module.aiTools?.map((tool, toolIndex) => (
          <div key={`${tool.name}-${toolIndex}`}>
            <h4>{tool.name}</h4>
            <p>{tool.purpose}</p>
          </div>
        ))}

{module.lessons.map((lesson, lessonIndex) => {
  const isActiveLesson =
    activeLesson?.moduleIndex === index &&
    activeLesson?.lessonIndex === lessonIndex

  return (
    <div key={`${lesson.title}-${lessonIndex}`}>
      <h4>{lesson.title}</h4>

      <button
        type="button"
        onClick={() => openLesson(index, lessonIndex)}
      >
        {isActiveLesson ? 'Continue Lesson' : 'Start Lesson'}
      </button>

      {isActiveLesson && (
        <div className="active-lesson-content">
          <p>{lesson.explanation}</p>
          <p><strong>Example:</strong> {lesson.example}</p>
          <p><strong>Practice:</strong> {lesson.practice}</p>
        </div>
      )}
    </div>
  )
})}
      </article>
    ))}
  </section>
)}
      </header>

      <section className="learning-summary">
        <div><span className="summary-label">Learning steps</span><strong>{tools.length}</strong></div>
        <div><span className="summary-label">Completed</span><strong>{completed.length}</strong></div>
        <div><span className="summary-label">Progress</span><strong>{progress}%</strong></div>
      </section>

      <div className="learning-progress-track" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
        <div className="learning-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <section className="learning-section">
        <h2 className="learning-section-heading">Your Step-by-Step Roadmap</h2>
        <p className="roadmap-guidance">Choose the current step. Finish it to unlock the next one.</p>

        <div className="learning-index-list">
          {tools.map((step, index) => {
            const isCompleted = completed.includes(index)
            const isLocked = index > completed.length
            const isActive = index === activeStep && !isCompleted

            return (
              <article
                key={step.name}
                className={`learning-module ${isCompleted ? 'module-completed' : ''} ${isLocked ? 'module-locked' : ''} ${isActive ? 'module-active' : ''}`}
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <div className="module-number">
                  {isCompleted ? '✓' : isLocked ? '🔒' : index + 1}
                </div>

                <div className="module-details">
                  <span className="module-label">
                    {step.project ? 'REAL-WORLD PROJECT' : `STEP ${index + 1}`}
                  </span>
                  <h3>{step.name}</h3>
                  <p>{step.purpose}</p>
                  <p><strong>Duration:</strong> {step.duration}</p>
                  <p><strong>Practical task:</strong> {step.task}</p>

                  <div className="module-action">
                    {isActive && !isLocked && (
                      <>
                        <button className="module-start-btn" onClick={startLearning} type="button">
                          Start Learning →
                        </button>
                        <button className="module-complete-btn" onClick={markComplete} type="button">
                          Mark Step Complete
                        </button>
                      </>
                    )}

                    {isCompleted && <span className="module-status">✓ Completed</span>}
                    {isLocked && <span className="module-lock-icon">🔒 Finish the previous step first</span>}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="certificate-panel">
        <span className="certificate-icon">🏆</span>
        <h2>Certificate Eligibility</h2>
        {allCompleted && projectCompleted ? (
          <p>Your steps are marked complete. Submit your real-world project for review before a certificate can be awarded.</p>
        ) : (
          <p>Complete every learning step and submit your real-world project. Certificate eligibility requires project review.</p>
        )}
        <div className="certificate-progress">{completed.length} of {tools.length} steps completed</div>
      </section>

      <p className="custom-course-message">
        Check each tool's current availability and free-plan limits before use.
      </p>
    </main>
  )
}