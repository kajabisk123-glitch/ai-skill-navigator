import { useEffect, useMemo, useState } from 'react'
import './AITeacher.css'
import { supabase } from './supabaseClient'
import AnimatedTeacher from './AnimatedTeacher';
import LessonWhiteboard from './LessonWhiteboard';
import AnimatedAvatar from './AnimatedAvatar.jsx'
const lessons = {
  Python: {
    English: {
      title: 'Introduction to Python',
      explanation:
        'Python is a beginner-friendly programming language used in web development, automation, data analysis, and artificial intelligence.',
      notes: [
        'Python is a high-level programming language.',
        'Variables store values.',
        'Python uses indentation to organize code blocks.',
      ],
      example: 'name = "Student"\nprint(name)',
      practice: 'Create an age variable and print its value.',
      questions: [
        {
          question: 'Which function displays output in Python?',
          options: ['input()', 'print()', 'type()', 'range()'],
          answer: 'print()',
        },
        {
          question:
            'Which symbol is used to assign a value to a variable?',
          options: ['=', '==', '!=', '<='],
          answer: '=',
        },
      ],
    },

    Telugu: {
      title: 'Python పరిచయం',
      explanation:
        'Python ఒక beginner-friendly programming language. దీన్ని Web Development, Automation, Data Analysis, Artificial Intelligence వంటి రంగాల్లో ఉపయోగిస్తారు.',
      notes: [
        'Python ఒక high-level programming language.',
        'Variables values‌ను store చేస్తాయి.',
        'Code blocks‌ను organize చేయడానికి indentation ఉపయోగిస్తాం.',
      ],
      example: 'name = "Student"\nprint(name)',
      practice:
        'age అనే variable create చేసి, దాని value‌ను print చెయ్.',
      questions: [
        {
          question: 'Python‌లో output చూపించే function ఏది?',
          options: ['input()', 'print()', 'type()', 'range()'],
          answer: 'print()',
        },
        {
          question:
            'Variable‌కు value assign చేయడానికి ఏ symbol ఉపయోగిస్తాం?',
          options: ['=', '==', '!=', '<='],
          answer: '=',
        },
      ],
    },
  },

  HTML: {
    English: {
      title: 'Introduction to HTML',
      explanation:
        'HTML structures webpage content, including headings, paragraphs, images, and links.',
      notes: [
        'HTML stands for HyperText Markup Language.',
        'HTML uses tags to structure webpages.',
        'HTML is not a programming language.',
      ],
      example: '<h1>Hello World</h1>\n<p>My first webpage</p>',
      practice:
        'Create a webpage with one heading and one paragraph.',
      questions: [
        {
          question: 'What is the main purpose of HTML?',
          options: [
            'Structure webpage content',
            'Manage databases',
            'Create operating systems',
            'Edit videos',
          ],
          answer: 'Structure webpage content',
        },
        {
          question: 'Which tag creates a main heading?',
          options: ['<p>', '<h1>', '<img>', '<br>'],
          answer: '<h1>',
        },
      ],
    },

    Telugu: {
      title: 'HTML పరిచయం',
      explanation:
        'HTML అనేది webpage‌లో headings, paragraphs, images, links వంటి content‌ను structure చేయడానికి ఉపయోగపడుతుంది.',
      notes: [
        'HTML అంటే HyperText Markup Language.',
        'Webpage structure కోసం HTML tags ఉపయోగిస్తాం.',
        'HTML ఒక programming language కాదు.',
      ],
      example:
        '<h1>Hello World</h1>\n<p>నా మొదటి webpage</p>',
      practice:
        'ఒక heading, ఒక paragraph ఉన్న webpage తయారు చెయ్.',
      questions: [
        {
          question: 'HTML ప్రధానంగా దేనికి ఉపయోగపడుతుంది?',
          options: [
            'Webpage content structure చేయడానికి',
            'Database నిర్వహించడానికి',
            'Operating system తయారు చేయడానికి',
            'Videos edit చేయడానికి',
          ],
          answer: 'Webpage content structure చేయడానికి',
        },
        {
          question: 'Main heading కోసం ఏ tag ఉపయోగిస్తాం?',
          options: ['<p>', '<h1>', '<img>', '<br>'],
          answer: '<h1>',
        },
      ],
    },
  },
}

const learningSteps = [
  { id: 'modules', label: '📚 Modules' },
  { id: 'class', label: '👨‍🏫 Classroom' },
  { id: 'examples', label: '💻 Examples' },
  { id: 'doubts', label: '🤖 Doubts' },
  { id: 'evaluation', label: '📝 Evaluation' },
]

export default function AITeacher({
  career = '',
  language = 'English',
  initialSkill = 'Python',
  onContinueToTools,
}) {
  const lessonLanguage =
    language === 'Telugu' ? 'Telugu' : 'English'

  const [skill, setSkill] = useState(initialSkill)
  const [activeTab, setActiveTab] = useState('modules')

  const [answers, setAnswers] = useState({})
  const [evaluated, setEvaluated] = useState(false)

  const [backendModules, setBackendModules] = useState([])
  const [activeLessonIndex, setActiveLessonIndex] = useState(0)

  const [courseLoading, setCourseLoading] = useState(false)
  const [courseError, setCourseError] = useState('')

  const [completedLessons, setCompletedLessons] = useState([])

  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const [doubt, setDoubt] = useState('')
  const [doubtAnswer, setDoubtAnswer] = useState('')
  const [doubtLoading, setDoubtLoading] = useState(false)
  const [doubtError, setDoubtError] = useState('')
  const [courseComplete, setCourseComplete] = useState(false)
  const [activeBoardSection, setActiveBoardSection] = useState(0)
  const [gesture, setGesture] = useState(0)

  useEffect(() => {
    setSkill(initialSkill)
  }, [initialSkill])

  useEffect(() => {
    setActiveTab('modules')
    setAnswers({})
    setEvaluated(false)
    setActiveLessonIndex(0)
    setCompletedLessons([])
    setCourseComplete(false)
    setDoubt('')
    setDoubtAnswer('')
    setDoubtError('')
    setCourseError('')
  }, [skill, lessonLanguage])

  useEffect(() => {
    let cancelled = false

    async function loadCourse() {
      setCourseLoading(true)
      setCourseError('')
      setBackendModules([])

      try {
        const { data, error } =
          await supabase.functions.invoke('generate-course', {
            body: {
              courseName: skill,
              language: lessonLanguage,
            },
          })

        if (error) throw error
        if (data?.error) throw new Error(data.error)

        const modules = Array.isArray(data?.modules)
          ? data.modules
          : []

        const validModules = modules
          .map((module) => ({
            ...module,
            lessons: Array.isArray(module.lessons)
              ? module.lessons.filter(
                  (item) =>
                    item &&
                    typeof item.title === 'string' &&
                    typeof item.explanation === 'string'
                )
              : [],
          }))
          .filter((module) => module.lessons.length > 0)

        if (validModules.length === 0) {
          throw new Error(
            'Course lessons are not available from the server.'
          )
        }

        if (!cancelled) {
          setBackendModules(validModules)
          setActiveLessonIndex(0)
        }
      } catch (error) {
        if (!cancelled) {
          setBackendModules([])
          setCourseError(
            error.message || 'Unable to load the course.'
          )
        }
      } finally {
        if (!cancelled) {
          setCourseLoading(false)
        }
      }
    }

    loadCourse()

    return () => {
      cancelled = true
    }
  }, [skill, lessonLanguage])

  const allLessons = useMemo(
    () =>
      backendModules.flatMap((module, moduleIndex) =>
        (module.lessons || []).map((item, lessonIndex) => ({
          ...item,
          moduleTitle: module.title || `Module ${moduleIndex + 1}`,
          moduleIndex,
          lessonIndex,
        }))
      ),
    [backendModules]
  )

  const selectedBackendLesson = allLessons[activeLessonIndex]

  const fallbackLesson =
    lessons[skill]?.[lessonLanguage] || {
      title: `Introduction to ${skill}`,
      explanation: `Welcome to ${skill}! This classroom is ready for your learning journey. Detailed lessons for this skill can be added to the course generator.`,
      notes: [
        `Understand the fundamentals of ${skill}.`,
        `Learn the important concepts of ${skill}.`,
        'Practise what you learn.',
      ],
      example: `Start learning ${skill} step by step.`,
      practice: `Write down three important concepts of ${skill}.`,
      questions: [
        {
          question: `What should you do first when learning ${skill}?`,
          options: [
            'Understand the fundamentals',
            'Skip all lessons',
            'Avoid practice',
            'Stop learning',
          ],
          answer: 'Understand the fundamentals',
        },
      ],
    }

  const lesson = selectedBackendLesson
    ? {
        ...selectedBackendLesson,
        notes: [
          `Understand the fundamentals of ${skill}.`,
          'Review the example and practise the concept.',
        ],
        example:
          selectedBackendLesson.example ||
          `Practise the concepts of ${selectedBackendLesson.title}.`,
        practice:
          selectedBackendLesson.practice ||
          `Complete a practice task related to ${selectedBackendLesson.title}.`,
        questions: Array.isArray(selectedBackendLesson.questions)
          ? selectedBackendLesson.questions
          : [],
      }
    : {
        ...fallbackLesson,
        questions: fallbackLesson.questions || [],
      }

  const videoQuery = encodeURIComponent(
    `${skill} beginner tutorial ${lessonLanguage}`
  )

  const currentLessonCompleted = completedLessons.includes(
    activeLessonIndex
  )

  const score = lesson.questions.reduce(
    (total, question, index) =>
      total + (answers[index] === question.answer ? 1 : 0),
    0
  )

  function goToStep(step) {
    setActiveTab(step)
  }

  function startLesson(index) {
    setActiveLessonIndex(index)
    setAnswers({})
    setEvaluated(false)
    setDoubt('')
    setDoubtAnswer('')
    setDoubtError('')
    setCourseComplete(false)
    setActiveTab('class')
  }

  function speakLesson() {
    if (!('speechSynthesis' in window)) {
      alert('Voice is not supported in this browser.')
      return
    }
  
    window.speechSynthesis.cancel()
  
    const sections = [
      { title: lesson.title, text: lesson.title },
      { title: lesson.explanation, text: lesson.explanation },
      { title: 'Example', text: lesson.example },
      { title: 'Practice task', text: lesson.practice },
    ].filter((item) => item.text)
  
    setActiveBoardSection(0)
  
    const speakSection = (index) => {
      if (index >= sections.length) {
        setIsSpeaking(false)
        setIsPaused(false)
        return
      }
  
      setActiveBoardSection(index)
  
      const speech = new SpeechSynthesisUtterance(
        `${sections[index].title}. ${sections[index].text}`
      )
  
      speech.lang =
        lessonLanguage === 'Telugu' ? 'te-IN' : 'en-IN'
  
      speech.rate = 0.85
  
      speech.onstart = () => {
        setIsSpeaking(true)
        setIsPaused(false)
      }
  
      speech.onend = () => {
        if (index + 1 < sections.length) {
          speakSection(index + 1)
        } else {
          setIsSpeaking(false)
          setIsPaused(false)
        }
      }
  
      speech.onerror = (event) => {
        if (event.error !== 'canceled' && event.error !== 'interrupted') {
          setIsSpeaking(false)
          setIsPaused(false)
        }
      }
  
      window.speechSynthesis.speak(speech)
    }
  
    speakSection(0)
  }

  function pauseLesson() {
    if (
      'speechSynthesis' in window &&
      window.speechSynthesis.speaking
    ) {
      window.speechSynthesis.pause()
      setIsPaused(true)
    }
  }

  function resumeLesson() {
    if (
      'speechSynthesis' in window &&
      window.speechSynthesis.paused
    ) {
      window.speechSynthesis.resume()
      setIsPaused(false)
    }
  }

  function stopLesson() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }

    setIsSpeaking(false)
    setIsPaused(false)
  }

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  async function askAITeacher() {
    if (!doubt.trim() || doubtLoading) return

    setDoubtLoading(true)
    setDoubtError('')
    setDoubtAnswer('')

    try {
      const { data, error } =
        await supabase.functions.invoke('ask-teacher', {
          body: {
            question: doubt.trim(),
            courseName: skill,
            lessonTitle: lesson.title,
            lessonExplanation: lesson.explanation,
            language: lessonLanguage,
          },
        })

      if (error) throw error
      if (data?.error) throw new Error(data.error)

      setDoubtAnswer(data?.answer || 'No answer received.')
    } catch (error) {
      setDoubtError(
        error.message ||
          'Unable to get an answer. Please try again.'
      )
    } finally {
      setDoubtLoading(false)
    }
  }

  function selectAnswer(questionIndex, answer) {
    setAnswers((previous) => ({
      ...previous,
      [questionIndex]: answer,
    }))

    setEvaluated(false)
  }

  function evaluateAnswers() {
    if (
      Object.keys(answers).length !== lesson.questions.length
    ) {
      return
    }

    setEvaluated(true)
  }

  function completeCurrentLesson() {
    const updatedCompleted = [
      ...new Set([...completedLessons, activeLessonIndex]),
    ]

    setCompletedLessons(updatedCompleted)

    const nextIndex = activeLessonIndex + 1

    if (nextIndex < allLessons.length) {
      setActiveLessonIndex(nextIndex)
      setAnswers({})
      setEvaluated(false)
      setDoubt('')
      setDoubtAnswer('')
      setDoubtError('')
      setActiveTab('class')
      return
    }

    setCourseComplete(true)
    setActiveTab('modules')
  }

  const answeredAllQuestions =
    lesson.questions.length > 0 &&
    Object.keys(answers).length === lesson.questions.length

  return (
    <section className="ai-classroom">
      <header className="classroom-header">
        <div>
          <span className="classroom-eyebrow">
            AI SKILL NAVIGATOR
          </span>

          <h2>My AI Classroom</h2>

          <p>
            {career
              ? `Career path: ${career}`
              : 'Learn, practise, and evaluate your skills.'}
          </p>
        </div>

        <div className="classroom-badge">
          <span className="teacher-avatar">👨‍🏫</span>

          <span>
            <strong>AI Teacher</strong>
            <small>Learning Assistant</small>
          </span>
        </div>
      </header>
      {courseLoading && (
        <div className="classroom-panel">
          <h3>Generating your course...</h3>
          <p>Please wait while your AI Teacher prepares the lessons.</p>
        </div>
      )}

      {!courseLoading && courseError && (
        <div className="classroom-panel">
          <h3>⚠️ Course Loading Message</h3>
          <p>{courseError}</p>
          <p>
            The built-in sample lesson is available, but the complete
            AI-generated module list could not be loaded.
          </p>
        </div>
      )}

      {!courseLoading && (
        <>
          <div className="classroom-step-progress">
            <p>
              Current step:{' '}
              <strong>
                {learningSteps.find(
                  (step) => step.id === activeTab
                )?.label || activeTab}
              </strong>
            </p>

            <div className="classroom-tabs classroom-step-nav">
              {learningSteps.map((step, index) => {
                const isCurrent = activeTab === step.id

                return (
                  <span
                    key={step.id}
                    className={
                      isCurrent
                        ? 'classroom-step-label active'
                        : 'classroom-step-label'
                    }
                    aria-current={isCurrent ? 'step' : undefined}
                  >
                    {index + 1}. {step.label}
                  </span>
                )
              })}

              <span
                className={
                  activeTab === 'recorded'
                    ? 'classroom-step-label active'
                    : 'classroom-step-label'
                }
              >
                🎥 Recorded Classes
              </span>
            </div>
          </div>

          {activeTab === 'modules' && !courseComplete && (
            <div className="classroom-panel modules-screen">
              <h3>📚 Your Learning Modules</h3>

              <p>
                Choose a lesson to start learning. Each lesson will
                open separately.
              </p>

              {backendModules.length > 0 ? (
                backendModules.map((module, moduleIndex) => (
                  <div
                    className="module-card"
                    key={module.title || moduleIndex}
                  >
                    <h3>
                      {moduleIndex + 1}. {module.title}
                    </h3>

                    {(module.lessons || []).map((item) => {
                      const lessonIndex = allLessons.findIndex(
                        (lessonItem) =>
                          lessonItem.title === item.title &&
                          lessonItem.moduleIndex === moduleIndex
                      )

                      const isCompleted =
                        completedLessons.includes(lessonIndex)

                      return (
                        <button
                          className="classroom-primary-btn"
                          key={`${moduleIndex}-${item.title}`}
                          onClick={() => startLesson(lessonIndex)}
                        >
                          {isCompleted ? '✅' : '▶'} {item.title}
                        </button>
                      )
                    })}
                  </div>
                ))
              ) : (
                <div className="module-card">
                  <h3>1. {fallbackLesson.title}</h3>

                  <p>{fallbackLesson.explanation}</p>

                  <button
                    className="classroom-primary-btn"
                    onClick={() => startLesson(0)}
                  >
                    Start Lesson →
                  </button>
                </div>
              )}

              <button
                className="classroom-primary-btn"
                onClick={() => goToStep('recorded')}
              >
                🎥 Recorded Classes
              </button>
            </div>
          )}

{activeTab === 'class' && !courseComplete && (
  <div className="classroom-panel">
    <span className="lesson-label">
      YOUR CURRENT LESSON
    </span>

    <h2>{lesson.title}</h2>

    {/* 3D AI Teacher */}
    <AnimatedTeacher
  isSpeaking={isSpeaking}
  gesture={gesture}
/>
    <AnimatedAvatar gesture={gesture} />
    <div className="ai-teacher-controls">
  <button onClick={() => setGesture(0)}>
    🧍 Idle
  </button>

  <button onClick={() => setGesture(2)}>
    ☝️ Pointing
  </button>

  <button onClick={() => setGesture(3)}>
    🗣️ Explaining
  </button>
</div>
    {/* Animated Teaching Whiteboard */}
    <LessonWhiteboard
  lesson={lesson}
  activeBoardSection={activeBoardSection}
/>

    {/* Voice Controls */}
    <div className="ai-teacher-controls">
      <button onClick={speakLesson}>
        🔊 Start Teaching
      </button>

      <button
        onClick={pauseLesson}
        disabled={!isSpeaking || isPaused}
      >
        ⏸️ Pause
      </button>

      <button
        onClick={resumeLesson}
        disabled={!isPaused}
      >
        ▶️ Resume
      </button>

      <button onClick={stopLesson}>
        ⏹️ Stop
      </button>
    </div>

    <p aria-live="polite">
      {isPaused
        ? 'Voice paused'
        : isSpeaking
          ? 'AI Teacher is teaching...'
          : 'Ready to teach'}
    </p>

    <h3>📒 Lesson Notes</h3>

    <ul>
      {lesson.notes.map((note, index) => (
        <li key={`${index}-${note}`}>{note}</li>
      ))}
    </ul>

    <h3>🎯 Practice Task</h3>
    <p>{lesson.practice}</p>

    <button
      className="classroom-primary-btn"
      onClick={() => goToStep('examples')}
    >
      Continue to Examples →
    </button>
  </div>
)}
          {activeTab === 'examples' && !courseComplete && (
            <div className="classroom-panel">
              <h2>📘 Lesson Examples</h2>

              <h3>{lesson.title}</h3>
              <p>{lesson.explanation}</p>

              <h3>💻 Example</h3>

              <pre>
                <code>{lesson.example}</code>
              </pre>

              <h3>🎯 Practice Task</h3>
              <p>{lesson.practice}</p>

              <button
                className="classroom-primary-btn"
                onClick={() => goToStep('doubts')}
              >
                Continue to Doubts →
              </button>
            </div>
          )}

          {activeTab === 'doubts' && !courseComplete && (
            <div className="classroom-panel">
              <h2>❓ Ask Your AI Teacher</h2>

              <p>
                Ask any question about this lesson.
              </p>

              <div className="ai-doubt-box">
                <textarea
                  value={doubt}
                  onChange={(event) =>
                    setDoubt(event.target.value)
                  }
                  placeholder="Type your question here..."
                  rows={4}
                  disabled={doubtLoading}
                />

                <button
                  className="classroom-primary-btn"
                  onClick={askAITeacher}
                  disabled={!doubt.trim() || doubtLoading}
                >
                  {doubtLoading
                    ? 'Thinking...'
                    : 'Ask AI Teacher'}
                </button>

                {doubtError && (
                  <p role="alert">{doubtError}</p>
                )}

                {doubtAnswer && (
                  <div
                    className="ai-doubt-answer"
                    aria-live="polite"
                  >
                    <strong>AI Teacher's Answer</strong>
                    <p>{doubtAnswer}</p>
                  </div>
                )}
              </div>

              <button
                className="classroom-primary-btn"
                onClick={() => goToStep('evaluation')}
              >
                Continue to Evaluation →
              </button>
            </div>
          )}
          {activeTab === 'evaluation' && !courseComplete && (
            <div className="classroom-panel">
              <span className="recorded-icon">📝</span>

              <h3>Lesson Evaluation</h3>

              <p>
                Answer the questions to check your understanding.
              </p>

              {lesson.questions.length === 0 && (
                <p>
                  No evaluation questions are available for this
                  lesson. You can continue to the next lesson.
                </p>
              )}

              {lesson.questions.map((question, index) => (
                <div
                  className="evaluation-question"
                  key={question.question}
                >
                  <strong>
                    {index + 1}. {question.question}
                  </strong>

                  <div className="evaluation-options">
                    {question.options.map((option) => (
                      <label key={option}>
                        <input
                          type="radio"
                          name={`question-${index}`}
                          checked={answers[index] === option}
                          onChange={() =>
                            selectAnswer(index, option)
                          }
                        />

                        {option}
                      </label>
                    ))}
                  </div>

                  {evaluated && (
                    <p
                      className={
                        answers[index] === question.answer
                          ? 'answer-correct'
                          : 'answer-wrong'
                      }
                    >
                      {answers[index] === question.answer
                        ? '✅ Correct!'
                        : `❌ Correct answer: ${question.answer}`}
                    </p>
                  )}
                </div>
              ))}

              {lesson.questions.length > 0 && (
                <button
                  className="classroom-primary-btn"
                  onClick={evaluateAnswers}
                  disabled={!answeredAllQuestions}
                >
                  Check My Answers
                </button>
              )}

              {evaluated && (
                <div className="evaluation-result">
                  <h3>
                    Your Score: {score}/{lesson.questions.length}
                  </h3>

                  <p>
                    {score === lesson.questions.length
                      ? 'Excellent work! You answered every question correctly.'
                      : 'Review the correct answers before continuing.'}
                  </p>
                </div>
              )}

              <button
                className="classroom-primary-btn"
                onClick={completeCurrentLesson}
                disabled={
                  lesson.questions.length > 0 && !evaluated
                }
              >
                {activeLessonIndex + 1 < allLessons.length
                  ? 'Continue to Next Lesson →'
                  : 'Complete Lesson →'}
              </button>
            </div>
          )}

          {activeTab === 'recorded' && (
            <div className="classroom-panel">
              <span className="recorded-icon">🎥</span>

              <h3>Learn Anytime, at Your Own Pace</h3>

              <p>
                Find tutorial videos for this skill and learn
                whenever you are available.
              </p>

              <a
                className="classroom-primary-btn"
                href={`https://www.youtube.com/results?search_query=${videoQuery}`}
                target="_blank"
                rel="noreferrer"
              >
                Browse Recorded Learning Videos ↗
              </a>

              <p className="classroom-disclaimer">
                These are external tutorial search results, not
                recordings of our AI classes.
              </p>

              <button
                className="classroom-primary-btn"
                onClick={() => goToStep('modules')}
              >
                Back to Modules →
              </button>
            </div>
          )}

          {courseComplete && (
            <div className="classroom-panel">
              <h2>🎉 Course Lessons Completed!</h2>

              <p>
                You have reached the end of the available lessons
                for {skill}.
              </p>

              <p>
                Completed lessons: {completedLessons.length}
                {allLessons.length > 0
                  ? ` / ${allLessons.length}`
                  : ''}
              </p>

              {onContinueToTools ? (
                <button
                  className="classroom-primary-btn"
                  onClick={onContinueToTools}
                >
                  Continue to AI Tools →
                </button>
              ) : (
                <p>
                  Connect the Continue button to your existing AI
                  Tools screen in App.jsx to proceed.
                </p>
              )}

              <button
                className="classroom-primary-btn"
                onClick={() => {
                  setCourseComplete(false)
                  setActiveTab('modules')
                }}
              >
                Review Modules
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}
