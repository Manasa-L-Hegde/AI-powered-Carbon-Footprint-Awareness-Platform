# 🌿 EcoTrace AI — Carbon Footprint Awareness Platform

> **AI-powered, fully offline carbon footprint calculator with reduction simulator, 30-day action planner, benchmark comparisons, sustainability index, achievement system, and PDF export.**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Manasa-L-Hegde/AI-powered-Carbon-Footprint-Awareness-Platform)

---

## 🏆 Key Features

| Feature | Description |
|---|---|
| **Multi-Step Calculator** | 4-step guided form covering transport, energy, flights, and diet with EPA-validated emission factors |
| **Carbon Reduction Simulator** | Select 14+ sustainability actions and instantly see projected footprint reduction with percentage savings |
| **AI 30-Day Action Planner** | AI-generated weekly sustainability goals personalized to your highest emission category |
| **Benchmark Comparison** | Compare your footprint against India average (1.9T), global average (4.0T), US average (8.0T), and Paris Agreement target (2.0T) |
| **Sustainability Index** | Per-category scores (Transport, Energy, Food, Flights) and overall score out of 100 |
| **Achievement System** | 6 unlockable badges: Green Beginner → Carbon Saver → Climate Champion → Tracker Pro → Goal Setter → Eco Warrior |
| **Interactive Dashboard** | Doughnut + bar charts (Chart.js), KPI cards, goal tracker with animated ring visualization |
| **AI Recommendations** | Context-aware sustainability advice powered by local decision engine — no API key required |
| **PDF Export** | Download a complete professional sustainability report with dark-themed tables |
| **CSV Export** | Export full calculation history as CSV |
| **Audit Reports** | Full audit reports with risk classification, reduction estimates, and actionable insights |
| **OpenAI Integration** | Optional GPT-4o-mini powered analysis (API key stored locally only) |
| **100% Offline** | All core features work without internet. Zero API dependencies for calculations |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        EcoTrace AI                          │
│                    (React 18 + Vite 5)                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │   Home   │ │Calculator│ │Dashboard │ │    AI    │       │
│  │  Page    │ │  4-Step  │ │  + KPIs  │ │Assistant │       │
│  └──────────┘ └──────────┘ └────┬─────┘ └──────────┘       │
│                                 │                           │
│              ┌──────────────────┼──────────────────┐        │
│              │                  │                  │        │
│  ┌───────────▼──┐ ┌────────────▼───┐ ┌────────────▼───┐    │
│  │  Simulator   │ │  Benchmark     │ │ Sustainability │    │
│  │  (14 actions)│ │  Comparison    │ │    Index       │    │
│  └──────────────┘ └────────────────┘ └────────────────┘    │
│              │                  │                  │        │
│  ┌───────────▼──┐ ┌────────────▼───┐ ┌────────────▼───┐    │
│  │  Action      │ │  Achievement   │ │  PDF Export    │    │
│  │  Planner     │ │  System        │ │  (jsPDF)       │    │
│  └──────────────┘ └────────────────┘ └────────────────┘    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│              Carbon Engine (Pure Functions)                  │
│  ┌─────────┐ ┌──────────┐ ┌─────────┐ ┌──────────────┐     │
│  │Emission │ │Scoring & │ │Recommend│ │ Memoization  │     │
│  │Calc     │ │Risk Class│ │Engine   │ │ Cache        │     │
│  └─────────┘ └──────────┘ └─────────┘ └──────────────┘     │
├─────────────────────────────────────────────────────────────┤
│              localStorage (Client-Side Persistence)         │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧠 AI Logic & Methodology

### Emission Calculation Engine

All calculations use EPA and DEFRA emission factors:

| Source | Factor | Unit |
|---|---|---|
| Petrol Car | 0.18 | kg CO2e/km |
| Diesel Car | 0.17 | kg CO2e/km |
| Hybrid | 0.09 | kg CO2e/km |
| Electric Vehicle | 0.05 | kg CO2e/km |
| Public Transit | 0.04 | kg CO2e/km |
| Grid Electricity | 0.38 | kg CO2e/kWh |
| Natural Gas | 2.03 | kg CO2e/m³ |
| Short-haul Flight | 0.25 | kg CO2e/km |
| Long-haul Flight | 0.14 | kg CO2e/km |

### Carbon Score Algorithm

```
Score = max(1, min(100, round(100 × e^(-Total/12))))
```

- **0 Tons** → Score **100** (perfect)
- **8 Tons (US avg)** → Score **~51**
- **16 Tons** → Score **~26** (high impact)

### Risk Classification

| Score Range | Level | Classification |
|---|---|---|
| 71-100 | LOW | Low Impact (Green) |
| 31-70 | MEDIUM | Medium Impact (Amber) |
| 0-30 | HIGH | High Impact (Red) |

### Sustainability Index

Per-category exponential scoring:
```
Transport Score = 100 × e^(-transport/3)
Energy Score    = 100 × e^(-energy/3)
Food Score      = 100 × e^(-diet/2)
Flight Score    = 100 × e^(-flights/2)
Overall         = Average of all four
```

### Smart Recommendation Engine

1. **Categorize** emissions into transport, energy, flights, diet
2. **Sort** categories by emission value (descending)
3. **Select** top 3 high/medium-impact tips for primary source
4. **Select** top 2 tips for secondary source
5. **Estimate** reduction potential based on impact levels

### Carbon Reduction Simulator

- 14 pre-defined sustainability actions with scientifically-backed CO2 reduction estimates
- Real-time projected footprint recalculation
- Percentage reduction and annual CO2 savings display

### AI 30-Day Action Planner

- Identifies highest emission category from user profile
- Generates 4-week structured plan with specific daily/weekly tasks
- Includes bonus tips from secondary emission category

---

## 📁 Project Structure

```
src/
├── App.jsx                    # Root component, routing, state management
├── main.jsx                   # React DOM entry point
├── index.css                  # Global styles, animations, scrollbar customization
├── components/
│   ├── Home.jsx               # Landing page with feature showcase
│   ├── Calculator.jsx         # 4-step emission calculator with validation
│   ├── Dashboard.jsx          # Analytics hub integrating all sub-components
│   ├── AIAssistant.jsx        # Recommendations, audit reports, optional OpenAI
│   ├── About.jsx              # Methodology, FAQ, best practices
│   ├── Simulator.jsx          # Carbon Reduction Simulator
│   ├── BenchmarkComparison.jsx # Benchmark comparison bars
│   ├── ActionPlanner.jsx      # AI 30-Day Action Planner
│   ├── SustainabilityIndex.jsx # Category sustainability scores
│   └── Achievements.jsx       # Achievement badge system
├── utils/
│   ├── carbonEngine.js        # Core calculation engine (memoized)
│   └── pdfExport.js           # jsPDF-based PDF report generator
└── tests/
    └── carbonEngine.test.js   # Unit tests for emission calculations
```

---

## 🛡️ Accessibility

- **Skip navigation link** for keyboard users
- **ARIA labels** on all interactive elements, charts, and regions
- **ARIA roles** (navigation, main, tablist, radiogroup, status, region)
- **Keyboard navigation** support with visible focus indicators
- **Screen reader** compatible with proper `aria-current`, `aria-expanded`, `aria-pressed`
- **Color contrast** meeting WCAG 2.1 AA standards
- **Focus-visible** outlines on all focusable elements
- **Print styles** for clean document output

---

## ⚡ Performance Optimizations

- **Memoization cache** in carbon engine for repeated calculations
- **`useMemo`** for expensive computations (goal reduction, simulator, sustainability index)
- **`useCallback`** for event handlers to prevent unnecessary re-renders
- **Component decomposition** — new features are separate lazy-loadable components
- **Chart.js cleanup** — proper `destroy()` on unmount prevents memory leaks
- **localStorage batching** — efficient state persistence

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm 9+

### Installation

```bash
git clone https://github.com/Manasa-L-Hegde/AI-powered-Carbon-Footprint-Awareness-Platform.git
cd AI-powered-Carbon-Footprint-Awareness-Platform
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm run preview
```

### Run Tests

```bash
npm test
```

---

## 🌐 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import repository in [Vercel Dashboard](https://vercel.com)
3. Framework: **Vite** (auto-detected)
4. Build command: `npm run build`
5. Output directory: `dist`

No environment variables required — all features work offline.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | UI framework with hooks |
| **Vite 5** | Build tool and dev server |
| **Chart.js 4** | Interactive doughnut and bar charts |
| **jsPDF + AutoTable** | Professional PDF report generation |
| **Tailwind CSS 3** | Utility-first styling |
| **Lucide React** | Modern icon library |
| **localStorage** | Client-side data persistence |

---

## 📊 Benchmarks Used

| Benchmark | Value | Source |
|---|---|---|
| India Average | 1.9 Tons CO2e/yr | World Bank 2023 |
| Global Average | 4.0 Tons CO2e/yr | Our World in Data |
| US National Average | 8.0 Tons CO2e/yr | EPA GHG Inventory |
| Paris Agreement Target | 2.0 Tons CO2e/yr | UNFCCC 1.5°C Pathway |

---

## 📝 License

MIT License — feel free to use, modify, and distribute.

---

*Built with 💚 for a sustainable future • No API keys required • 100% client-side*
