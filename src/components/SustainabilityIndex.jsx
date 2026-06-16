import React, { useMemo } from 'react';
import { Gauge } from 'lucide-react';
import { calculateSustainabilityIndex } from '../utils/carbonEngine';

function ScoreRing({ score, label, size = 80 }) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#f43f5e';

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="-rotate-90" width={size} height={size} aria-hidden="true">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1e293b" strokeWidth="6" />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" strokeDasharray={`${dash} ${circ}`} className="transition-all duration-700" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-heading font-black text-lg" style={{ color }}>{score}</span>
        </div>
      </div>
      <span className="text-xs text-slate-400 font-medium text-center">{label}</span>
    </div>
  );
}

export default function SustainabilityIndex({ profile }) {
  const index = useMemo(() => calculateSustainabilityIndex(profile), [profile]);

  if (!index) return null;

  const getRating = (s) => s >= 70 ? 'Excellent' : s >= 40 ? 'Good' : 'Needs Work';
  const getRatingColor = (s) => s >= 70 ? 'text-emerald-400' : s >= 40 ? 'text-amber-400' : 'text-rose-400';

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-md" role="region" aria-label="Sustainability Index">
      <h3 className="font-heading font-bold text-lg text-white mb-1 flex items-center gap-2">
        <Gauge className="w-5 h-5 text-emerald-400" aria-hidden="true" /> Sustainability Index
      </h3>
      <p className="text-slate-400 text-xs mb-6">Category-level sustainability scores out of 100. Lower emissions = higher score.</p>

      <div className="flex flex-wrap justify-center gap-6 sm:gap-8 mb-6">
        <ScoreRing score={index.transport} label="Transport" />
        <ScoreRing score={index.energy} label="Energy" />
        <ScoreRing score={index.food} label="Food" />
        <ScoreRing score={index.flights} label="Flights" />
        <ScoreRing score={index.overall} label="Overall" size={96} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Transport', score: index.transport },
          { label: 'Energy', score: index.energy },
          { label: 'Food', score: index.food },
          { label: 'Flights', score: index.flights },
          { label: 'Overall', score: index.overall },
        ].map(item => (
          <div key={item.label} className="p-3 rounded-xl bg-slate-950/30 border border-slate-800/60 text-center">
            <div className="text-[10px] text-slate-500 uppercase font-semibold">{item.label}</div>
            <div className={`font-heading font-bold text-sm mt-1 ${getRatingColor(item.score)}`}>{getRating(item.score)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
