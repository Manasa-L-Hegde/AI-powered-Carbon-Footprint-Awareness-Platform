# EcoTrace | AI-Powered Carbon Footprint Awareness Platform

EcoTrace is an interactive React application built with Tailwind CSS, Chart.js, and an OpenAI-ready AI Assistant designed to calculate, analyze, and offset carbon emissions.

---

## 🚀 Key Features

*   **Multi-Step Auditing Wizard:** Input data across land travel (car engine types), household utilities (electricity, natural gas, heating oil), flight distances (short/medium/long haul takeoff adjustments), and dietary habits.
*   **Scientific Calculation Modeling:** Estimates equivalents utilizing greenhouse coefficients compiled matching **EPA** guidelines.
*   **Carbon score mapping:** Translates emissions into a relative Score (from 1 to 100) using an exponential decay function:
    $$\text{Score} = 100 \times e^{-\frac{\text{Emissions}}{12}}$$
*   **Analytical Dashboards:** Powered by Chart.js, featuring category breakdown doughnuts and historical bar charts.
*   **Interactive Offset Checklist:** Commit to eco-friendly habits and instantly visualize reductions in your carbon profile stats.
*   **OpenAI-Ready AI Consultant:** Audits carbon entries and provides tailored tips.
    *   *Direct Connection:* Connect your OpenAI key securely (stored in local memory).
    *   *Smart Fallback:* Runs offline deterministic rule engines if no key is present.
*   **Accessibility & Security Compliant:** Fully semantic tags, screen-reader compatibility, and browser-secured state logs.

---

## 🛠️ Tech Stack

*   **Framework:** React (v18)
*   **Styling:** Tailwind CSS
*   **Bundler:** Vite
*   **Visualization:** Chart.js
*   **Iconography:** Lucide React

---

## 💻 Local Setup & Installation

Since Node.js is required for building a React app locally:

1.  **Clone / Download the project files.**
2.  **Ensure Node.js is installed on your computer.**
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Run in development mode:**
    ```bash
    npm run dev
    ```
    Open `http://localhost:3000` to preview.

---

## ☁️ Vercel Deployment

EcoTrace is ready for deployment on **Vercel**:

### Option 1: Vercel CLI
If you have Vercel CLI installed:
```bash
# Install CLI globally
npm install -g vercel

# Run deployment
vercel
```

### Option 2: Git Repository (Recommended)
1.  Push your files to a GitHub, GitLab, or Bitbucket repository.
2.  Log in to [Vercel](https://vercel.com) and click **Add New Project**.
3.  Import your repository.
4.  Vercel will automatically auto-detect **Vite** and configure the settings:
    *   **Framework Preset:** `Vite`
    *   **Build Command:** `npm run build`
    *   **Output Directory:** `dist`
5.  Click **Deploy**.
