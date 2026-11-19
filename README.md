# Joon Kang — Personal Portfolio Website

An interdisciplinary software engineering portfolio bridging **Biological Sciences**, **Clinical Dental Care**, and **Computer Science**. Built with modern semantic HTML5, CSS custom properties, and vanilla JavaScript for blazing-fast performance on **GitHub Pages**.

![Theme](https://img.shields.io/badge/Theme-Modern%20Dark%20Mode-090d16?style=for-the-badge&logoColor=06b6d4)
![Hosting](https://img.shields.io/badge/Hosting-GitHub%20Pages-22c55e?style=for-the-badge&logo=github)
![Dependencies](https://img.shields.io/badge/Dependencies-Zero%20Build%20Step-blue?style=for-the-badge)

---

## ✨ Features

- **Interdisciplinary Narrative**: Dedicated showcase highlighting the convergence of **Biology**, **Clinical Dental Assisting**, and a **B.S. in Computer Science**.
- **Dynamic Projects Engine**: All projects are stored cleanly in [`projects-data.js`](file:///Users/joonkang/Documents/Mockups/projects-data.js). Adding a new project takes 30 seconds without modifying HTML.
- **Interactive Search & Tag Filters**: Filter projects across categories (*HealthTech*, *Bioinformatics*, *Full-Stack*, *Tools*) or search in real-time by keyword or tech stack.
- **Deep-Dive Architecture Modal**: Detailed popup for each project showing architectural highlights, key technical accomplishments, and source links.
- **Sleek Dark Mode Aesthetics**: Ambient mesh gradients, glowing grid accents, glassmorphic cards, and responsive micro-interactions.
- **Zero-Build Deployment**: 100% pure static web assets (HTML5 / Modern CSS / Vanilla ES6+ JS). No heavy Node build step required—push directly to GitHub and it's live!

---

## 🚀 How to Publish to GitHub Pages

### Option A: User / Primary Site (`<username>.github.io`)
If you want your portfolio to be your main website at `https://<your-username>.github.io`:

1. **Create a new repository on GitHub** named exactly:
   ```
   <your-username>.github.io
   ```
   *(For example: `joonkang.github.io`)*

2. **Push these files to the repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Interdisciplinary software portfolio"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-username>.github.io.git
   git push -u origin main
   ```

3. **Visit your website**: In 1–2 minutes, your website will be live automatically at:
   `https://<your-username>.github.io`

---

### Option B: Project Site (`<username>.github.io/portfolio`)
If you push this code to a repo named `portfolio` (or any other name):

1. Push your code to the repo.
2. In GitHub, go to **Settings** → **Pages** (in the left sidebar).
3. Under **Branch**, select `main` (or `master`) and folder `/ (root)`.
4. Click **Save**. GitHub will generate a URL like `https://<your-username>.github.io/portfolio`.

---

## 🛠️ How to Add or Edit Projects

You don't need to touch `index.html` to add your projects! Open [`projects-data.js`](file:///Users/joonkang/Documents/Mockups/projects-data.js) and simply add a new object to the `portfolioProjects` array:

```javascript
{
  id: "my-new-project",
  title: "My Project Name",
  category: "fullstack", // 'healthtech' | 'bioinformatics' | 'fullstack' | 'tools'
  badge: "Featured",
  subtitle: "One-line punchy summary of the project",
  description: "Detailed breakdown of the problem, solution, and tech architecture...",
  highlights: [
    "Architected REST API with sub-50ms query latency",
    "Engineered reactive client-side state machine with React",
    "Implemented automated CI/CD pipeline"
  ],
  tags: ["React", "TypeScript", "Python", "Docker"],
  gradient: "cyan-blue", // 'cyan-blue' | 'emerald-teal' | 'purple-indigo' | 'amber-rose'
  demoUrl: "https://my-live-demo.com", // or '#' if coming soon
  githubUrl: "https://github.com/joonkang/my-repo",
  date: "2024"
}
```

---

## 🎨 How to Customize Your Info

In [`projects-data.js`](file:///Users/joonkang/Documents/Mockups/projects-data.js), the `personalConfig` object holds your:
- Social links (GitHub, LinkedIn, Email)
- Skill chips categorized by domain
- Academic and clinical trajectory milestones
