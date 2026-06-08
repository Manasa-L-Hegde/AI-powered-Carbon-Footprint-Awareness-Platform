# 🌿 EcoTrace AI — Carbon Footprint Awareness Platform

> **Hack2Skill Submission** | AI-Powered Carbon Footprint Calculator & Sustainability Advisor

[![Deployed on Vercel](https://img.shields.io/badge/Live%20Demo-Vercel-black?logo=vercel)](https://ecotrace-ai.vercel.app/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.2-646CFF?logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwindcss)](https://tailwindcss.com)
[![No API Key Required](https://img.shields.io/badge/API%20Key-Not%20Required-brightgreen)](#)

---

## 📌 Chosen Vertical

**Carbon Footprint Awareness Platform**

---

## 🧩 Problem Statement

Climate change is driven by greenhouse gas emissions, yet most individuals lack awareness of their personal carbon footprint. Without clear visibility into which daily activities contribute most to emissions, people cannot make informed decisions about reducing their environmental impact. Existing tools often require paid API subscriptions, lack offline capability, or provide generic advice that doesn't account for individual usage patterns.

---

## 💡 Solution Overview

**EcoTrace AI** is a fully offline, AI-powered carbon footprint awareness platform that enables users to:

1. **Calculate** their annual carbon emissions across 4 categories (transport, energy, flights, diet) using a guided 4-step form
2. **Understand** their impact through a Carbon Score (0–100) and Risk Classification system
3. **Receive** personalized, context-aware sustainability recommendations from a local AI decision engine
4. **Track** progress with interactive dashboards, historical trends, and sustainability goal commitments
5. **Generate** comprehensive audit reports — all without any API key or internet dependency

### Key Differentiator

All AI recommendations, risk assessments, and audit reports are generated **entirely offline** using a sophisticated rule-based decision engine. An optional OpenAI integration exists for users who want GPT-powered analysis, but it is **never required**.

---

## 🧠 Dynamic Decision-Making Logic

The AI recommendation engine uses context-aware decision logic to analyze user data:

```
INPUT: User emission profile {transport, energy, flights, diet}

STEP 1: Sort categories by emission value (descending)
STEP 2: Identify PRIMARY focus (highest emitter)
STEP 3: Identify SECONDARY focus (second highest)

STEP 4: Generate recommendations based on context:

  IF transportation is highest:
    → Recommend EV adoption, carpooling, cycling, public transit, remote work
    
  IF home energy is highest:
    → Recommend renewable energy, smart thermostat, LED lighting, insulation
    
  IF flights is highest:
    → Recommend rail alternatives, direct flights, video conferencing, carbon offsets
    
  IF diet is highest:
    → Recommend plant-based meals, local produce, composting, meal planning

STEP 5: Calculate reduction potential based on impact levels
STEP 6: Compare against national average (8.0 Tons/yr)
STEP 7: Classify risk level from Carbon Score
```

### Carbon Score Formula
```
Score = 100 × exp(-TotalEmissions / 12)
```
- 0 Tons → Score 100
- 8 Tons (national avg) → Score ~51
- Higher score = lower environmental impact

### Risk Classification
| Score Range | Risk Level | Color |
|---|---|---|
| 71–100 | LOW IMPACT | 🟢 Green |
| 31–70 | MEDIUM IMPACT | 🟡 Amber |
| 0–30 | HIGH IMPACT | 🔴 Red |

---

## 🌍 Real World Use Cases

1. **Individual Awareness** — Users calculate their personal footprint and discover which habits (driving, heating, flying, diet) contribute most
2. **Household Optimization** — Families use the household size split to understand per-capita energy impact and set shared goals
3. **Corporate Sustainability** — Teams audit employee commute and travel patterns to inform green workplace policies
4. **Educational Tool** — Schools and universities use the platform to teach climate literacy with interactive visualizations
5. **Goal Setting** — Users commit to specific actions (LED bulbs, public transit, meatless days) and see projected reductions in real-time

---

## 📋 Assumptions

- Emission factors are sourced from **EPA GHG Emission Factors Hub** and **UK DEFRA** conversion tables
- National average baseline is set at **8.0 Tons CO2e/yr** (US average)
- Grid electricity factor of **0.38 kg CO2e/kWh** represents a mixed-source grid average
- Flight emissions include a **radiative forcing multiplier** built into the per-km factors
- Diet emission values represent annual averages across typical food consumption patterns
- All calculations are estimates for awareness purposes, not certified carbon accounting

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | Component-based UI with hooks |
| **Vite 5** | Fast dev server & optimized builds |
| **Tailwind CSS 3** | Utility-first responsive styling |
| **Chart.js 4** | Interactive doughnut & bar charts |
| **Lucide React** | Modern icon system |
| **LocalStorage** | Client-side data persistence |
| **ES Modules** | Native module system for tests |

### Architecture
```
src/
├── App.jsx                    # Main app shell with routing & state
├── main.jsx                   # React entry point
├── index.css                  # Global styles, animations, accessibility
├── utils/
│   └── carbonEngine.js        # Pure-function calculation & AI engine
├── components/
│   ├── Home.jsx               # Landing page with hero & features
│   ├── Calculator.jsx         # 4-step multi-input carbon calculator
│   ├── Dashboard.jsx          # KPIs, charts, goal tracker, history
│   ├── AIAssistant.jsx        # Smart recommendations & audit reports
│   └── About.jsx              # Education, best practices, FAQ
└── tests/
    └── carbonEngine.test.js   # 63 automated tests
```

---

## 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/Manasa-L-Hegde/AI-powered-Carbon-Footprint-Awareness-Platform.git
cd AI-powered-Carbon-Footprint-Awareness-Platform

# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

The app runs at `http://localhost:3000` by default.

---

## 🌐 Deployment (Vercel)

### Option 1: Vercel CLI
```bash
npm i -g vercel
vercel
```

### Option 2: Vercel Dashboard
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"New Project"** → Import this repository
3. Framework Preset: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Click **Deploy**

No environment variables are required. The app works without any configuration.

---

## ✅ Features Checklist

- [x] **Multi-Step Carbon Calculator** — 4 guided steps covering transport, energy, flights, diet
- [x] **Carbon Score** — Exponential decay formula (0–100 scale)
- [x] **Risk Classification** — LOW / MEDIUM / HIGH with colored badges
- [x] **Smart AI Recommendations** — Context-aware, offline, no API key needed
- [x] **Interactive Dashboard** — Doughnut chart, bar chart, KPI cards, history table
- [x] **Sustainability Goal Tracker** — 10 actions with real-time projected reduction
- [x] **AI Audit Report** — Full markdown report, downloadable offline
- [x] **About & FAQ** — Climate education, emission factors, best practices
- [x] **Optional OpenAI Integration** — GPT-4o support if user provides key
- [x] **CSV Export** — Download calculation history
- [x] **LocalStorage Persistence** — All data stored client-side
- [x] **Accessibility** — ARIA labels, keyboard navigation, skip link, semantic HTML
- [x] **Mobile Responsive** — Full mobile-first design
- [x] **Dark Theme** — Modern green sustainability branding
- [x] **Automated Tests** — 63 tests covering all core logic
- [x] **Vercel Ready** — Zero-config deployment

---

## 🧪 Testing

The test suite validates all core business logic:

```bash
npm test
```

**63 tests** covering:
- Carbon emission calculations (transport, energy, flights, diet)
- Score generation (exponential decay model)
- Risk classification (boundary testing at 30, 31, 70, 71)
- Recommendation engine (primary/secondary focus identification)
- Audit report generation (content validation)
- Sustainability goals (structure and reduction values)

---

## 🔮 Future Improvements

- **PWA Support** — Service worker for full offline capability and app-like experience
- **Multi-language** — i18n support for global accessibility
- **Regional Emission Factors** — Country-specific grid electricity and transport factors
- **Social Sharing** — Share Carbon Score cards on social media
- **Team Dashboards** — Collaborative footprint tracking for organizations
- **Gamification** — Achievement badges and streak tracking for goal completion
- **Data Visualization** — Treemap, radar chart, and comparison views
- **Carbon Offset Marketplace** — Integration with verified offset providers
- **Push Notifications** — Reminders for sustainability goal check-ins
- **Machine Learning** — Predictive modeling based on historical patterns

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with 💚 for the Hack2Skill Carbon Footprint Awareness Challenge
  <br/>
  <strong>EcoTrace AI</strong> — Understand, Track, and Reduce Your Carbon Footprint
</p>
