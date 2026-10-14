import { useEffect, useState } from 'react'
import './LessonWhiteboard.css'
  
  export default function LessonWhiteboard({
    lesson,
    activeBoardSection = 0,
  }) {
    const [visible, setVisible] = useState(1)
  useEffect(() => {
    setVisible(1)
  }, [lesson?.title])

  if (!lesson) return null

  const points = [
    { title: 'TODAY’S TOPIC', text: lesson.title },
    { title: 'EXPLANATION', text: lesson.explanation },
    { title: 'EXAMPLE', text: lesson.example },
    { title: 'PRACTICE TASK', text: lesson.practice },
  ].filter((item) => item.text)

  return (
    <section className="lesson-board">
      <div className="board-heading">
        <span>✏️ AI TEACHER'S WHITEBOARD</span>
        <span>{visible}/{points.length}</span>
      </div>

      <div className="board-content" aria-live="polite">
      {points
  .slice(
    0,
    Math.min(points.length, Math.max(visible, activeBoardSection + 1))
  )
  .map((item, index) => (
          <div className="board-line" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
            {index === visible - 1 && (
              <span className="board-cursor">▍</span>
            )}
          </div>
        ))}
      </div>

      <div className="board-actions">
        <button
          onClick={() => setVisible((n) => Math.max(1, n - 1))}
          disabled={visible === 1}
        >
          ← Previous
        </button>

        <button
          onClick={() =>
            setVisible((n) => Math.min(points.length, n + 1))
          }
          disabled={visible === points.length}
        >
          Next →
        </button>
      </div>
    </section>
  )
}