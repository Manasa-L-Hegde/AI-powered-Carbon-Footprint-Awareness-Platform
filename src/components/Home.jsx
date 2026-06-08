import React from 'react';
import { ArrowRight, Leaf, Sparkles, Sliders, BarChart3, ShieldCheck, Globe, Zap, Target } from 'lucide-react';

export default function Home({ onNavigate }) {
  const features = [
    { icon: Sliders, color: 'emerald', title: 'Multi-Step Calculator', desc: 'Track transport, energy, flights, and diet emissions using EPA-validated carbon coefficients.' },
    { icon: BarChart3, color: 'sky', title: 'Interactive Dashboard', desc: 'Visualize your carbon profile with doughnut and bar charts, compare against national averages.' },
    { icon: Sparkles, color: 'amber', title: 'AI Recommendations', desc: 'Context-aware sustainability advice powered by local decision logic — no API key required.' },
    { icon: Target, color: 'violet', title: 'Goal Tracker', desc: 'Set sustainability commitments and see your projected footprint reduction update in real-time.' },
    { icon: ShieldCheck, color: 'teal', title: 'Audit Reports', desc: 'Generate offline audit reports with risk classification, reduction estimates, and actionable insights.' },
    { icon: Zap, color: 'rose', title: 'Fully Offline', desc: 'All calculations and reports run in your browser. Zero API dependencies, zero data sharing.' }
  ];

  const colorMap = {
    emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    sky: 'bg-sky-500/10 border-sky-500/20 text-sky-400',
    amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    violet: 'bg-violet-500/10 border-violet-500/20 text-violet-400',
    teal: 'bg-teal-500/10 border-teal-500/20 text-teal-400',
    rose: 'bg-rose-500/10 border-rose-500/20 text-rose-400'
  };

  return (
    <div className="flex flex-col gap-20 py-4 animate-fade-in">
      {/* Hero */}
      <section className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
        <div className="flex-1 flex flex-col items-start text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wider uppercase mb-6">
            <Sparkles className="w-3.5 h-3.5" /> AI-Powered Carbon Intelligence
          </div>
          <h1 className="font-heading font-extrabold text-5xl sm:text-6xl tracking-tight leading-[1.1] mb-6 text-white">
            Understand & Lower <br />
            <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent">Your Carbon Footprint</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mb-8 leading-relaxed">
            Calculate emissions across transportation, household energy, air travel, and dietary habits. Get AI-powered sustainability recommendations — all locally, no API keys needed.
          </p>
          <div className="flex flex-wrap gap-4">
            <button id="hero-cta-calc" onClick={() => onNavigate('calculator')} className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-heading font-bold text-base hover:translate-y-[-2px] hover:shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:brightness-110 active:translate-y-0 transition-all duration-300">
              Start Calculator <ArrowRight className="w-4 h-4" />
            </button>
            <button id="hero-cta-dash" onClick={() => onNavigate('dashboard')} className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 font-heading font-semibold hover:border-emerald-500/30 transition-all duration-300">
              View Dashboard
            </button>
          </div>
        </div>
        <div className="flex-1 flex justify-center items-center relative" aria-hidden="true">
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
            <div className="absolute inset-[-15%] bg-emerald-500/5 blur-3xl rounded-full"></div>
            <div className="w-full h-full rounded-full border-2 border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-teal-900/20 shadow-[0_0_60px_rgba(16,185,129,0.15),inset_0_0_60px_rgba(16,185,129,0.08)] flex items-center justify-center animate-pulse-slow">
              <Globe className="w-36 h-36 sm:w-40 sm:h-40 text-emerald-400/80 stroke-[1]" />
            </div>
            <div className="absolute top-6 right-6 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-emerald-400 shadow-xl animate-float"><Leaf className="w-7 h-7" /></div>
            <div className="absolute bottom-12 left-4 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl animate-float" style={{animationDelay:'1.5s'}}><span className="text-2xl">🌍</span></div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4" aria-label="Platform highlights">
        {[{s:'100%',l:'Offline Ready'},{s:'4-Step',l:'Calculator'},{s:'Real-time',l:'AI Analysis'},{s:'10+',l:'Goal Actions'}].map((item,i)=>(
          <div key={i} className="p-4 rounded-2xl bg-slate-900/30 border border-slate-800/60 text-center hover:border-emerald-500/20 transition-colors">
            <div className="font-heading font-extrabold text-2xl bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">{item.s}</div>
            <div className="text-slate-500 text-xs mt-1 font-medium">{item.l}</div>
          </div>
        ))}
      </section>

      {/* Features */}
      <section aria-labelledby="feat-heading">
        <h2 id="feat-heading" className="font-heading font-extrabold text-3xl text-white text-center mb-12">
          Everything You Need to <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Go Green</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f,i)=>{
            const Icon=f.icon;
            return (
              <div key={i} className="group p-8 rounded-3xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-md hover:border-emerald-500/30 hover:shadow-[0_0_30px_rgba(16,185,129,0.05)] transition-all duration-300">
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ${colorMap[f.color]}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-lg text-white mb-3">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="text-center py-8">
        <h2 className="font-heading font-extrabold text-2xl text-white mb-4">Ready to measure your impact?</h2>
        <p className="text-slate-400 text-sm mb-8 max-w-md mx-auto">Start with our 4-step calculator and receive instant, personalized recommendations.</p>
        <button id="bottom-cta" onClick={() => onNavigate('calculator')} className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-heading font-bold text-base hover:translate-y-[-2px] hover:shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:brightness-110 active:translate-y-0 transition-all duration-300">
          Calculate Your Footprint <ArrowRight className="w-5 h-5" />
        </button>
      </section>
    </div>
  );
}
