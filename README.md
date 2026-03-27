<p align="center">
  <b>Interactive GitHub Repository Analytics Dashboard built with React & GitHub API.</b>
</p>

<p align="center">
  <a href="https://git-visualizer-rose.vercel.app/">
    <img src="https://img.shields.io/badge/Live%20Demo-Visit-brightgreen?style=for-the-badge" />
  </a>
</p>

# 📊 GitHub Visualizer
### A Modern Frontend Dashboard for Visualizing GitHub Repository Insights

---

## 🚀 Overview

GitHub Visualizer is a frontend analytics dashboard that transforms raw GitHub repository data into interactive visual insights.

It allows users to input a repository and explore:

- 📈 Commit activity trends
- 🌳 Branch structure visualization
- 👥 Contributor insights
- 🧠 Commit-level details
- 🗂 Language distribution
- 📦 Repository statistics
- 📤 Data export (CSV & PDF)

The application consumes GitHub’s REST API and presents repository analytics through a clean, interactive UI.

---

## 🏗 Tech Stack

### 🔹 Frontend
- React (Vite)
- JavaScript (ES6+)
- Tailwind CSS
- React Flow (Branch Visualization)
- Chart Libraries (Commit & Language Charts)

### 🔹 Data & API
- GitHub REST API
- Custom Hooks for data fetching
- Utility-based data processing

### 🔹 Export Features
- CSV Export
- PDF Export

---

## 📂 Project Structure

```bash
github-visualizer/
│
├── src/
│   ├── components/
│   │   ├── BranchTree.jsx
│   │   ├── CommitActivityChart.jsx
│   │   ├── CommitList.jsx
│   │   ├── CommitDetailsPanel.jsx
│   │   ├── CommitNode.jsx
│   │   ├── ContributorList.jsx
│   │   ├── DashboardSummary.jsx
│   │   ├── LanguageChart.jsx
│   │   └── Sidebar.jsx
│   │
│   ├── hooks/
│   │   └── useGitHubCommits.js
│   │
│   ├── utils/
│   │   ├── githubCommitLinks.js
│   │   ├── exportCsv.js
│   │   ├── exportPdf.js
│   │   └── colors.js
│   │
│   ├── data/
│   │   ├── commits.js
│   │   └── dummyCommits.js
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── public/
├── tailwind.config.js
├── package.json
└── .env
```
## ✨ Key Features

### 🌳 Branch Visualization
- Interactive branch structure using React Flow
- Visual commit nodes
- Zoom & navigation support

### 📈 Commit Activity & Insights

- Commit activity timeline chart
- Commit distribution over time
- Detailed commit metadata (author, date, hash, message)
- Activity intensity labeling

### 👥 Contributor Analytics

- Contributor list with commit counts
- Contribution activity tracking

### 📊 Dashboard Summary

Displays repository statistics including:
- Total commits
- Total contributors
- Stars
- Forks
 -Watchers
- Open issues

### 🗂 Language Breakdown

- Pie chart visualization of language distribution
- Dynamic color-coded representation
- Percentage-based breakdown

### 📤 Export Functionality

- Export commits as CSV
- Export contributors as CSV
- Export commit visualization as PDF

### 🔐 Environment Setup

This project uses a GitHub Personal Access Token to avoid API rate limits.
Create a .env file:
```
VITE_GITHUB_TOKEN=your_github_personal_access_token
```
---
### 🐳 Running Locally

🔧 Prerequisites
- Node.js (v18+)
- npm

1️⃣ Clone Repository
```
git clone <your-repo-url>
cd github-visualizer
npm install
```

2️⃣ Start Development Server

```
npm run dev
```

App runs at:

👉 http://localhost:5173

---
### 🎯 How It Works

1) User enters repository URL.
2) Custom hook (useGitHubCommits) fetches commit data.
3) Utility functions transform raw API data.
4) Components render:
   - Charts
   - Branch tree
   - Commit lists
   - Dashboard summary
5)Users can export analytics data.
