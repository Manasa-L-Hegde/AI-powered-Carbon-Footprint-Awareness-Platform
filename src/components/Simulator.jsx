import React, { useState, useMemo, useCallback } from 'react';
import { Sliders, TrendingDown, RotateCcw, Leaf } from 'lucide-react';
import { SIMULATOR_ACTIONS, simulateReduction } from '../utils/carbonEngine';

const CATEGORY_LABELS = { transport: 'Transport', energy: 'Energy', flights: 'Flights', diet: 'Diet' };
const CATEGORY_COLORS = {
  transport: 'emerald', energy: 'sky', flights: 'amber', diet: 'violet'
};
const COLOR_CLASSES = {
  emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  sky: 'bg-sky-500/10 border-sky-500/20 text-sky-400',
  amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
  violet: 'bg-violet-500/10 border-violet-500/20 text-violet-400',
};

export default function Simulator({ currentTotal }) {
  const [selected, setSelected] = useState([]);

  const toggle = useCallback((id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }, []);

  const result = useMemo(() => simulateReduction(currentTotal, selected), [currentTotal, selected]);

  const grouped = useMemo(() => {
    const groups = {};
    SIMULATOR_ACTIONS.forEach(a => {
      if (!groups[a.category]) groups[a.category] = [];
      groups[a.category].push(a);
    });
    return groups;
  }, []);

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-md" role="region" aria-label="Carbon Reduction Simulator">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-400" aria-hidden="true" /> Carbon Reduction Simulator
          </h3>
          <p className="text-slate-400 text-xs mt-1">Select sustainability actions to see projected impact on your footprint.</p>
        </div>
        {selected.length > 0 && (
          <button onClick={() => setSelected([])} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors" aria-label="Reset all selections">
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Action Cards */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {Object.entries(grouped).map(([cat, actions]) => (
            <div key={cat}>
              <h4 className="text-xs font-bold uppercase text-slate-500 mb-2 tracking-wider">{CATEGORY_LABELS[cat]}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {actions.map(action => {
                  const isSelected = selected.includes(action.id);
                  const color = CATEGORY_COLORS[action.category];
                  return (
                    <button
                      key={action.id}
                      onClick={() => toggle(action.id)}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${isSelected ? `${COLOR_CLASSES[color]} shadow-lg` : 'bg-slate-950/30 border-slate-800/80 hover:border-slate-700'}`}
                      aria-pressed={isSelected}
                      aria-label={`${action.label}: saves ${action.reduction} tons CO2 per year`}
                    >
                      <span className="text-lg flex-shrink-0" aria-hidden="true">{action.icon}</span>
                      <div className="flex-1 min-w-0">
                        <span className={`block font-semibold text-sm ${isSelected ? '' : 'text-slate-200'}`}>{action.label}</span>
                        <span className="text-[10px] text-slate-500">-{action.reduction} T/yr</span>
                      </div>
                      {isSelected && <Leaf className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Results Panel */}
        <div className="p-6 rounded-2xl bg-slate-950/40 border border-slate-800 flex flex-col items-center text-center sticky top-24">
          <h4 className="font-heading font-bold text-sm text-slate-300 mb-4">Simulation Results</h4>

          {/* Animated Ring */}
          <div className="my-4 relative">
            <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120" aria-hidden="true">
              <circle cx="60" cy="60" r="52" fill="none" stroke="#1e293b" strokeWidth="8" />
              <circle cx="60" cy="60" r="52" fill="none" stroke="url(#sim-grad)" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${Math.min(100, result.percentReduction) * 3.27} 327`} className="transition-all duration-700" />
              <defs><linearGradient id="sim-grad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#10b981" /><stop offset="100%" stopColor="#14b8a6" /></linearGradient></defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-heading font-black text-2xl text-emerald-400">{result.percentReduction}%</span>
              <span className="text-[10px] text-slate-500">reduction</span>
            </div>
          </div>

          <div className="w-full space-y-2 text-xs mt-2">
            <div className="flex justify-between text-slate-400"><span>Current</span><span className="text-white font-bold">{currentTotal.toFixed(1)} T</span></div>
            <div className="flex justify-between text-slate-400"><span>CO₂ Saved</span><span className="text-emerald-400 font-bold">-{result.totalReduction.toFixed(1)} T/yr</span></div>
            <div className="flex justify-between border-t border-slate-800 pt-2 text-slate-300"><span className="font-semibold">Projected</span><span className="font-heading font-bold text-emerald-400">{result.projected.toFixed(1)} T</span></div>
          </div>

          {selected.length > 0 && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15 text-xs text-emerald-400 w-full">
              <TrendingDown className="w-4 h-4 inline mr-1" />
              {selected.length} action{selected.length > 1 ? 's' : ''} selected • Est. annual savings: <strong>{result.totalReduction.toFixed(1)} Tons CO₂</strong>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
