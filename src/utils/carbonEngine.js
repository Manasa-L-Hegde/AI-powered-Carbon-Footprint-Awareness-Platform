/**
 * EcoTrace Carbon Engine
 * ─────────────────────────────────────────────────────────
 * Pure-function utilities for emission calculation, scoring,
 * risk classification, and context-aware recommendations.
 * 
 * All logic runs entirely offline — no API keys required.
 */

// ── Emission Factors ───────────────────────────────────────
export const EMISSION_FACTORS = {
  car: { petrol: 0.18, diesel: 0.17, hybrid: 0.09, ev: 0.05, none: 0 },
  transit: 0.04,       // kg CO2e per km
  motorcycle: 0.10,    // kg CO2e per km
  electricity: 0.38,   // kg CO2e per kWh
  naturalGas: 2.03,    // kg CO2e per m³
  heatingOil: 2.68,    // kg CO2e per litre
  flights: {
    short:  { distance: 700,  factor: 0.25 },   // round-trip km, kg/km
    medium: { distance: 2000, factor: 0.16 },
    long:   { distance: 6000, factor: 0.14 }
  },
  diet: {
    'meat-heavy': 2.8,
    balanced:     1.8,
    vegetarian:   1.2,
    vegan:        0.9
  },
  waste: {
    none:    0.20,
    partial: 0.05,
    full:   -0.15
  }
};

export const NATIONAL_AVERAGE = 8.0; // Tons CO2e per year

// ── Emission Calculation ───────────────────────────────────
export function calculateEmissions(formData) {
  const carFactor = EMISSION_FACTORS.car[formData.carType] || 0;

  // 1. Transport (weekly → annual)
  const transportKg = (
    (formData.carDistance * carFactor) +
    (formData.transitDistance * EMISSION_FACTORS.transit) +
    (formData.motoDistance * EMISSION_FACTORS.motorcycle)
  ) * 52;

  // 2. Home Energy (monthly → annual, split by household)
  const members = Math.max(1, formData.houseMembers || 1);
  const energyKg = (
    (formData.electricityUsage * EMISSION_FACTORS.electricity) +
    (formData.gasUsage * EMISSION_FACTORS.naturalGas) +
    (formData.heatingOil * EMISSION_FACTORS.heatingOil)
  ) * 12 / members;

  // 3. Flights (annual)
  const flightsKg = (
    (formData.shortFlights * EMISSION_FACTORS.flights.short.distance * EMISSION_FACTORS.flights.short.factor) +
    (formData.medFlights * EMISSION_FACTORS.flights.medium.distance * EMISSION_FACTORS.flights.medium.factor) +
    (formData.longFlights * EMISSION_FACTORS.flights.long.distance * EMISSION_FACTORS.flights.long.factor)
  );

  // 4. Diet & Lifestyle (annual)
  const dietTons = EMISSION_FACTORS.diet[formData.dietType] || 1.8;
  const wasteTons = EMISSION_FACTORS.waste[formData.recycleHabit] || 0.05;
  const lifestyleKg = (dietTons + wasteTons) * 1000;

  // Convert to Tons
  const transport = round2(transportKg / 1000);
  const energy    = round2(energyKg / 1000);
  const flights   = round2(flightsKg / 1000);
  const diet      = round2(lifestyleKg / 1000);
  const total     = round2(transport + energy + flights + diet);

  const score = calculateScore(total);
  const risk  = classifyRisk(score);

  return { transport, energy, flights, diet, total, score, risk };
}

// ── Score Calculation ──────────────────────────────────────
export function calculateScore(totalTons) {
  // Exponential decay: 0 tons → 100, 8 tons → ~51
  return Math.max(1, Math.min(100, Math.round(100 * Math.exp(-totalTons / 12))));
}

// ── Risk Classification ────────────────────────────────────
export function classifyRisk(score) {
  if (score >= 71) return { level: 'LOW',    label: 'Low Impact',    color: 'emerald', description: 'Your carbon footprint is well below the national average. Maintain your sustainable habits and inspire others.' };
  if (score >= 31) return { level: 'MEDIUM', label: 'Medium Impact', color: 'amber',   description: 'Your footprint is moderate. Targeted lifestyle changes in your top emission categories can significantly lower it.' };
  return              { level: 'HIGH',   label: 'High Impact',   color: 'rose',    description: 'Your carbon footprint is above average. Immediate action in your highest-emission areas is strongly recommended.' };
}

// ── Sustainability Goals ───────────────────────────────────
export const SUSTAINABILITY_GOALS = [
  { id: 'led',         label: 'Switch to LED Bulbs',        desc: 'Reduce lighting energy by up to 80%',                reduction: 0.45, category: 'energy',    icon: '💡' },
  { id: 'drive_less',  label: 'Reduce Driving by 20%',      desc: 'Walk, bike, or work remotely more often',            reduction: 0.70, category: 'transport', icon: '🚗' },
  { id: 'transit',     label: 'Use Public Transport Weekly', desc: 'Replace car commutes with bus/train',                reduction: 0.85, category: 'transport', icon: '🚌' },
  { id: 'flights',     label: 'Reduce Flights by 50%',      desc: 'Use video calls, trains for short trips',            reduction: 1.20, category: 'flights',   icon: '✈️' },
  { id: 'thermostat',  label: 'Install Smart Thermostat',   desc: 'Optimize heating/cooling schedules automatically',   reduction: 1.10, category: 'energy',    icon: '🌡️' },
  { id: 'renewable',   label: 'Switch to Renewable Energy', desc: 'Choose green energy tariff from utility provider',   reduction: 1.80, category: 'energy',    icon: '☀️' },
  { id: 'meatless',    label: 'Go Meatless 3 Days/Week',   desc: 'Reduce red meat consumption significantly',          reduction: 0.90, category: 'diet',      icon: '🥗' },
  { id: 'compost',     label: 'Compost Food Waste',         desc: 'Divert organic waste from methane-producing landfills', reduction: 0.35, category: 'diet',   icon: '♻️' },
  { id: 'carpool',     label: 'Carpool to Work',            desc: 'Share rides to cut per-person fuel usage',           reduction: 0.65, category: 'transport', icon: '🤝' },
  { id: 'unplug',      label: 'Unplug Idle Electronics',    desc: 'Eliminate phantom power drain',                      reduction: 0.25, category: 'energy',    icon: '🔌' }
];

// ── Smart Recommendation Engine ────────────────────────────
const RECOMMENDATION_DB = {
  transport: {
    title: 'Transportation',
    icon: '🚗',
    tips: [
      { action: 'Switch to an Electric Vehicle (EV)', impact: 'high', detail: 'EVs produce ~70% fewer emissions than petrol vehicles over their lifetime, including manufacturing.' },
      { action: 'Carpool or ride-share for daily commutes', impact: 'high', detail: 'Sharing rides divides fuel consumption proportionally — 4 riders = 75% less emissions per person.' },
      { action: 'Use cycling for trips under 5km', impact: 'medium', detail: 'Short car trips are the least fuel-efficient. Cycling eliminates these emissions entirely.' },
      { action: 'Work from home 2-3 days per week', impact: 'medium', detail: 'Remote work can reduce commute emissions by 40-60% without lifestyle sacrifice.' },
      { action: 'Keep tires properly inflated and engine tuned', impact: 'low', detail: 'Proper maintenance improves fuel efficiency by 3-5%, compounding over the year.' },
      { action: 'Prefer public transit for urban commutes', impact: 'high', detail: 'Buses and trains emit 50-80% less CO2 per passenger-km than single-occupancy cars.' }
    ]
  },
  energy: {
    title: 'Home Energy',
    icon: '⚡',
    tips: [
      { action: 'Switch to a certified renewable energy provider', impact: 'high', detail: 'Green tariffs source electricity from wind/solar, virtually eliminating grid-electricity emissions.' },
      { action: 'Install a smart thermostat (e.g., Nest, Ecobee)', impact: 'high', detail: 'Smart thermostats learn your patterns and reduce heating/cooling waste by 15-23%.' },
      { action: 'Replace all lighting with LED bulbs', impact: 'medium', detail: 'LEDs use 80% less energy than incandescent bulbs and last 25x longer.' },
      { action: 'Upgrade to Energy Star rated appliances', impact: 'medium', detail: 'Energy-efficient refrigerators, washers, and dryers can cut home energy use by 10-30%.' },
      { action: 'Improve home insulation and seal drafts', impact: 'high', detail: 'Proper insulation can reduce heating energy by 20-30%, paying for itself in 2-4 years.' },
      { action: 'Use cold water for laundry when possible', impact: 'low', detail: 'Heating water accounts for ~90% of washing machine energy use.' }
    ]
  },
  flights: {
    title: 'Air Travel',
    icon: '✈️',
    tips: [
      { action: 'Replace short-haul flights with high-speed rail', impact: 'high', detail: 'Trains emit 6-10x less CO2 than equivalent flights for distances under 500km.' },
      { action: 'Reduce international flights by consolidating trips', impact: 'high', detail: 'One fewer transatlantic round-trip saves approximately 1.6 tons CO2e.' },
      { action: 'Purchase verified carbon offsets for necessary flights', impact: 'medium', detail: 'Quality offset programs (Gold Standard, Verra) invest in renewable energy and reforestation.' },
      { action: 'Choose direct flights over connections', impact: 'medium', detail: 'Takeoff and landing are the most fuel-intensive phases — stopovers multiply this impact.' },
      { action: 'Fly economy class instead of business', impact: 'medium', detail: 'Business class has 2-3x the per-passenger emissions due to seat space allocation.' },
      { action: 'Use video conferencing for business meetings', impact: 'high', detail: 'Virtual meetings eliminate travel emissions entirely and save both time and money.' }
    ]
  },
  diet: {
    title: 'Diet & Lifestyle',
    icon: '🥗',
    tips: [
      { action: 'Adopt plant-based meals at least 3 days per week', impact: 'high', detail: 'Replacing beef with plant protein can reduce dietary emissions by up to 60%.' },
      { action: 'Choose locally-sourced and seasonal produce', impact: 'medium', detail: 'Local food travels fewer miles, and seasonal growing avoids energy-intensive greenhouses.' },
      { action: 'Reduce food waste through meal planning', impact: 'medium', detail: 'Food waste in landfills produces methane — 80x more potent than CO2 over 20 years.' },
      { action: 'Start composting organic kitchen waste', impact: 'medium', detail: 'Composting diverts waste from landfills and creates nutrient-rich soil amendment.' },
      { action: 'Replace beef and lamb with poultry or fish', impact: 'high', detail: 'Beef produces 10x more emissions than chicken and 50x more than legumes per kg of protein.' },
      { action: 'Buy in bulk to reduce packaging waste', impact: 'low', detail: 'Packaging production and waste disposal contribute to both emissions and pollution.' }
    ]
  }
};

export function generateRecommendations(profile) {
  if (!profile) return null;

  const categories = [
    { key: 'transport', name: 'Transportation',    value: profile.transport },
    { key: 'energy',    name: 'Home Energy',        value: profile.energy },
    { key: 'flights',   name: 'Air Travel',         value: profile.flights },
    { key: 'diet',      name: 'Diet & Lifestyle',   value: profile.diet }
  ];

  // Sort by emission value descending
  const sorted = [...categories].sort((a, b) => b.value - a.value);
  const primary   = sorted[0];
  const secondary = sorted[1];
  const risk      = classifyRisk(profile.score);

  // Pick top 3 high/medium-impact tips for primary, top 2 for secondary
  const primaryTips   = RECOMMENDATION_DB[primary.key].tips.filter(t => t.impact !== 'low').slice(0, 3);
  const secondaryTips = RECOMMENDATION_DB[secondary.key].tips.filter(t => t.impact !== 'low').slice(0, 2);

  // Estimate reduction potential
  const reductionEstimate = round2(
    primaryTips.reduce((s, t) => s + (t.impact === 'high' ? 0.8 : 0.4), 0) +
    secondaryTips.reduce((s, t) => s + (t.impact === 'high' ? 0.6 : 0.3), 0)
  );

  return {
    profile: {
      total: profile.total,
      score: profile.score,
      risk
    },
    primary: {
      ...primary,
      icon: RECOMMENDATION_DB[primary.key].icon,
      tips: primaryTips
    },
    secondary: {
      ...secondary,
      icon: RECOMMENDATION_DB[secondary.key].icon,
      tips: secondaryTips
    },
    allCategories: sorted,
    reductionEstimate,
    comparedToAverage: round2(profile.total - NATIONAL_AVERAGE),
    percentAboveAverage: Math.round(((profile.total - NATIONAL_AVERAGE) / NATIONAL_AVERAGE) * 100)
  };
}

// ── Audit Report Generator ─────────────────────────────────
export function generateAuditReport(profile) {
  const recs = generateRecommendations(profile);
  if (!recs) return 'No data available. Please complete a carbon calculation first.';

  const risk = recs.profile.risk;
  const comparison = recs.comparedToAverage <= 0
    ? `🌟 Your footprint is **${Math.abs(recs.percentAboveAverage)}% below** the national average of ${NATIONAL_AVERAGE} Tons/yr. Outstanding work!`
    : `⚠️ Your footprint is **${recs.percentAboveAverage}% above** the national average of ${NATIONAL_AVERAGE} Tons/yr. Focused action can close this gap.`;

  return `# 🌿 EcoTrace AI Sustainability Audit Report

---

## 📊 Emission Profile Overview

| Metric | Value |
|---|---|
| **Total Annual Footprint** | ${profile.total.toFixed(1)} Tons CO2e |
| **Carbon Score** | ${profile.score} / 100 |
| **Risk Classification** | ${risk.label} (${risk.level}) |
| **National Average Comparison** | ${comparison.replace(/[*#]/g, '')} |

---

## 🚨 Primary Emission Source: ${recs.primary.icon} ${recs.primary.name}

**Contribution:** ${recs.primary.value.toFixed(2)} Tons CO2e/yr (${Math.round((recs.primary.value / profile.total) * 100)}% of total)

${recs.primary.tips.map((t, i) => `### ${i + 1}. ${t.action}
> **Impact Level:** ${t.impact.toUpperCase()}
> ${t.detail}`).join('\n\n')}

---

## 💡 Secondary Emission Source: ${recs.secondary.icon} ${recs.secondary.name}

**Contribution:** ${recs.secondary.value.toFixed(2)} Tons CO2e/yr (${Math.round((recs.secondary.value / profile.total) * 100)}% of total)

${recs.secondary.tips.map((t, i) => `### ${i + 1}. ${t.action}
> **Impact Level:** ${t.impact.toUpperCase()}
> ${t.detail}`).join('\n\n')}

---

## 📈 Estimated Reduction Potential

By implementing the recommendations above, you could reduce your footprint by approximately **${recs.reductionEstimate} Tons CO2e** annually, bringing your projected total to **${Math.max(0, profile.total - recs.reductionEstimate).toFixed(1)} Tons**.

---

## 📋 Full Category Breakdown

| Category | Emissions (Tons) | Share |
|---|---|---|
${recs.allCategories.map(c => `| ${c.name} | ${c.value.toFixed(2)} | ${Math.round((c.value / profile.total) * 100)}% |`).join('\n')}

---

*Report generated offline by EcoTrace AI Engine • ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • No API key required*`;
}

// ── Utilities ──────────────────────────────────────────────
function round2(n) {
  return Math.round(n * 100) / 100;
}
