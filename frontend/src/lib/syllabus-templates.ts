export interface Topic {
  id: string;
  name: string;
  estimatedHours: number;
}

export interface Subject {
  id: string;
  name: string;
  topics: Topic[];
}

export interface Paper {
  id: string;
  name: string;
  subjects: Subject[];
}

export const upscTemplate: Paper[] = [
  {
    id: "prelims",
    name: "UPSC Prelims",
    subjects: [
      {
        id: "prelims-gs",
        name: "Paper I: General Studies (GS)",
        topics: [
          { id: "prelims-gs-current-events", name: "Current Events of National & International Importance", estimatedHours: 100 },
          { id: "prelims-gs-history", name: "History of India & Indian National Movement", estimatedHours: 80 },
          { id: "prelims-gs-geography", name: "Indian & World Geography", estimatedHours: 70 },
          { id: "prelims-gs-polity", name: "Indian Polity & Governance", estimatedHours: 90 },
          { id: "prelims-gs-economy", name: "Economic & Social Development", estimatedHours: 80 },
          { id: "prelims-gs-environment", name: "Environmental Ecology, Biodiversity & Climate Change", estimatedHours: 60 },
          { id: "prelims-gs-science", name: "General Science", estimatedHours: 50 },
        ],
      },
      {
        id: "prelims-csat",
        name: "Paper II: CSAT (Civil Services Aptitude Test)",
        topics: [
          { id: "prelims-csat-comprehension", name: "Comprehension", estimatedHours: 30 },
          { id: "prelims-csat-interpersonal", name: "Interpersonal Skills including Communication Skills", estimatedHours: 20 },
          { id: "prelims-csat-reasoning", name: "Logical Reasoning & Analytical Ability", estimatedHours: 40 },
          { id: "prelims-csat-decision-making", name: "Decision-Making & Problem Solving", estimatedHours: 20 },
          { id: "prelims-csat-mental-ability", name: "General Mental Ability", estimatedHours: 30 },
          { id: "prelims-csat-numeracy", name: "Basic Numeracy (Class X level)", estimatedHours: 40 },
          { id: "prelims-csat-data-interpretation", name: "Data Interpretation (Class X level)", estimatedHours: 30 },
        ],
      },
    ],
  },
  {
    id: "mains",
    name: "UPSC Mains",
    subjects: [
      {
        id: "mains-qualifying-a",
        name: "Paper A – Indian Language (Qualifying)",
        topics: [
            {id: "mains-qa-essay", name: "Essay Writing", estimatedHours: 20},
            {id: "mains-qa-translation", name: "Translation (English to Language)", estimatedHours: 15},
            {id: "mains-qa-precis", name: "Precise Writing", estimatedHours: 15},
            {id: "mains-qa-comprehension", name: "Comprehension", estimatedHours: 10},
        ]
      },
      {
        id: "mains-qualifying-b",
        name: "Paper B – English (Qualifying)",
        topics: [
            {id: "mains-qb-essay", name: "Essay Writing", estimatedHours: 20},
            {id: "mains-qb-precis", name: "Precis Writing", estimatedHours: 15},
            {id: "mains-qb-comprehension", name: "Comprehension & Grammar", estimatedHours: 15},
        ]
      },
      {
        id: "mains-essay",
        name: "Paper I – Essay",
        topics: [
          { id: "mains-essay-practice", name: "Essay Writing Practice & Strategy", estimatedHours: 50 },
          { id: "mains-essay-philosophical", name: "Analysis of Philosophical & Abstract Topics", estimatedHours: 40 },
        ],
      },
      {
        id: "mains-gs1",
        name: "Paper II – General Studies I",
        topics: [
          { id: "mains-gs1-culture", name: "Indian Culture: Art, Literature & Architecture", estimatedHours: 40 },
          { id: "mains-gs1-modern-history", name: "Modern Indian History (~1750 to present)", estimatedHours: 50 },
          { id: "mains-gs1-freedom-struggle", name: "The Freedom Struggle", estimatedHours: 45 },
          { id: "mains-gs1-post-independence", name: "Post-Independence Consolidation", estimatedHours: 30 },
          { id: "mains-gs1-world-history", name: "World History (from 18th century)", estimatedHours: 40 },
          { id: "mains-gs1-society", name: "Indian Society & Diversity", estimatedHours: 35 },
          { id: "mains-gs1-geography", name: "World Geography & Resources", estimatedHours: 60 },
        ],
      },
      {
        id: "mains-gs2",
        name: "Paper III – General Studies II",
        topics: [
          { id: "mains-gs2-constitution", name: "Indian Constitution & Governance", estimatedHours: 70 },
          { id: "mains-gs2-polity", name: "Polity, Parliament & Judiciary", estimatedHours: 60 },
          { id: "mains-gs2-development", name: "Welfare Schemes & Development Processes", estimatedHours: 50 },
          { id: "mains-gs2-social-justice", name: "Social Justice: Health, Education, Poverty", estimatedHours: 40 },
          { id: "mains-gs2-governance", name: "Governance, Transparency & Accountability", estimatedHours: 40 },
          { id: "mains-gs2-ir", name: "International Relations & Global Groupings", estimatedHours: 60 },
        ],
      },
      {
        id: "mains-gs3",
        name: "Paper IV – General Studies III",
        topics: [
          { id: "mains-gs3-economy", name: "Indian Economy & Planning", estimatedHours: 80 },
          { id: "mains-gs3-agriculture", name: "Agriculture & Food Processing", estimatedHours: 50 },
          { id: "mains-gs3-infrastructure", name: "Infrastructure: Energy, Ports, Roads", estimatedHours: 40 },
          { id: "mains-gs3-science-tech", name: "Science & Technology", estimatedHours: 50 },
          { id: "mains-gs3-environment", name: "Environment & Bio-diversity", estimatedHours: 40 },
          { id: "mains-gs3-disaster-management", name: "Disaster Management", estimatedHours: 30 },
          { id: "mains-gs3-internal-security", name: "Internal Security & Extremism", estimatedHours: 50 },
        ],
      },
      {
        id: "mains-gs4",
        name: "Paper V – General Studies IV (Ethics)",
        topics: [
          { id: "mains-gs4-ethics", name: "Ethics & Human Interface", estimatedHours: 40 },
          { id: "mains-gs4-attitude", name: "Attitude & Aptitude", estimatedHours: 30 },
          { id: "mains-gs4-emotional-intelligence", name: "Emotional Intelligence", estimatedHours: 30 },
          { id: "mains-gs4-thinkers", name: "Contributions of Moral Thinkers", estimatedHours: 40 },
          { id: "mains-gs4-probity", name: "Probity in Governance", estimatedHours: 35 },
          { id: "mains-gs4-case-studies", name: "Case Studies Practice", estimatedHours: 50 },
        ],
      },
       {
        id: "mains-optional",
        name: "Paper VI & VII – Optional Subject",
        topics: [
          { id: "mains-optional-paper1", name: "Optional Subject Paper I", estimatedHours: 120 },
          { id: "mains-optional-paper2", name: "Optional Subject Paper II", estimatedHours: 120 },
        ],
      },
    ],
  },
];

export const gateTemplate: Paper[] = [
  {
    id: "cs-core",
    name: "GATE - Computer Science",
    subjects: [
      {
        id: "dsa",
        name: "Data Structures & Algorithms",
        topics: [
          { id: "arrays", name: "Arrays & Lists", estimatedHours: 20 },
          { id: "trees", name: "Trees & Graphs", estimatedHours: 25 },
        ],
      },
      {
        id: "dbms",
        name: "Database Management Systems",
        topics: [
          { id: "sql", name: "SQL and Relational Algebra", estimatedHours: 15 },
          { id: "normalization", name: "Database Normalization", estimatedHours: 10 },
        ],
      },
    ],
  },
];

export const itJobsTemplate: Paper[] = [
    {
        id: 'it-jobs-prep',
        name: 'IT Job Preparation',
        subjects: [
            {
                id: 'aptitude',
                name: 'Quantitative Aptitude & Reasoning',
                topics: [
                    { id: 'quant-basics', name: 'Quantitative Aptitude Basics', estimatedHours: 25 },
                    { id: 'logical-reasoning', name: 'Logical Reasoning Practice', estimatedHours: 25 },
                ]
            },
            {
                id: 'programming-core',
                name: 'Core Programming Concepts',
                topics: [
                    { id: 'dsa-core', name: 'Data Structures & Algorithms', estimatedHours: 40 },
                    { id: 'os-core', name: 'Operating Systems Concepts', estimatedHours: 20 },
                    { id: 'dbms-core', name: 'DBMS Fundamentals', estimatedHours: 20 },
                ]
            }
        ]
    }
]

export const pythonTemplate: Paper[] = [
  {
    id: "python-basics",
    name: "Python Programming",
    subjects: [
      {
        id: "fundamentals",
        name: "Python Fundamentals",
        topics: [
          { id: "syntax", name: "Basic Syntax and Data Types", estimatedHours: 10 },
          { id: "functions", name: "Functions and Control Flow", estimatedHours: 15 },
        ],
      },
      {
        id: "oop",
        name: "Object-Oriented Programming",
        topics: [
            { id: "classes", name: "Classes and Objects", estimatedHours: 20 },
        ]
      }
    ],
  },
];

export const webDevTemplate: Paper[] = [
    {
        id: 'frontend',
        name: 'Web Development - Frontend',
        subjects: [
            {
                id: 'html-css',
                name: 'HTML & CSS',
                topics: [
                    { id: 'html-basics', name: 'HTML Basics', estimatedHours: 10 },
                    { id: 'css-flexbox', name: 'CSS Flexbox and Grid', estimatedHours: 15 },
                ]
            },
            {
                id: 'javascript',
                name: 'JavaScript',
                topics: [
                    { id: 'js-dom', name: 'DOM Manipulation', estimatedHours: 20 },
                ]
            }
        ]
    }
]

export const templateCategories = [
  {
    name: "Competitive Exams",
    templates: [
      { id: "upsc", name: "UPSC Civil Services", data: upscTemplate },
      { id: "gate", name: "GATE Computer Science", data: gateTemplate },
    ],
  },
  {
    name: "Career & Placement",
    templates: [
       { id: "it-jobs", name: "IT Jobs Placement", data: itJobsTemplate },
    ]
  },
  {
    name: "Programming",
    templates: [
      { id: "python", name: "Python", data: pythonTemplate },
      { id: 'web-dev', name: 'Web Development', data: webDevTemplate}
    ],
  },
];