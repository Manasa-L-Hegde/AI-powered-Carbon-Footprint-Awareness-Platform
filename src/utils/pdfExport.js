/**
 * PDF Export Utility for EcoTrace
 * Generates a professional sustainability report PDF using jsPDF.
 */
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { BENCHMARKS, calculateSustainabilityIndex, getUnlockedAchievements, generateRecommendations } from './carbonEngine';

const EMERALD = [16, 185, 129];
const DARK_BG = [3, 7, 18];
const SLATE_700 = [51, 65, 85];
const WHITE = [255, 255, 255];
const SLATE_300 = [203, 213, 225];

export function exportPDF(profile, history, goals) {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageW = doc.internal.pageSize.getWidth();
  let y = 15;

  // ── Header ──
  doc.setFillColor(...DARK_BG);
  doc.rect(0, 0, pageW, 40, 'F');
  doc.setFillColor(...EMERALD);
  doc.rect(0, 38, pageW, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...EMERALD);
  doc.text('EcoTrace AI', 15, 18);
  doc.setFontSize(10);
  doc.setTextColor(...SLATE_300);
  doc.text('Carbon Footprint Sustainability Report', 15, 26);
  doc.setFontSize(8);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 15, 33);

  y = 48;

  // ── Emission Overview ──
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...WHITE);
  doc.text('Emission Profile Overview', 15, y);
  y += 8;

  doc.autoTable({
    startY: y,
    head: [['Metric', 'Value']],
    body: [
      ['Total Annual Footprint', `${profile.total.toFixed(1)} Tons CO2e`],
      ['Carbon Score', `${profile.score} / 100`],
      ['Risk Classification', profile.risk.label],
      ['Transport Emissions', `${profile.transport.toFixed(2)} T`],
      ['Energy Emissions', `${profile.energy.toFixed(2)} T`],
      ['Flight Emissions', `${profile.flights.toFixed(2)} T`],
      ['Diet & Lifestyle', `${profile.diet.toFixed(2)} T`],
    ],
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 4, textColor: SLATE_300, fillColor: [15, 23, 42], lineColor: SLATE_700, lineWidth: 0.3 },
    headStyles: { fillColor: EMERALD, textColor: WHITE, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [30, 41, 59] },
    margin: { left: 15, right: 15 },
  });

  y = doc.lastAutoTable.finalY + 12;

  // ── Benchmark Comparison ──
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...WHITE);
  doc.text('Benchmark Comparison', 15, y);
  y += 8;

  const benchRows = Object.values(BENCHMARKS).map(b => {
    const diff = profile.total - b.value;
    const status = diff <= 0 ? 'Below' : 'Above';
    return [b.label, `${b.value} T`, `${profile.total.toFixed(1)} T`, `${diff > 0 ? '+' : ''}${diff.toFixed(1)} T (${status})`];
  });

  doc.autoTable({
    startY: y,
    head: [['Benchmark', 'Target', 'Your Footprint', 'Difference']],
    body: benchRows,
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 4, textColor: SLATE_300, fillColor: [15, 23, 42], lineColor: SLATE_700, lineWidth: 0.3 },
    headStyles: { fillColor: EMERALD, textColor: WHITE, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [30, 41, 59] },
    margin: { left: 15, right: 15 },
  });

  y = doc.lastAutoTable.finalY + 12;

  // ── Sustainability Index ──
  const si = calculateSustainabilityIndex(profile);
  if (si) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(...WHITE);
    doc.text('Sustainability Index', 15, y);
    y += 8;

    doc.autoTable({
      startY: y,
      head: [['Category', 'Score', 'Rating']],
      body: [
        ['Transport', `${si.transport}/100`, si.transport >= 70 ? 'Excellent' : si.transport >= 40 ? 'Good' : 'Needs Improvement'],
        ['Energy', `${si.energy}/100`, si.energy >= 70 ? 'Excellent' : si.energy >= 40 ? 'Good' : 'Needs Improvement'],
        ['Food & Diet', `${si.food}/100`, si.food >= 70 ? 'Excellent' : si.food >= 40 ? 'Good' : 'Needs Improvement'],
        ['Flights', `${si.flights}/100`, si.flights >= 70 ? 'Excellent' : si.flights >= 40 ? 'Good' : 'Needs Improvement'],
        ['Overall', `${si.overall}/100`, si.overall >= 70 ? 'Excellent' : si.overall >= 40 ? 'Good' : 'Needs Improvement'],
      ],
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 4, textColor: SLATE_300, fillColor: [15, 23, 42], lineColor: SLATE_700, lineWidth: 0.3 },
      headStyles: { fillColor: EMERALD, textColor: WHITE, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [30, 41, 59] },
      margin: { left: 15, right: 15 },
    });

    y = doc.lastAutoTable.finalY + 12;
  }

  // ── Check if we need a new page ──
  if (y > 230) { doc.addPage(); y = 20; }

  // ── Achievements ──
  const achievements = getUnlockedAchievements(history, goals);
  const unlocked = achievements.filter(a => a.unlocked);
  if (unlocked.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(...WHITE);
    doc.text('Achievements Unlocked', 15, y);
    y += 8;

    doc.autoTable({
      startY: y,
      head: [['Achievement', 'Description']],
      body: unlocked.map(a => [a.title, a.desc]),
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 4, textColor: SLATE_300, fillColor: [15, 23, 42], lineColor: SLATE_700, lineWidth: 0.3 },
      headStyles: { fillColor: EMERALD, textColor: WHITE, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [30, 41, 59] },
      margin: { left: 15, right: 15 },
    });

    y = doc.lastAutoTable.finalY + 12;
  }

  // ── Recommendations ──
  if (y > 230) { doc.addPage(); y = 20; }
  const recs = generateRecommendations(profile);
  if (recs) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(...WHITE);
    doc.text('AI Recommendations', 15, y);
    y += 8;

    const recRows = [
      ...recs.primary.tips.map(t => [`${recs.primary.name}`, t.action, t.impact.toUpperCase()]),
      ...recs.secondary.tips.map(t => [`${recs.secondary.name}`, t.action, t.impact.toUpperCase()]),
    ];

    doc.autoTable({
      startY: y,
      head: [['Category', 'Action', 'Impact']],
      body: recRows,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 4, textColor: SLATE_300, fillColor: [15, 23, 42], lineColor: SLATE_700, lineWidth: 0.3 },
      headStyles: { fillColor: EMERALD, textColor: WHITE, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [30, 41, 59] },
      margin: { left: 15, right: 15 },
    });

    y = doc.lastAutoTable.finalY + 12;
  }

  // ── Footer ──
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFillColor(...DARK_BG);
    doc.rect(0, 285, pageW, 12, 'F');
    doc.setFontSize(7);
    doc.setTextColor(...SLATE_300);
    doc.text('EcoTrace AI • Calculations aligned with EPA carbon coefficient standards • No API key required', 15, 291);
    doc.text(`Page ${i} of ${totalPages}`, pageW - 30, 291);
  }

  doc.save(`EcoTrace_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
}
