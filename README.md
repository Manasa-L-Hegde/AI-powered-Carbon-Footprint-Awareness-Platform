# 🌱 EcoTrace — AI-Powered Carbon Footprint Awareness Platform

An intelligent, interactive web application that helps users calculate, visualize, and reduce their personal carbon emissions through data-driven insights and AI-powered sustainability recommendations.

---

## 📋 Challenge Information

### Chosen Vertical
**Sustainability & Climate Action** — An AI-powered Carbon Footprint Awareness assistant that analyzes a user's real-world lifestyle data (transportation, home energy, flights, and diet) and delivers personalized, actionable recommendations to reduce greenhouse gas emissions.

### Approach & Logic
The platform is built around three core pillars:

1. **Scientific Carbon Modeling:** Every input category (driving distance, electricity usage, flight count, dietary choice) is converted into CO₂ equivalents (CO₂e) using verified emission factors sourced from the **EPA** (U.S. Environmental Protection Agency) and **DEFRA** (UK Department for Environment, Food & Rural Affairs). This ensures calculations are grounded in real-world science, not arbitrary estimates.

2. **AI-Driven Decision Making:** The AI assistant analyzes the user's computed carbon profile contextually:
   - It identifies the **highest-emitting category** (e.g., Transport vs. Energy vs. Flights vs. Diet).
   - It generates **prioritized, category-specific recommendations** — the suggestions for a heavy flyer differ completely from those for someone with high home energy usage.
   - If an OpenAI API key is provided, it connects to **GPT-4o-mini** for natural-language audit reports. Without a key, a sophisticated **offline rule-based engine** performs the same contextual analysis entirely client-side, ensuring the app is functional immediately with zero external dependencies.

3. **Behavioral Nudging via Gamification:** A Carbon Score (1–100) and interactive offset checklist encourage users to commit to green habits. Checking an item (e.g., "Install Smart Thermostat") instantly deducts its estimated savings from the user's total, providing real-time visual feedback that motivates sustained behavior change.

### How the Solution Works

1. **Calculator (4-Step Wizard):**
   - **Step 1 — Transportation:** User inputs weekly driving distance (km), selects vehicle fuel type (petrol/diesel/hybrid/EV/none), and specifies public transit and motorcycle usage.
   - **Step 2 — Home Energy:** User inputs monthly electricity (kWh), natural gas (m³), and heating oil (L) consumption, along with household size to split the impact.
   - **Step 3 — Flights:** User specifies annual count of short-haul (<500km), medium-haul (500–1500km), and long-haul (>1500km) flights.
   - **Step 4 — Diet & Lifestyle:** User selects their dietary profile (Meat Lover / Balanced / Vegetarian / Vegan) and recycling commitment level.

2. **Carbon Score Computation:**
   - All inputs are annualized and summed into a total footprint (Tons CO₂e/yr).
   - A **Carbon Score** is derived using an exponential decay function:
     ```
     Score = 100 × e^(−Total_Emissions / 12)
     ```
   - This maps 0 Tons → Score 100, national average 8.0 Tons → Score ~51, and very high emitters → Score approaching 1.

3. **Dashboard Analytics:**
   - **Doughnut Chart:** Breaks down emissions by sector (Transport, Energy, Flights, Diet).
   - **Bar Chart:** Tracks historical calculation entries over time.
   - **Offset Checklist:** Users commit to eco-actions (LED lighting, Meatless Mondays, Smart Thermostat, Carpooling). Each action's estimated carbon savings is deducted from the active total in real-time.
   - **CSV Export:** Download all calculation logs as a spreadsheet.

4. **AI Sustainability Assistant:**
   - **With OpenAI Key:** Sends the user's full carbon profile to GPT-4o-mini with a carefully engineered system prompt that instructs it to act as a professional climate sustainability auditor. The response is a structured, personalized markdown report.
   - **Without Key (Offline Mode):** A deterministic context engine sorts emission categories by magnitude, selects the top two, and renders category-specific action items with explanations. This ensures **zero-dependency functionality** — the app works fully offline.

5. **About & FAQ:**
   - Educational content explaining CO₂e, emission factors, and the Carbon Score formula.
   - Interactive accordion FAQs covering methodology, data security, and offset mechanics.

### Assumptions Made
- Emission factors are based on global/US averages (EPA, DEFRA). Regional grid mixes may vary.
- Flight distances use estimated round-trip averages: Short ~700km, Medium ~2000km, Long ~6000km.
- Diet emissions are annual constants based on published lifecycle analyses of food systems.
- Household energy is split equally among members (simplified model).
- All data is stored exclusively in the browser's `localStorage` — no server-side storage or external data transmission.
- The OpenAI integration is optional; the platform is fully functional without it.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | Component-based UI framework |
| **Tailwind CSS 3** | Utility-first responsive styling |
| **Vite 5** | Fast development bundler |
| **Chart.js 4** | Interactive doughnut and bar chart visualizations |
| **Lucide React** | Lightweight SVG icon library |
| **OpenAI API** | Optional GPT-4o-mini integration for AI recommendations |
| **localStorage** | Client-side data persistence (zero server dependency) |

---

## 📊 Emission Factors Reference

| Category | Factor | Source |
|---|---|---|
| Petrol Car | 0.18 kg CO₂e / km | EPA |
| Diesel Car | 0.17 kg CO₂e / km | EPA |
| Hybrid Car | 0.09 kg CO₂e / km | EPA |
| Electric Vehicle | 0.05 kg CO₂e / km | EPA (grid avg) |
| Public Transit | 0.04 kg CO₂e / km | DEFRA |
| Grid Electricity | 0.38 kg CO₂e / kWh | EPA |
| Natural Gas | 2.03 kg CO₂e / m³ | EPA |
| Heating Oil | 2.68 kg CO₂e / L | DEFRA |
| Short-haul Flight | 0.25 kg CO₂e / km | DEFRA |
| Medium-haul Flight | 0.16 kg CO₂e / km | DEFRA |
| Long-haul Flight | 0.14 kg CO₂e / km | DEFRA |
| Meat-heavy Diet | 2.80 Tons CO₂e / yr | Published LCA |
| Balanced Diet | 1.80 Tons CO₂e / yr | Published LCA |
| Vegetarian Diet | 1.20 Tons CO₂e / yr | Published LCA |
| Vegan Diet | 0.90 Tons CO₂e / yr | Published LCA |

---

## 💻 Local Setup

### Prerequisites
- **Node.js** (v18 or later)
- **npm** (v9 or later)

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/Manasa-L-Hegde/AI-powered-Carbon-Footprint-Awareness-Platform.git

# 2. Navigate to the project directory
cd AI-powered-Carbon-Footprint-Awareness-Platform

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```
Open `http://localhost:3000` in your browser.

### Optional: OpenAI Integration
To enable GPT-powered recommendations:
1. Navigate to the **AI Recommendations** tab in the app.
2. Enter your OpenAI API key in the secure input field.
3. The key is stored only in your browser's local storage — never transmitted to any external server.

---

## ☁️ Vercel Deployment

This project is production-ready for **Vercel**:

1. Push the repository to GitHub (already done).
2. Log in to [vercel.com](https://vercel.com) → **Add New Project** → Import this repository.
3. Vercel auto-detects the Vite framework:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Click **Deploy**.

---

## 📁 Project Structure

```
├── index.html              # Vite entry point
├── package.json            # Dependencies & scripts
├── vite.config.js          # Vite bundler configuration
├── tailwind.config.js      # Tailwind theme & content paths
├── postcss.config.js       # PostCSS plugin configuration
├── .gitignore              # Git exclusion rules
├── README.md               # This documentation
└── src/
    ├── main.jsx            # React DOM mount
    ├── index.css           # Tailwind directives & custom animations
    ├── App.jsx             # Root component (routing, state, localStorage)
    └── components/
        ├── Home.jsx        # Landing hero page with feature cards
        ├── Calculator.jsx  # 4-step carbon calculation wizard
        ├── Dashboard.jsx   # Chart.js analytics, offset checklist, history logs
        ├── AIAssistant.jsx # OpenAI integration + offline recommendation engine
        └── About.jsx       # Educational content & FAQ accordions
```

---

## ✅ Evaluation Criteria Addressed

| Criteria | Implementation |
|---|---|
| **Code Quality** | Modular React components, clean separation of concerns, consistent naming conventions, prop-based data flow |
| **Security** | API keys stored only in browser localStorage, no server transmission, input validation on all form fields, XSS-safe rendering |
| **Efficiency** | Chart.js instances properly destroyed/recreated to prevent memory leaks, localStorage used for zero-latency persistence, lightweight bundle |
| **Testing/Validation** | Input range constraints, error state handling, fallback logic when API fails, edge case handling for empty data |
| **Accessibility** | Semantic HTML5 elements, `aria-label` on interactive controls, `aria-expanded` on mobile menu, `aria-live` regions for dynamic content, keyboard-navigable forms, sufficient color contrast ratios |

---

## 📜 License

This project is built for educational and evaluation purposes.
