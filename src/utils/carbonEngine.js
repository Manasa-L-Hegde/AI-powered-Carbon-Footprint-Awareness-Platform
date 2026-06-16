/**
 * EcoTrace Carbon Engine v2.0
 * ─────────────────────────────────────────────────────────
 * Pure-function utilities for emission calculation, scoring,
 * risk classification, context-aware recommendations,
 * carbon reduction simulation, benchmarking, sustainability
 * index, achievements, and 30-day action planning.
 * 
 * All logic runs entirely offline — no API keys required.
 */

// ── Memoization Cache ─────────────────────────────────────
const _cache = new Map();
function memoize(key, fn) {
  if (_cache.has(key)) return _cache.get(key);
  const result = fn();
  if (_cache.size > 100) _cache.clear();
  _cache.set(key, result);
  return result;
}
export function clearCache() { _cache.clear(); }

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

// ── Benchmark Data ─────────────────────────────────────────
export const BENCHMARKS = {
  india:         { label: 'India Average',          value: 1.9,  color: 'sky',     icon: '🇮🇳' },
  global:        { label: 'Global Average',         value: 4.0,  color: 'amber',   icon: '🌍' },
  national:      { label: 'National Average (US)',  value: 8.0,  color: 'slate',   icon: '🇺🇸' },
  parisTarget:   { label: 'Paris Agreement Target', value: 2.0,  color: 'emerald', icon: '🎯' },
};

// ── Emission Calculation ───────────────────────────────────
export function calculateEmissions(formData) {
  const cacheKey = JSON.stringify(formData);
  return memoize(`calc_${cacheKey}`, () => {
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
  });
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

// ── Sustainability Index (0-100 per category) ──────────────
export function calculateSustainabilityIndex(profile) {
  if (!profile) return null;
  // Lower emissions = higher score. Benchmarked against reasonable max per category.
  const transportScore = Math.max(0, Math.min(100, Math.round(100 * Math.exp(-profile.transport / 3))));
  const energyScore    = Math.max(0, Math.min(100, Math.round(100 * Math.exp(-profile.energy / 3))));
  const foodScore      = Math.max(0, Math.min(100, Math.round(100 * Math.exp(-profile.diet / 2))));
  const flightScore    = Math.max(0, Math.min(100, Math.round(100 * Math.exp(-profile.flights / 2))));
  const overall        = Math.round((transportScore + energyScore + foodScore + flightScore) / 4);
  return { transport: transportScore, energy: energyScore, food: foodScore, flights: flightScore, overall };
}

// ── Achievement System ─────────────────────────────────────
export const ACHIEVEMENTS = [
  { id: 'green_beginner',   title: 'Green Beginner',    icon: '🌱', desc: 'Complete your first carbon calculation',     check: (h) => h.length >= 1 },
  { id: 'carbon_saver',     title: 'Carbon Saver',      icon: '💚', desc: 'Achieve a Carbon Score of 50 or above',      check: (h) => h.some(e => e.score >= 50) },
  { id: 'climate_champion', title: 'Climate Champion',  icon: '🏆', desc: 'Achieve a Carbon Score of 75 or above',      check: (h) => h.some(e => e.score >= 75) },
  { id: 'tracker_pro',      title: 'Tracker Pro',       icon: '📊', desc: 'Log 5 or more calculations',                check: (h) => h.length >= 5 },
  { id: 'goal_setter',      title: 'Goal Setter',       icon: '🎯', desc: 'Activate 3 or more sustainability goals',    check: (_, g) => Object.values(g || {}).filter(Boolean).length >= 3 },
  { id: 'eco_warrior',      title: 'Eco Warrior',       icon: '⚔️', desc: 'Reduce footprint below Paris Agreement target (2T)', check: (h) => h.some(e => e.total <= 2.0) },
];

export function getUnlockedAchievements(history, goals) {
  return ACHIEVEMENTS.map(a => ({ ...a, unlocked: a.check(history, goals) }));
}

// ── Carbon Reduction Simulator Actions ─────────────────────
export const SIMULATOR_ACTIONS = [
  { id: 'switch_ev',       label: 'Switch to Electric Vehicle',     category: 'transport', reduction: 1.8,  icon: '🔋' },
  { id: 'wfh_3days',       label: 'Work from Home 3 Days/Week',     category: 'transport', reduction: 0.9,  icon: '🏠' },
  { id: 'public_transit',  label: 'Use Public Transit Daily',       category: 'transport', reduction: 1.2,  icon: '🚌' },
  { id: 'cycle_commute',   label: 'Cycle for Short Commutes',       category: 'transport', reduction: 0.6,  icon: '🚲' },
  { id: 'solar_panels',    label: 'Install Solar Panels',           category: 'energy',    reduction: 2.5,  icon: '☀️' },
  { id: 'green_energy',    label: 'Switch to Green Energy Tariff',  category: 'energy',    reduction: 1.8,  icon: '⚡' },
  { id: 'smart_thermo',    label: 'Install Smart Thermostat',       category: 'energy',    reduction: 1.1,  icon: '🌡️' },
  { id: 'led_bulbs',       label: 'Switch All Lights to LED',       category: 'energy',    reduction: 0.45, icon: '💡' },
  { id: 'no_flights',      label: 'Eliminate Non-Essential Flights', category: 'flights',   reduction: 2.0,  icon: '✈️' },
  { id: 'train_over_fly',  label: 'Take Train Instead of Flying',   category: 'flights',   reduction: 1.2,  icon: '🚄' },
  { id: 'go_vegan',        label: 'Adopt a Vegan Diet',             category: 'diet',      reduction: 1.5,  icon: '🥬' },
  { id: 'meatless_days',   label: 'Meatless 4 Days/Week',           category: 'diet',      reduction: 0.9,  icon: '🥗' },
  { id: 'compost',         label: 'Compost All Food Waste',          category: 'diet',      reduction: 0.35, icon: '♻️' },
  { id: 'local_food',      label: 'Buy Only Local Produce',          category: 'diet',      reduction: 0.4,  icon: '🌾' },
];

export function simulateReduction(currentTotal, selectedActionIds) {
  const totalReduction = SIMULATOR_ACTIONS
    .filter(a => selectedActionIds.includes(a.id))
    .reduce((sum, a) => sum + a.reduction, 0);
  const projected = Math.max(0, round2(currentTotal - totalReduction));
  const percentReduction = currentTotal > 0 ? Math.round((totalReduction / currentTotal) * 100) : 0;
  return { projected, totalReduction: round2(totalReduction), percentReduction };
}

// ── AI 30-Day Action Planner ───────────────────────────────
export function generate30DayPlan(profile) {
  if (!profile) return null;
  const categories = [
    { key: 'transport', value: profile.transport },
    { key: 'energy',    value: profile.energy },
    { key: 'flights',   value: profile.flights },
    { key: 'diet',      value: profile.diet },
  ].sort((a, b) => b.value - a.value);

  const topCategory = categories[0].key;
  const secondCategory = categories[1].key;

  const weeklyPlans = {
    transport: [
      { week: 1, title: 'Audit Your Commute',           tasks: ['Log daily commute distances', 'Research public transit routes', 'Calculate fuel costs vs transit pass'] },
      { week: 2, title: 'Switch to Green Commuting',     tasks: ['Take transit 3+ days this week', 'Walk/cycle for errands under 3km', 'Try carpooling with a colleague'] },
      { week: 3, title: 'Optimize Vehicle Efficiency',   tasks: ['Check and inflate tires to spec', 'Remove unnecessary cargo weight', 'Plan combined trips to reduce mileage'] },
      { week: 4, title: 'Commit to the Change',          tasks: ['Set a monthly car-km budget', 'Explore EV/hybrid for next purchase', 'Calculate monthly savings achieved'] },
    ],
    energy: [
      { week: 1, title: 'Energy Audit Week',             tasks: ['Read your electricity meter daily', 'Identify phantom power drains', 'List all incandescent bulbs'] },
      { week: 2, title: 'Quick Wins',                    tasks: ['Replace 5+ bulbs with LEDs', 'Unplug idle chargers and devices', 'Lower thermostat by 2°C'] },
      { week: 3, title: 'Smart Upgrades',                tasks: ['Research smart thermostat options', 'Seal drafts around windows/doors', 'Switch to cold-water laundry'] },
      { week: 4, title: 'Long-Term Efficiency',          tasks: ['Compare green energy tariffs', 'Set up scheduled power-off routines', 'Track savings vs Week 1 baseline'] },
    ],
    flights: [
      { week: 1, title: 'Travel Audit',                  tasks: ['List all planned flights this year', 'Identify replaceable short-haul flights', 'Research train alternatives'] },
      { week: 2, title: 'Virtual First',                  tasks: ['Replace one meeting with video call', 'Explore virtual conference options', 'Calculate CO2 saved per skipped flight'] },
      { week: 3, title: 'Smart Booking',                  tasks: ['Choose direct flights only', 'Book economy class for next trip', 'Research carbon offset programs'] },
      { week: 4, title: 'Commit to Fewer Flights',        tasks: ['Set an annual flight budget', 'Purchase offsets for essential flights', 'Plan a train-based vacation'] },
    ],
    diet: [
      { week: 1, title: 'Food Footprint Awareness',      tasks: ['Track every meal for carbon impact', 'Identify highest-emission meals', 'Research plant-based alternatives'] },
      { week: 2, title: 'Meatless Momentum',              tasks: ['Go meatless 3 days this week', 'Try 2 new plant-based recipes', 'Shop at a local farmers market'] },
      { week: 3, title: 'Reduce Waste',                   tasks: ['Start a compost bin', 'Plan meals to eliminate food waste', 'Buy seasonal produce only'] },
      { week: 4, title: 'Sustainable Diet Habits',         tasks: ['Maintain 4 meatless days/week', 'Buy in bulk to reduce packaging', 'Calculate dietary CO2 savings'] },
    ],
  };

  return {
    topCategory,
    secondCategory,
    weeks: weeklyPlans[topCategory],
    bonusTips: weeklyPlans[secondCategory]?.[0]?.tasks?.slice(0, 2) || [],
  };
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
    ? `Your footprint is ${Math.abs(recs.percentAboveAverage)}% below the national average of ${NATIONAL_AVERAGE} Tons/yr. Outstanding work!`
    : `Your footprint is ${recs.percentAboveAverage}% above the national average of ${NATIONAL_AVERAGE} Tons/yr. Focused action can close this gap.`;

  return `# 🌿 EcoTrace AI Sustainability Audit Report

---

## 📊 Emission Profile Overview

| Metric | Value |
|---|---|
| **Total Annual Footprint** | ${profile.total.toFixed(1)} Tons CO2e |
| **Carbon Score** | ${profile.score} / 100 |
| **Risk Classification** | ${risk.label} (${risk.level}) |
| **National Average Comparison** | ${comparison} |

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
