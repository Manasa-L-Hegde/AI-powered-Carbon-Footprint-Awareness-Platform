import React, { useMemo } from 'react';
import { BarChart3 } from 'lucide-react';
import { BENCHMARKS } from '../utils/carbonEngine';

export default function BenchmarkComparison({ userTotal }) {
  const benchmarks = useMemo(() => {
    return Object.entries(BENCHMARKS).map(([key, b]) => {
      const diff = userTotal - b.value;
      const pct = b.value > 0 ? Math.round((Math.abs(diff) / b.value) * 100) : 0;
      return { ...b, key, diff, pct, isBelow: diff <= 0 };
    });
  }, [userTotal]);

  const maxVal = useMemo(() => Math.max(userTotal, ...Object.values(BENCHMARKS).map(b => b.value)), [userTotal]);

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-md" role="region" aria-label="Benchmark Comparison">
      <h3 className="font-heading font-bold text-lg text-white mb-1 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-emerald-400" aria-hidden="true" /> Benchmark Comparison
      </h3>
      <p className="text-slate-400 text-xs mb-6">See how your footprint compares to key targets and averages.</p>

      <div className="space-y-4">
        {/* User bar */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-white w-36 sm:w-44 flex-shrink-0">🧑 Your Footprint</span>
          <div className="flex-1 h-8 bg-slate-950/40 rounded-xl overflow-hidden border border-slate-800 relative">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-xl transition-all duration-700 flex items-center justify-end pr-3"
              style={{ width: `${Math.min(100, (userTotal / maxVal) * 100)}%` }}
            >
              <span className="text-[11px] font-bold text-slate-950">{userTotal.toFixed(1)} T</span>
            </div>
          </div>
        </div>

        {benchmarks.map(b => (
          <div key={b.key} className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-400 w-36 sm:w-44 flex-shrink-0 flex items-center gap-1.5">
              <span aria-hidden="true">{b.icon}</span> {b.label}
            </span>
            <div className="flex-1 h-8 bg-slate-950/40 rounded-xl overflow-hidden border border-slate-800 relative">
              <div
                className={`h-full rounded-xl transition-all duration-700 flex items-center justify-end pr-3 ${b.isBelow ? 'bg-slate-700/50' : 'bg-slate-700/30'}`}
                style={{ width: `${Math.min(100, (b.value / maxVal) * 100)}%` }}
              >
                <span className="text-[11px] font-semibold text-slate-300">{b.value} T</span>
              </div>
            </div>
            <span className={`text-[11px] font-bold w-20 text-right flex-shrink-0 ${b.isBelow ? 'text-emerald-400' : 'text-rose-400'}`}>
              {b.isBelow ? '↓' : '↑'} {b.pct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
