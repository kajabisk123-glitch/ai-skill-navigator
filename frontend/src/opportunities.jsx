import { useState } from 'react'

const courses = {
  Python: {
    Certificates: [
      {
        title: 'Scientific Computing with Python',
        provider: 'freeCodeCamp',
        detail: 'Learn Python fundamentals and programming.',
        url: 'https://www.freecodecamp.org/learn/'
      },
      {
        title: 'Python Programming',
        provider: 'Cisco Networking Academy',
        detail: 'Explore Python programming courses and credentials.',
        url: 'https://www.netacad.com/'
      }
    ],
    Jobs: [
      {
        title: 'Python Developer',
        provider: 'LinkedIn Jobs',
        detail: 'Search for Python developer roles.',
        url: 'https://www.linkedin.com/jobs/python-developer-jobs/'
      },
      {
        title: 'Junior Python Developer',
        provider: 'Indeed India',
        detail: 'Search for entry-level Python positions.',
        url: 'https://in.indeed.com/jobs?q=junior+python+developer'
      }
    ],
    Internships: [
      {
        title: 'Python Intern',
        provider: 'Internshala',
        detail: 'Find Python development internships.',
        url: 'https://internshala.com/internships/python-development-internship/'
      }
    ]
  },

  'AI & Machine Learning': {
    Certificates: [
      {
        title: 'Introduction to Generative AI',
        provider: 'Google Cloud Skills Boost',
        detail: 'Learn the fundamentals of generative AI.',
        url: 'https://www.cloudskillsboost.google/'
      },
      {
        title: 'Machine Learning',
        provider: 'DeepLearning.AI',
        detail: 'Explore machine learning courses.',
        url: 'https://www.deeplearning.ai/courses/'
      }
    ],
    Jobs: [
      {
        title: 'AI Engineer',
        provider: 'LinkedIn Jobs',
        detail: 'Search for AI engineering roles.',
        url: 'https://www.linkedin.com/jobs/ai-engineer-jobs/'
      },
      {
        title: 'Machine Learning Engineer',
        provider: 'Indeed India',
        detail: 'Explore machine learning job openings.',
        url: 'https://in.indeed.com/jobs?q=machine+learning+engineer'
      }
    ],
    Internships: [
      {
        title: 'AI / ML Intern',
        provider: 'Internshala',
        detail: 'Find artificial intelligence internships.',
        url: 'https://internshala.com/internships/machine-learning-internship/'
      }
    ]
  },

  'Web Development': {
    Certificates: [
      {
        title: 'Responsive Web Design',
        provider: 'freeCodeCamp',
        detail: 'Learn HTML, CSS and responsive design.',
        url: 'https://www.freecodecamp.org/learn/'
      },
      {
        title: 'Full-Stack Web Development',
        provider: 'The Odin Project',
        detail: 'Learn frontend and backend development.',
        url: 'https://www.theodinproject.com/'
      }
    ],
    Jobs: [
      {
        title: 'Frontend Developer',
        provider: 'LinkedIn Jobs',
        detail: 'Search for frontend development roles.',
        url: 'https://www.linkedin.com/jobs/frontend-developer-jobs/'
      },
      {
        title: 'Web Developer',
        provider: 'Indeed India',
        detail: 'Explore web development openings.',
        url: 'https://in.indeed.com/jobs?q=web+developer'
      }
    ],
    Internships: [
      {
        title: 'Web Development Intern',
        provider: 'Internshala',
        detail: 'Find web development internships.',
        url: 'https://internshala.com/internships/web-development-internship/'
      }
    ]
  },

  'Data Science': {
    Certificates: [
      {
        title: 'Data Science Courses',
        provider: 'IBM SkillsBuild',
        detail: 'Explore data science learning resources.',
        url: 'https://skillsbuild.org/'
      },
      {
        title: 'Data Analysis with Python',
        provider: 'freeCodeCamp',
        detail: 'Learn data analysis and Python.',
        url: 'https://www.freecodecamp.org/learn/'
      }
    ],
    Jobs: [
      {
        title: 'Data Analyst',
        provider: 'LinkedIn Jobs',
        detail: 'Search for data analyst positions.',
        url: 'https://www.linkedin.com/jobs/data-analyst-jobs/'
      },
      {
        title: 'Junior Data Scientist',
        provider: 'Indeed India',
        detail: 'Explore entry-level data science roles.',
        url: 'https://in.indeed.com/jobs?q=junior+data+scientist'
      }
    ],
    Internships: [
      {
        title: 'Data Science Intern',
        provider: 'Internshala',
        detail: 'Find data science internships.',
        url: 'https://internshala.com/internships/data-science-internship/'
      }
    ]
  },

  'Cybersecurity': {
    Certificates: [
      {
        title: 'Introduction to Cybersecurity',
        provider: 'Cisco Networking Academy',
        detail: 'Learn cybersecurity fundamentals.',
        url: 'https://www.netacad.com/'
      }
    ],
    Jobs: [
      {
        title: 'Security Analyst',
        provider: 'LinkedIn Jobs',
        detail: 'Search for cybersecurity analyst roles.',
        url: 'https://www.linkedin.com/jobs/cyber-security-analyst-jobs/'
      }
    ],
    Internships: [
      {
        title: 'Cybersecurity Intern',
        provider: 'Indeed India',
        detail: 'Explore cybersecurity internship openings.',
        url: 'https://in.indeed.com/jobs?q=cybersecurity+intern'
      }
    ]
  },

  'Cloud Computing': {
    Certificates: [
      {
        title: 'Cloud Learning Resources',
        provider: 'AWS Skill Builder',
        detail: 'Learn cloud computing fundamentals.',
        url: 'https://skillbuilder.aws/'
      },
      {
        title: 'Google Cloud Training',
        provider: 'Google Cloud',
        detail: 'Explore cloud learning and credentials.',
        url: 'https://cloud.google.com/learn'
      }
    ],
    Jobs: [
      {
        title: 'Cloud Engineer',
        provider: 'LinkedIn Jobs',
        detail: 'Search for cloud engineering roles.',
        url: 'https://www.linkedin.com/jobs/cloud-engineer-jobs/'
      }
    ],
    Internships: [
      {
        title: 'Cloud Computing Intern',
        provider: 'Indeed India',
        detail: 'Search for cloud computing internships.',
        url: 'https://in.indeed.com/jobs?q=cloud+computing+intern'
      }
    ]
  }
}

const defaultCourse = 'Python'

export default function Opportunities({ onBack, selectedCourse, selectedCareer }) {
  const [activeTab, setActiveTab] = useState('Certificates')
  const [search, setSearch] = useState('')

  const requestedCourse = selectedCourse || selectedCareer || defaultCourse

  const courseName = Object.keys(courses).find(
    (name) =>
      name.toLowerCase() === String(requestedCourse).toLowerCase()
  ) || defaultCourse

  const items = courses[courseName][activeTab].filter((item) => {
    const query = search.toLowerCase()

    return (
      item.title.toLowerCase().includes(query) ||
      item.provider.toLowerCase().includes(query) ||
      item.detail.toLowerCase().includes(query)
    )
  })

  return (
    <main className="opportunities-page">
      <header className="opportunities-header">
        <div>
          <span className="opportunities-kicker">YOUR NEXT STEP</span>
          <h1>{courseName} Opportunities</h1>
          <p>Courses, certificates, jobs and internships for your selected skill.</p>
        </div>

        <button
          className="opportunities-back"
          type="button"
          onClick={onBack}
        >
          ← Dashboard
        </button>
      </header>

      <nav className="opportunities-tabs" aria-label="Opportunity categories">
        {['Certificates', 'Jobs', 'Internships'].map((tab) => (
          <button
            key={tab}
            type="button"
            className={
              activeTab === tab
                ? 'opportunity-tab active'
                : 'opportunity-tab'
            }
            onClick={() => {
              setActiveTab(tab)
              setSearch('')
            }}
          >
            {tab === 'Certificates' ? '🏆' : tab === 'Jobs' ? '💼' : '🎓'}
            {' '}{tab}
          </button>
        ))}
      </nav>

      <label className="opportunities-search">
        <span>⌕</span>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={`Search ${activeTab.toLowerCase()}...`}
        />
      </label>

      <section className="opportunities-grid">
        {items.map((item) => (
          <article className="opportunity-card" key={item.title}>
            <div className="opportunity-card-icon">
              {activeTab === 'Certificates'
                ? '🏆'
                : activeTab === 'Jobs'
                  ? '💼'
                  : '🎓'}
            </div>

            <span className="opportunity-type">{activeTab}</span>
            <h2>{item.title}</h2>
            <h3>{item.provider}</h3>
            <p>{item.detail}</p>

            <a
              className="opportunity-apply"
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {activeTab === 'Certificates'
                ? 'Explore course ↗'
                : 'Find opportunities ↗'}
            </a>
          </article>
        ))}

        {items.length === 0 && (
          <div className="opportunities-empty">
            <h2>No results found</h2>
            <p>Try another search term.</p>
          </div>
        )}
      </section>

      <p className="opportunities-note">
        Links open external websites. Course availability, certificates,
        job vacancies and internships depend on each provider. Verify
        eligibility, fees and current openings on the official website.
      </p>
    </main>
  )
}