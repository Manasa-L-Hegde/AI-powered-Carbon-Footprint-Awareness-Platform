import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { Activity, AlertTriangle, ShieldCheck, Download, Trash, Trash2, PieChart, TrendingUp, History, Info, Leaf, Check } from 'lucide-react';

export default function Dashboard({ history, onDelete, onClearAll, commits, onUpdateCommits }) {
  const breakdownCanvasRef = useRef(null);
  const historyCanvasRef = useRef(null);
  const breakdownChartRef = useRef(null);
  const historyChartRef = useRef(null);

  const activeProfile = history.length > 0 ? history[history.length - 1] : null;
  const NATIONAL_AVERAGE = 8.0;

  // Calculate offsets based on commits
  const offsets = [
    { id: 'bulb', label: 'Convert to LED lighting', desc: 'Saves electricity', val: 0.45 },
    { id: 'meatless', label: 'Meatless Mondays', desc: 'Eat vegetarian one day a week', val: 0.80 },
    { id: 'thermostat', label: 'Install Smart Thermostat', desc: 'Saves natural gas heating', val: 1.20 },
    { id: 'carpool', label: 'Carpool to Work', desc: 'Cuts weekly private mileage by 30%', val: 0.95 }
  ];

  const activeOffsetsSum = offsets.reduce((sum, item) => {
    return sum + (commits[item.id] ? item.val : 0);
  }, 0);

  const currentTotal = activeProfile ? activeProfile.total : 0;
  const offsetPercent = currentTotal > 0 ? Math.round((activeOffsetsSum / currentTotal) * 100) : 0;
  const newTotal = Math.max(0, currentTotal - activeOffsetsSum);

  const handleCommitChange = (id) => {
    onUpdateCommits({
      ...commits,
      [id]: !commits[id]
    });
  };

  // Build / Update charts
  useEffect(() => {
    // 1. Breakdown Chart (Doughnut)
    if (breakdownCanvasRef.current) {
      if (breakdownChartRef.current) breakdownChartRef.current.destroy();

      const dataset = activeProfile 
        ? [activeProfile.transport, activeProfile.energy, activeProfile.flights, activeProfile.diet]
        : [2.5, 2.0, 1.5, 1.8]; // seed defaults

      breakdownChartRef.current = new Chart(breakdownCanvasRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Transport', 'Home Energy', 'Flights', 'Diet & Lifestyle'],
          datasets: [{
            data: dataset,
            backgroundColor: ['#10b981', '#34d399', '#38bdf8', '#fbbf24'],
            borderWidth: 2,
            borderColor: '#0f172a',
            hoverOffset: 10
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                color: '#94a3b8',
                font: { family: 'Inter', size: 11 }
              }
            }
          },
          cutout: '70%'
        }
      });
    }

    // 2. History Chart (Bar)
    if (historyCanvasRef.current) {
      if (historyChartRef.current) historyChartRef.current.destroy();

      const labels = history.map(item => item.name);
      const dataValues = history.map(item => item.total);

      historyChartRef.current = new Chart(historyCanvasRef.current, {
        type: 'bar',
        data: {
          labels: labels.length > 0 ? labels : ['No Entries'],
          datasets: [{
            label: 'Tons CO2e',
            data: dataValues.length > 0 ? dataValues : [0],
            backgroundColor: 'rgba(52, 211, 153, 0.15)',
            borderColor: '#34d399',
            borderWidth: 2,
            borderRadius: 6,
            borderSkipped: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: { color: '#64748b' }
            },
            x: {
              grid: { display: false },
              ticks: { color: '#64748b' }
            }
          },
          plugins: {
            legend: { display: false }
          }
        }
      });
    }

    return () => {
      if (breakdownChartRef.current) breakdownChartRef.current.destroy();
      if (historyChartRef.current) historyChartRef.current.destroy();
    };
  }, [history, activeProfile]);

  // CSV Exporter
  const handleExportCSV = () => {
    if (history.length === 0) return;
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Date,Entry Name,Transport (Tons),Energy (Tons),Flights (Tons),Diet (Tons),Total Footprint (Tons)\r\n";

    history.forEach(entry => {
      const row = [
        `"${entry.date}"`,
        `"${entry.name.replace(/"/g, '""')}"`,
        entry.transport.toFixed(2),
        entry.energy.toFixed(2),
        entry.flights.toFixed(2),
        entry.diet.toFixed(2),
        entry.total.toFixed(2)
      ].join(",");
      csvContent += row + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `EcoTrace_Carbon_History_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const diff = activeProfile ? activeProfile.total - NATIONAL_AVERAGE : 0;
  const diffPercent = Math.round((Math.abs(diff) / NATIONAL_AVERAGE) * 100);

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      
      {/* Big Number Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-md flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="font-heading font-black text-3xl text-white">
              {activeProfile ? `${activeProfile.total.toFixed(1)} T` : '0.0 T'}
            </div>
            <div className="text-slate-400 text-xs mt-0.5">Annual Carbon Footprint</div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-md flex items-center gap-5">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
            diff <= 0 
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
              : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
          }`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className={`font-heading font-black text-3xl ${diff <= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {activeProfile 
                ? `${diff <= 0 ? '-' : '+'}${diffPercent}%` 
                : 'No Audit'}
            </div>
            <div className="text-slate-400 text-xs mt-0.5">VS National Average ({NATIONAL_AVERAGE} T)</div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-md flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="font-heading font-black text-3xl text-sky-400">
              {activeOffsetsSum.toFixed(2)} T
            </div>
            <div className="text-slate-400 text-xs mt-0.5">Saved via Commits</div>
          </div>
        </div>
      </div>

      {/* Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-md">
          <h3 className="font-heading font-bold text-lg text-white mb-6 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-emerald-400" /> Sector Emissions Breakdown
          </h3>
          <div className="h-64 relative">
            <canvas ref={breakdownCanvasRef}></canvas>
          </div>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-md">
          <h3 className="font-heading font-bold text-lg text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" /> Calculation Audit History
          </h3>
          <div className="h-64 relative">
            <canvas ref={historyCanvasRef}></canvas>
          </div>
        </div>
      </div>

      {/* Reduction Commitments Checklist (Highly interactive) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-md">
        <h3 className="font-heading font-bold text-lg text-white mb-2 flex items-center gap-2">
          <Leaf className="w-5 h-5 text-emerald-400" /> Carbon Reduction checklist
        </h3>
        <p className="text-slate-400 text-sm mb-6 max-w-xl">
          Commit to environmental habits below. We will recalculate your footprint offsets and track your progress in real-time.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 flex flex-col gap-3">
            {offsets.map((item) => {
              const checked = commits[item.id];
              return (
                <label 
                  key={item.id}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 cursor-pointer hover:border-emerald-500/30 transition-all"
                >
                  <input 
                    type="checkbox" 
                    checked={checked} 
                    onChange={() => handleCommitChange(item.id)}
                    className="sr-only" 
                  />
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center mt-0.5 transition-all ${
                    checked 
                      ? 'bg-emerald-500 border-emerald-500 text-slate-950 shadow-[0_0_8px_rgba(16,185,129,0.2)]' 
                      : 'border-slate-700 bg-slate-950'
                  }`}>
                    {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <div className="flex-1">
                    <h5 className={`font-semibold text-sm transition-colors ${checked ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                      {item.label}
                    </h5>
                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    checked ? 'bg-slate-950 text-slate-600' : 'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    -{item.val} T
                  </span>
                </label>
              );
            })}
          </div>

          <div className="p-6 rounded-2xl bg-slate-950/40 border border-slate-800 flex flex-col items-center text-center">
            <h4 className="font-heading font-bold text-sm text-slate-300">Off-Setting Progress</h4>
            
            <div className="my-6">
              <span className="font-heading font-black text-4xl text-emerald-400">
                {activeOffsetsSum.toFixed(2)}
              </span>
              <span className="text-slate-500 text-xs block mt-1">Tons CO2e avoided</span>
            </div>

            {/* Progress Bar container */}
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mb-3">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_8px_rgba(16,185,129,0.3)] transition-all duration-300"
                style={{ width: `${Math.min(100, offsetPercent)}%` }}
              ></div>
            </div>

            <div className="w-full flex justify-between text-xs text-slate-500">
              <span>{offsetPercent}% Reduced</span>
              <span>New Score Total: {newTotal.toFixed(2)} T</span>
            </div>
          </div>
        </div>
      </div>

      {/* History table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-400" /> Carbon Calculation Log
          </h3>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={handleExportCSV}
              disabled={history.length === 0}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300 hover:border-emerald-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
            <button
              onClick={onClearAll}
              disabled={history.length === 0}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-rose-950/40 bg-rose-500/10 text-rose-400 text-xs font-semibold hover:bg-rose-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Trash className="w-3.5 h-3.5" /> Clear History
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/30 text-slate-400">
                <th className="p-4 font-semibold text-xs uppercase">Date</th>
                <th className="p-4 font-semibold text-xs uppercase">Audit Name</th>
                <th className="p-4 font-semibold text-xs uppercase">Transport</th>
                <th className="p-4 font-semibold text-xs uppercase">Energy</th>
                <th className="p-4 font-semibold text-xs uppercase">Flights</th>
                <th className="p-4 font-semibold text-xs uppercase">Diet</th>
                <th className="p-4 font-semibold text-xs uppercase">Total</th>
                <th className="p-4 font-semibold text-xs uppercase">Status</th>
                <th className="p-4 font-semibold text-xs uppercase text-right">Delete</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-slate-500">
                    No calculations found. Navigate to the Carbon Calculator page to log your footprint.
                  </td>
                </tr>
              ) : (
                [...history].reverse().map((entry) => {
                  let statusColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
                  let statusText = 'Low Impact';
                  if (entry.total > 10.0) {
                    statusColor = 'text-rose-400 bg-rose-500/10 border-rose-500/20';
                    statusText = 'High Impact';
                  } else if (entry.total > 6.0) {
                    statusColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
                    statusText = 'Moderate';
                  }
                  
                  return (
                    <tr key={entry.id} className="border-b border-slate-800/60 hover:bg-slate-900/20 transition-all">
                      <td className="p-4 text-slate-400 font-medium">{entry.date}</td>
                      <td className="p-4 text-white font-bold">{entry.name}</td>
                      <td className="p-4 text-slate-300">{entry.transport.toFixed(1)} T</td>
                      <td className="p-4 text-slate-300">{entry.energy.toFixed(1)} T</td>
                      <td className="p-4 text-slate-300">{entry.flights.toFixed(1)} T</td>
                      <td className="p-4 text-slate-300">{entry.diet.toFixed(1)} T</td>
                      <td className="p-4 text-emerald-400 font-extrabold">{entry.total.toFixed(1)} Tons</td>
                      <td className="p-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase ${statusColor}`}>
                          {statusText}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => onDelete(entry.id)}
                          className="p-1.5 rounded-lg bg-slate-950 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-950/40 transition-colors"
                          title="Delete record"
                        >
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
