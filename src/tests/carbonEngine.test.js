/**
 * EcoTrace Carbon Engine — Test Suite
 * ─────────────────────────────────────────────────────────
 * Run: node src/tests/carbonEngine.test.js
 * 
 * Tests cover:
 *   ✓ Carbon calculation accuracy
 *   ✓ Score generation (exponential decay model)
 *   ✓ Risk classification thresholds
 *   ✓ Recommendation engine logic
 *   ✓ Audit report generation
 */

import {
  calculateEmissions,
  calculateScore,
  classifyRisk,
  generateRecommendations,
  generateAuditReport,
  SUSTAINABILITY_GOALS,
  NATIONAL_AVERAGE
} from '../utils/carbonEngine.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✅ ${message}`);
  } else {
    failed++;
    console.error(`  ❌ FAIL: ${message}`);
  }
}

function approxEqual(a, b, tolerance = 0.1) {
  return Math.abs(a - b) <= tolerance;
}

// ═══════════════════════════════════════════════════════════
console.log('\n🧪 Test Suite: Carbon Calculation\n');

// Test 1: Zero emissions
const zeroInput = {
  carDistance: 0, carType: 'none', transitDistance: 0, motoDistance: 0,
  electricityUsage: 0, gasUsage: 0, heatingOil: 0, houseMembers: 1,
  shortFlights: 0, medFlights: 0, longFlights: 0,
  dietType: 'vegan', recycleHabit: 'full'
};
const zeroResult = calculateEmissions(zeroInput);
assert(zeroResult.transport === 0, 'Zero transport input → 0 transport emissions');
assert(zeroResult.energy === 0, 'Zero energy input → 0 energy emissions');
assert(zeroResult.flights === 0, 'Zero flights → 0 flight emissions');
assert(zeroResult.diet === 0.75, 'Vegan + full recycling → 0.75T diet (0.9 - 0.15)');
assert(zeroResult.total === 0.75, 'Vegan zero-emission lifestyle → 0.75T total');

// Test 2: Typical user
const typicalInput = {
  carDistance: 80, carType: 'petrol', transitDistance: 40, motoDistance: 0,
  electricityUsage: 300, gasUsage: 50, heatingOil: 0, houseMembers: 2,
  shortFlights: 1, medFlights: 0, longFlights: 0,
  dietType: 'balanced', recycleHabit: 'partial'
};
const typicalResult = calculateEmissions(typicalInput);
assert(typicalResult.transport > 0, 'Typical user has transport emissions > 0');
assert(typicalResult.energy > 0, 'Typical user has energy emissions > 0');
assert(typicalResult.flights > 0, 'Typical user has flight emissions > 0');
assert(typicalResult.diet > 0, 'Typical user has diet emissions > 0');
assert(typicalResult.total > 0, 'Total emissions > 0 for typical user');
assert(typicalResult.total === typicalResult.transport + typicalResult.energy + typicalResult.flights + typicalResult.diet,
  'Total = sum of all categories');

// Test 3: Household splitting
const singlePerson = calculateEmissions({ ...typicalInput, houseMembers: 1 });
const fourPerson = calculateEmissions({ ...typicalInput, houseMembers: 4 });
assert(singlePerson.energy > fourPerson.energy, 'Single person has higher per-capita energy than 4-person household');
assert(approxEqual(singlePerson.energy, fourPerson.energy * 4, 0.5), 'Energy scales proportionally with household size');

// Test 4: Car type impacts
const petrolResult = calculateEmissions({ ...typicalInput, carType: 'petrol' });
const evResult = calculateEmissions({ ...typicalInput, carType: 'ev' });
assert(petrolResult.transport > evResult.transport, 'Petrol transport emissions > EV transport emissions');

// Test 5: Diet impact
const meatResult = calculateEmissions({ ...typicalInput, dietType: 'meat-heavy' });
const veganResult = calculateEmissions({ ...typicalInput, dietType: 'vegan' });
assert(meatResult.diet > veganResult.diet, 'Meat-heavy diet > vegan diet emissions');

// ═══════════════════════════════════════════════════════════
console.log('\n🧪 Test Suite: Score Generation\n');

assert(calculateScore(0) === 100, 'Zero emissions → score 100');
assert(calculateScore(1000) === 1, 'Extreme emissions → score 1 (min floor)');
assert(calculateScore(NATIONAL_AVERAGE) >= 45 && calculateScore(NATIONAL_AVERAGE) <= 55,
  `National average (${NATIONAL_AVERAGE}T) yields score near 51`);
assert(calculateScore(4) > calculateScore(12), 'Lower emissions → higher score');
assert(calculateScore(2) > calculateScore(8), '2T has higher score than 8T');

// Monotonic decrease
let prevScore = 101;
let monotonic = true;
for (let t = 0; t <= 50; t += 0.5) {
  const s = calculateScore(t);
  if (s > prevScore) { monotonic = false; break; }
  prevScore = s;
}
assert(monotonic, 'Score decreases monotonically as emissions increase');

// ═══════════════════════════════════════════════════════════
console.log('\n🧪 Test Suite: Risk Classification\n');

// Boundary tests based on spec: 0-30 HIGH, 31-70 MEDIUM, 71-100 LOW
assert(classifyRisk(100).level === 'LOW', 'Score 100 → LOW impact');
assert(classifyRisk(71).level === 'LOW', 'Score 71 → LOW impact (boundary)');
assert(classifyRisk(70).level === 'MEDIUM', 'Score 70 → MEDIUM impact (boundary)');
assert(classifyRisk(50).level === 'MEDIUM', 'Score 50 → MEDIUM impact');
assert(classifyRisk(31).level === 'MEDIUM', 'Score 31 → MEDIUM impact (boundary)');
assert(classifyRisk(30).level === 'HIGH', 'Score 30 → HIGH impact (boundary)');
assert(classifyRisk(1).level === 'HIGH', 'Score 1 → HIGH impact');

// Color coding
assert(classifyRisk(80).color === 'emerald', 'LOW → emerald color');
assert(classifyRisk(50).color === 'amber', 'MEDIUM → amber color');
assert(classifyRisk(20).color === 'rose', 'HIGH → rose color');

// Description is always present
assert(classifyRisk(50).description.length > 0, 'Risk includes description');
assert(classifyRisk(80).label === 'Low Impact', 'LOW label text correct');
assert(classifyRisk(50).label === 'Medium Impact', 'MEDIUM label text correct');
assert(classifyRisk(20).label === 'High Impact', 'HIGH label text correct');

// ═══════════════════════════════════════════════════════════
console.log('\n🧪 Test Suite: Recommendation Engine\n');

// No data
assert(generateRecommendations(null) === null, 'Null profile → null recommendations');

// With data
const profile = { transport: 4.0, energy: 2.0, flights: 1.5, diet: 1.0, total: 8.5, score: 49 };
const recs = generateRecommendations(profile);

assert(recs !== null, 'Valid profile generates recommendations');
assert(recs.primary.key === 'transport', 'Highest emitter (transport 4.0T) identified as primary');
assert(recs.secondary.key === 'energy', 'Second highest (energy 2.0T) identified as secondary');
assert(recs.primary.tips.length >= 2, 'Primary has at least 2 tips');
assert(recs.secondary.tips.length >= 2, 'Secondary has at least 2 tips');
assert(recs.reductionEstimate > 0, 'Reduction estimate is positive');
assert(recs.comparedToAverage > 0, '8.5T is above national average');
assert(recs.percentAboveAverage > 0, 'Percent above average is positive');

// Different primary focus
const energyHeavy = { transport: 1.0, energy: 5.0, flights: 0.5, diet: 1.0, total: 7.5, score: 54 };
const energyRecs = generateRecommendations(energyHeavy);
assert(energyRecs.primary.key === 'energy', 'Energy-heavy profile → energy as primary focus');
assert(energyRecs.primary.name === 'Home Energy', 'Primary name is correct');

const flightHeavy = { transport: 1.0, energy: 1.0, flights: 6.0, diet: 0.5, total: 8.5, score: 49 };
const flightRecs = generateRecommendations(flightHeavy);
assert(flightRecs.primary.key === 'flights', 'Flight-heavy profile → flights as primary focus');

const dietHeavy = { transport: 0.5, energy: 0.5, flights: 0.3, diet: 5.0, total: 6.3, score: 59 };
const dietRecs = generateRecommendations(dietHeavy);
assert(dietRecs.primary.key === 'diet', 'Diet-heavy profile → diet as primary focus');

// ═══════════════════════════════════════════════════════════
console.log('\n🧪 Test Suite: Audit Report\n');

const report = generateAuditReport(profile);
assert(typeof report === 'string', 'Report is a string');
assert(report.includes('EcoTrace AI'), 'Report contains EcoTrace branding');
assert(report.includes('Primary Emission Source'), 'Report includes primary source section');
assert(report.includes('Secondary Emission Source'), 'Report includes secondary source section');
assert(report.includes('Reduction Potential'), 'Report includes reduction potential');
assert(report.includes('Category Breakdown'), 'Report includes full category breakdown');
assert(report.includes(profile.total.toFixed(1)), 'Report includes total emissions value');
assert(report.includes('No API key required'), 'Report states no API key is needed');
assert(report.length > 500, 'Report is substantial (>500 chars)');

// Null profile
const nullReport = generateAuditReport(null);
assert(typeof nullReport === 'string', 'Null profile produces string message');
assert(nullReport.includes('No data'), 'Null profile report indicates no data');

// ═══════════════════════════════════════════════════════════
console.log('\n🧪 Test Suite: Sustainability Goals\n');

assert(SUSTAINABILITY_GOALS.length >= 10, 'At least 10 sustainability goals defined');
assert(SUSTAINABILITY_GOALS.every(g => g.id && g.label && g.reduction > 0), 'All goals have id, label, and positive reduction');
assert(SUSTAINABILITY_GOALS.every(g => ['energy','transport','flights','diet'].includes(g.category)), 'All goals belong to valid categories');

const totalReduction = SUSTAINABILITY_GOALS.reduce((s, g) => s + g.reduction, 0);
assert(totalReduction > 5, 'Total possible reduction > 5 Tons');

// ═══════════════════════════════════════════════════════════
console.log('\n' + '═'.repeat(50));
console.log(`\n📊 Results: ${passed} passed, ${failed} failed, ${passed + failed} total\n`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 All tests passed!\n');
  process.exit(0);
}
