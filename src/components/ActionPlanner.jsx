import React, { useMemo } from 'react';
import { Calendar, CheckCircle2, Sparkles } from 'lucide-react';
import { generate30DayPlan } from '../utils/carbonEngine';

const CATEGORY_ICONS = { transport: '🚗', energy: '⚡', flights: '✈️', diet: '🥗' };
const CATEGORY_NAMES = { transport: 'Transportation', energy: 'Home Energy', flights: 'Air Travel', diet: 'Diet & Lifestyle' };

export default function ActionPlanner({ profile }) {
  const plan = useMemo(() => generate30DayPlan(profile), [profile]);

  if (!plan) return null;

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-md" role="region" aria-label="30-Day Action Planner">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-400" aria-hidden="true" /> AI 30-Day Action Plan
          </h3>
          <p className="text-slate-400 text-xs mt-1">
            Personalized weekly goals targeting your highest emission: <strong className="text-emerald-400">{CATEGORY_ICONS[plan.topCategory]} {CATEGORY_NAMES[plan.topCategory]}</strong>
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" /> AI Generated
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {plan.weeks.map((week, i) => (
          <div key={i} className="p-5 rounded-2xl bg-slate-950/30 border border-slate-800/60 hover:border-emerald-500/20 transition-colors group">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-heading font-bold text-xs">
                W{week.week}
              </span>
              <h4 className="font-heading font-bold text-sm text-white">{week.title}</h4>
            </div>
            <ul className="space-y-2">
              {week.tasks.map((task, j) => (
                <li key={j} className="flex items-start gap-2 text-xs text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500/40 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  {task}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {plan.bonusTips.length > 0 && (
        <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/15">
          <h4 className="text-xs font-bold text-emerald-400 mb-2 flex items-center gap-1.5">
            💡 Bonus: Quick wins from {CATEGORY_NAMES[plan.secondCategory]}
          </h4>
          <ul className="space-y-1">
            {plan.bonusTips.map((tip, i) => (
              <li key={i} className="text-xs text-slate-400 flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5 flex-shrink-0">•</span> {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
