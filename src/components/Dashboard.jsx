import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { Activity, AlertTriangle, ShieldCheck, Download, Trash, Trash2, TrendingUp, History, Leaf, Check, Target, Award } from 'lucide-react';
import { classifyRisk, SUSTAINABILITY_GOALS, NATIONAL_AVERAGE } from '../utils/carbonEngine';

const RISK_BADGE = {
  emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
  rose: 'bg-rose-500/10 border-rose-500/20 text-rose-400'
};

export default function Dashboard({ history, onDelete, onClearAll, goals, onUpdateGoals }) {
  const pieRef = useRef(null);
  const barRef = useRef(null);
  const pieChart = useRef(null);
  const barChart = useRef(null);

  const latest = history.length > 0 ? history[history.length - 1] : null;
  const score = latest?.score ?? 0;
  const risk = classifyRisk(score);

  // Goal reduction calculations
  const activeReduction = SUSTAINABILITY_GOALS.reduce((sum, g) => sum + (goals[g.id] ? g.reduction : 0), 0);
  const currentTotal = latest ? latest.total : 0;
  const projectedTotal = Math.max(0, currentTotal - activeReduction);
  const reductionPercent = currentTotal > 0 ? Math.round((activeReduction / currentTotal) * 100) : 0;
  const goalsCompleted = SUSTAINABILITY_GOALS.filter(g => goals[g.id]).length;

  const diff = latest ? latest.total - NATIONAL_AVERAGE : 0;
  const diffPercent = Math.round((Math.abs(diff) / NATIONAL_AVERAGE) * 100);

  // Chart rendering
  useEffect(() => {
    if (pieRef.current) {
      if (pieChart.current) pieChart.current.destroy();
      const data = latest ? [latest.transport, latest.energy, latest.flights, latest.diet] : [2.5, 2.0, 1.5, 1.8];
      pieChart.current = new Chart(pieRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Transport', 'Home Energy', 'Flights', 'Diet & Lifestyle'],
          datasets: [{ data, backgroundColor: ['#10b981','#34d399','#38bdf8','#fbbf24'], borderWidth: 2, borderColor: '#0f172a', hoverOffset: 10 }]
        },
        options: {
          responsive: true, maintainAspectRatio: false, cutout: '70%',
          plugins: { legend: { position: 'right', labels: { color: '#94a3b8', font: { family: 'Inter', size: 11 }, padding: 12 } } }
        }
      });
    }

    if (barRef.current) {
      if (barChart.current) barChart.current.destroy();
      const labels = history.map(h => h.name);
      const values = history.map(h => h.total);
      barChart.current = new Chart(barRef.current, {
        type: 'bar',
        data: {
          labels: labels.length > 0 ? labels : ['No Entries'],
          datasets: [{ label: 'Tons CO2e', data: values.length > 0 ? values : [0], backgroundColor: 'rgba(52,211,153,0.15)', borderColor: '#34d399', borderWidth: 2, borderRadius: 6, borderSkipped: false }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          scales: { y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748b' } }, x: { grid: { display: false }, ticks: { color: '#64748b' } } },
          plugins: { legend: { display: false } }
        }
      });
    }
    return () => { pieChart.current?.destroy(); barChart.current?.destroy(); };
  }, [history, latest]);

  // CSV export
  const handleExportCSV = () => {
    if (history.length === 0) return;
    let csv = "data:text/csv;charset=utf-8,Date,Name,Transport,Energy,Flights,Diet,Total,Score\r\n";
    history.forEach(e => { csv += `"${e.date}","${e.name.replace(/"/g,'""')}",${e.transport.toFixed(2)},${e.energy.toFixed(2)},${e.flights.toFixed(2)},${e.diet.toFixed(2)},${e.total.toFixed(2)},${e.score}\r\n`; });
    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = `EcoTrace_History_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in">

      {/* ── Top KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Emissions */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="font-heading font-black text-2xl text-white">{latest ? `${latest.total.toFixed(1)} T` : '—'}</div>
            <div className="text-slate-500 text-xs">Annual Footprint</div>
          </div>
        </div>

        {/* Carbon Score */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 flex items-center gap-4">
          <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${RISK_BADGE[risk.color]}`}>
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className={`font-heading font-black text-2xl ${risk.color === 'emerald' ? 'text-emerald-400' : risk.color === 'amber' ? 'text-amber-400' : 'text-rose-400'}`}>{latest ? `${score}/100` : '—'}</div>
            <div className="text-slate-500 text-xs">Carbon Score</div>
          </div>
        </div>

        {/* Risk Level */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 flex items-center gap-4">
          <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${diff <= 0 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className={`font-heading font-black text-2xl ${diff <= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{latest ? `${diff <= 0 ? '-' : '+'}${diffPercent}%` : '—'}</div>
            <div className="text-slate-500 text-xs">vs National Avg ({NATIONAL_AVERAGE}T)</div>
          </div>
        </div>

        {/* Goals Saved */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="font-heading font-black text-2xl text-sky-400">{activeReduction.toFixed(1)} T</div>
            <div className="text-slate-500 text-xs">Projected Savings</div>
          </div>
        </div>
      </div>

      {/* Risk Badge Banner */}
      {latest && (
        <div className={`p-4 rounded-2xl border flex items-center gap-3 ${RISK_BADGE[risk.color]} animate-slide-up`} role="status" aria-label={`Carbon risk level: ${risk.label}`}>
          <ShieldCheck className="w-5 h-5 flex-shrink-0" />
          <div>
            <span className="font-heading font-bold text-sm">{risk.label}</span>
            <span className="text-xs opacity-80 ml-2">— {risk.description}</span>
          </div>
        </div>
      )}

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-md">
          <h3 className="font-heading font-bold text-lg text-white mb-6 flex items-center gap-2">
            <span className="text-emerald-400">◉</span> Sector Breakdown
          </h3>
          <div className="h-64 relative"><canvas ref={pieRef} aria-label="Pie chart showing emissions by category" role="img"></canvas></div>
        </div>
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-md">
          <h3 className="font-heading font-bold text-lg text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" /> Audit Trend
          </h3>
          <div className="h-64 relative"><canvas ref={barRef} aria-label="Bar chart showing emissions over time" role="img"></canvas></div>
        </div>
      </div>

      {/* ── Sustainability Goal Tracker ── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-md" id="goal-tracker">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-400" /> Sustainability Goal Tracker
            </h3>
            <p className="text-slate-400 text-xs mt-1 max-w-lg">Commit to sustainability actions below. Your projected footprint reduction updates dynamically.</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
            {goalsCompleted}/{SUSTAINABILITY_GOALS.length} Active
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Goal checkboxes */}
          <div className="lg:col-span-2 flex flex-col gap-2.5">
            {SUSTAINABILITY_GOALS.map(goal => {
              const checked = goals[goal.id] || false;
              return (
                <label key={goal.id} className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${checked ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-slate-950/30 border-slate-800/80 hover:border-emerald-500/15'}`} htmlFor={`goal-${goal.id}`}>
                  <input type="checkbox" id={`goal-${goal.id}`} checked={checked} onChange={() => onUpdateGoals({ ...goals, [goal.id]: !checked })} className="sr-only" />
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center mt-0.5 flex-shrink-0 transition-all ${checked ? 'bg-emerald-500 border-emerald-500 text-slate-950 shadow-[0_0_8px_rgba(16,185,129,0.2)]' : 'border-slate-700 bg-slate-950'}`}>
                    {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-base" aria-hidden="true">{goal.icon}</span>
                      <h5 className={`font-semibold text-sm transition-colors ${checked ? 'line-through text-slate-500' : 'text-slate-200'}`}>{goal.label}</h5>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{goal.desc}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full flex-shrink-0 ${checked ? 'bg-slate-950 text-slate-600' : 'bg-emerald-500/10 text-emerald-400'}`}>
                    -{goal.reduction} T
                  </span>
                </label>
              );
            })}
          </div>

          {/* Progress summary */}
          <div className="p-6 rounded-2xl bg-slate-950/40 border border-slate-800 flex flex-col items-center text-center sticky top-24">
            <h4 className="font-heading font-bold text-sm text-slate-300 mb-1">Reduction Progress</h4>
            <div className="my-5 relative">
              <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120" aria-hidden="true">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#1e293b" strokeWidth="8" />
                <circle cx="60" cy="60" r="52" fill="none" stroke="url(#grad)" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${Math.min(100, reductionPercent) * 3.27} 327`} className="transition-all duration-700" />
                <defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#10b981"/><stop offset="100%" stopColor="#14b8a6"/></linearGradient></defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-heading font-black text-2xl text-emerald-400">{reductionPercent}%</span>
                <span className="text-[10px] text-slate-500">reduced</span>
              </div>
            </div>
            <div className="w-full space-y-2 text-xs">
              <div className="flex justify-between text-slate-400"><span>Current</span><span className="text-white font-bold">{currentTotal.toFixed(1)} T</span></div>
              <div className="flex justify-between text-slate-400"><span>Saved</span><span className="text-emerald-400 font-bold">-{activeReduction.toFixed(1)} T</span></div>
              <div className="flex justify-between border-t border-slate-800 pt-2 text-slate-300"><span className="font-semibold">Projected</span><span className="font-heading font-bold text-emerald-400">{projectedTotal.toFixed(1)} T</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* ── History Table ── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-400" /> Calculation Log
          </h3>
          <div className="flex gap-2 w-full sm:w-auto">
            <button id="export-csv-btn" onClick={handleExportCSV} disabled={history.length===0} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300 hover:border-emerald-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
            <button id="clear-history-btn" onClick={onClearAll} disabled={history.length===0} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-rose-950/40 bg-rose-500/10 text-rose-400 text-xs font-semibold hover:bg-rose-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
              <Trash className="w-3.5 h-3.5" /> Clear All
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse" aria-label="Carbon calculation history">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/30 text-slate-400">
                <th className="p-4 font-semibold text-xs uppercase">Date</th>
                <th className="p-4 font-semibold text-xs uppercase">Name</th>
                <th className="p-4 font-semibold text-xs uppercase">Transport</th>
                <th className="p-4 font-semibold text-xs uppercase">Energy</th>
                <th className="p-4 font-semibold text-xs uppercase">Flights</th>
                <th className="p-4 font-semibold text-xs uppercase">Diet</th>
                <th className="p-4 font-semibold text-xs uppercase">Total</th>
                <th className="p-4 font-semibold text-xs uppercase">Score</th>
                <th className="p-4 font-semibold text-xs uppercase">Risk</th>
                <th className="p-4 font-semibold text-xs uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr><td colSpan="10" className="p-8 text-center text-slate-500">No calculations yet. Use the Calculator to log your first footprint.</td></tr>
              ) : (
                [...history].reverse().map(entry => {
                  const entryRisk = classifyRisk(entry.score);
                  return (
                    <tr key={entry.id} className="border-b border-slate-800/60 hover:bg-slate-900/20 transition-all">
                      <td className="p-4 text-slate-400 font-medium whitespace-nowrap">{entry.date}</td>
                      <td className="p-4 text-white font-bold">{entry.name}</td>
                      <td className="p-4 text-slate-300">{entry.transport.toFixed(1)}</td>
                      <td className="p-4 text-slate-300">{entry.energy.toFixed(1)}</td>
                      <td className="p-4 text-slate-300">{entry.flights.toFixed(1)}</td>
                      <td className="p-4 text-slate-300">{entry.diet.toFixed(1)}</td>
                      <td className="p-4 text-emerald-400 font-extrabold">{entry.total.toFixed(1)} T</td>
                      <td className="p-4 font-bold">{entry.score}</td>
                      <td className="p-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase ${RISK_BADGE[entryRisk.color]}`}>
                          {entryRisk.label}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={()=>onDelete(entry.id)} className="p-1.5 rounded-lg bg-slate-950 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-950/40 transition-colors" title="Delete record" aria-label={`Delete ${entry.name}`}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
