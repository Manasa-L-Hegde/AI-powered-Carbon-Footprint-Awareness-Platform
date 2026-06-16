import React, { useMemo } from 'react';
import { Trophy } from 'lucide-react';
import { getUnlockedAchievements } from '../utils/carbonEngine';

export default function Achievements({ history, goals }) {
  const achievements = useMemo(() => getUnlockedAchievements(history, goals), [history, goals]);
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-md" role="region" aria-label="Achievement System">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-emerald-400" aria-hidden="true" /> Achievements
          </h3>
          <p className="text-slate-400 text-xs mt-1">Unlock badges as you progress on your sustainability journey.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
          {unlockedCount}/{achievements.length} Unlocked
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {achievements.map(a => (
          <div
            key={a.id}
            className={`p-4 rounded-2xl border transition-all ${
              a.unlocked
                ? 'bg-emerald-500/5 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.08)]'
                : 'bg-slate-950/30 border-slate-800/60 opacity-50'
            }`}
            role="listitem"
            aria-label={`${a.title}: ${a.unlocked ? 'Unlocked' : 'Locked'}`}
          >
            <div className="flex items-center gap-3">
              <span className={`text-2xl ${a.unlocked ? '' : 'grayscale'}`} aria-hidden="true">{a.icon}</span>
              <div className="flex-1 min-w-0">
                <h4 className={`font-heading font-bold text-sm ${a.unlocked ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {a.title}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">{a.desc}</p>
              </div>
              {a.unlocked && (
                <span className="text-emerald-400 text-lg" aria-label="Unlocked">✓</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
