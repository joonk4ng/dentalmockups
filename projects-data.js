/**
 * PORTFOLIO DATA
 * ==============
 * Edit your projects, skills, and background here.
 * Adding a new project to this array will automatically render on the site.
 */

const portfolioProjects = [
  {
    id: "dentaflow",
    title: "DentaFlow",
    category: "healthtech",
    badge: "Clinical Suite",
    summary: "Real-time clinical charting and intelligent patient intake platform built from first-hand dental surgical experience to remove front-office operational friction.",
    highlights: [
      "Engineered an interactive SVG odontogram (tooth chart) supporting periodontal pocket depth tracking and restorative treatment history",
      "Automated clinical risk flagging for premedication protocols and drug interactions based on ADA guidelines",
      "Architected role-based access control (Doctor, Assistant, Front Office) with HIPAA-compliant audit logging"
    ],
    tags: ["TypeScript", "React", "Node.js", "Express", "PostgreSQL", "TailwindCSS"],
    demoUrl: "#",
    githubUrl: "https://github.com/joonkang",
    year: "2024"
  },
  {
    id: "bioseq",
    title: "BioSeq Analyzer",
    category: "bioinformatics",
    badge: "Algorithmic Tool",
    summary: "High-performance molecular sequence alignment tool synthesizing biological foundation with dynamic programming algorithms.",
    highlights: [
      "Implemented Needleman-Wunsch (global) and Smith-Waterman (local) alignment algorithms with WebAssembly-backed browser acceleration",
      "Designed interactive nucleotide mutation heatmaps and amino acid translation views with D3.js",
      "Benchmarked parsing FASTA/GenBank datasets with sub-second alignment speeds on consumer hardware"
    ],
    tags: ["Python", "FastAPI", "WebAssembly", "BioPython", "TypeScript", "D3.js"],
    demoUrl: "#",
    githubUrl: "https://github.com/joonkang",
    year: "2024"
  },
  {
    id: "medivault",
    title: "MediVault API",
    category: "systems",
    badge: "Backend & Security",
    summary: "Audited healthcare API gateway designed with field-level encryption for electronic health records and automated compliance checks.",
    highlights: [
      "Implemented AES-256 field-level encryption for personally identifiable information (PII) and protected health info (PHI)",
      "Engineered rate-limiting middleware, Redis caching layer, and immutable audit logs for regulatory compliance",
      "Packaged in Docker containers with 90%+ unit test coverage and automated migration workflows"
    ],
    tags: ["Go / Node.js", "PostgreSQL", "Redis", "Docker", "JWT", "REST APIs"],
    demoUrl: "#",
    githubUrl: "https://github.com/joonkang",
    year: "2024"
  },
  {
    id: "ortholens",
    title: "OrthoLens 3D",
    category: "tools",
    badge: "Interactive WebGL",
    summary: "Lightweight browser-based 3D STL mesh viewer for dental impressions and aligner treatment staging without heavy desktop CAD software.",
    highlights: [
      "Rendered 100k+ polygon stereolithography (.STL) dental scans at 60fps utilizing Three.js and custom GLSL shaders",
      "Implemented digital caliper tool for accurate inter-canine and arch-width millimeter measurement",
      "Optimized mobile GPU memory usage through progressive level-of-detail (LOD) geometry simplification"
    ],
    tags: ["Three.js", "WebGL", "TypeScript", "HTML5 Canvas"],
    demoUrl: "ortholens/index.html",
    githubUrl: "https://github.com/joonkang",
    year: "2024"
  }
];

const personalConfig = {
  name: "Joon Kang",
  title: "Software Engineer",
  location: "California, USA",
  status: "Available for engineering roles",
  email: "joonkang.dev@gmail.com",
  socials: {
    github: "https://github.com/joonkang",
    linkedin: "https://linkedin.com/in/joonkang"
  },
  experience: [
    {
      period: "Present",
      role: "Software Engineer & Builder",
      organization: "Personal Projects & Open Source",
      description: "Developing full-stack web applications, healthtech tooling, and distributed backend services. Combining clinical precision with modern computer science engineering."
    },
    {
      period: "2021 – 2024",
      role: "B.S. in Computer Science",
      organization: "School of Engineering & Computer Science",
      description: "Rigorous coursework in algorithms, data structures, system design, databases, software engineering, and human-computer interaction."
    },
    {
      period: "2020 – 2022",
      role: "Clinical Dental Assistant",
      organization: "Private Practice & Surgery",
      description: "Assisted lead dentists in four-handed operative and surgical dental procedures. Mastered sterile protocols, clinical patient management, electronic health records, and zero-defect precision under high-pressure clinical settings."
    },
    {
      period: "Foundational",
      role: "Biological Sciences & Pre-Health",
      organization: "Life Sciences & Laboratory Research",
      description: "Extensive background in molecular biology, biochemistry, laboratory research protocols, and quantitative scientific data analysis."
    }
  ],
  skills: {
    languages: ["TypeScript", "JavaScript (ES6+)", "Python", "Java", "C++", "SQL", "HTML5 / CSS3"],
    frameworks: ["React", "Node.js", "Next.js", "Express", "FastAPI", "TailwindCSS"],
    systemsTools: ["Git & GitHub", "PostgreSQL", "Docker", "Redis", "REST APIs", "Linux / Bash", "Vite"],
    domainExpertise: ["Clinical Workflow Ergonomics", "HIPAA Awareness", "Scientific Data Modeling", "Empirical Systems Debugging"]
  }
};
