import React from 'react';
import { ArrowRight, Leaf, Sparkles, Sliders, BarChart3, ShieldCheck, Globe } from 'lucide-react';

export default function Home({ onNavigate }) {
  return (
    <div className="flex flex-col gap-16 py-4 animate-fade-in">
      {/* Hero Core */}
      <section className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
        <div className="flex-1 flex flex-col items-start text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wider uppercase mb-6 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
            <Sparkles className="w-3.5 h-3.5" />
            Empowering Green Citizens
          </div>
          
          <h1 className="font-heading font-extrabold text-5xl sm:text-6xl tracking-tight leading-[1.1] mb-6 text-white">
            Understand & Lower <br />
            <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent">
              Your Carbon Footprint
            </span>
          </h1>
          
          <p className="text-slate-400 text-lg max-w-xl mb-8 leading-relaxed">
            Calculate your emissions across transportation, household utilities, flights, and dietary habits in real-time. Consult our AI-powered assistant for personalized offset recommendations.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => onNavigate('calculator')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-heading font-bold text-base hover:translate-y-[-2px] hover:shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:brightness-110 active:translate-y-0 transition-all duration-300"
            >
              Start Carbon Calculator
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 font-heading font-semibold hover:border-emerald-500/30 hover:bg-slate-900/80 transition-all duration-300"
            >
              How it works
            </button>
          </div>
        </div>

        {/* Hero Visual Orb */}
        <div className="flex-1 flex justify-center items-center relative">
          <div className="relative w-80 h-80 sm:w-96 sm:h-96">
            <div className="absolute inset-[-10%] bg-radial-gradient from-emerald-500/10 to-transparent blur-3xl rounded-full"></div>
            
            {/* Spinning Green Forest Glow Globe */}
            <div className="w-full h-full rounded-full border-2 border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-teal-900/20 shadow-[0_0_40px_rgba(16,185,129,0.15),inset_0_0_40px_rgba(16,185,129,0.1)] flex items-center justify-center animate-pulse-slow">
              <Globe className="w-40 h-40 text-emerald-400/80 stroke-[1]" />
            </div>

            {/* Rotating satellite leaf */}
            <div className="absolute top-10 right-10 p-3 rounded-2xl bg-slate-900 border border-slate-800 text-emerald-400 shadow-xl animate-bounce">
              <Leaf className="w-8 h-8" />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-md hover:border-emerald-500/30 transition-all duration-300">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6">
            <Sliders className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-xl text-white mb-3">Accurate Calculation</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Convert utility metrics and commutes directly into carbon equivalents using updated EPA models.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-md hover:border-emerald-500/30 transition-all duration-300">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mb-6">
            <BarChart3 className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-xl text-white mb-3">Interactive Dashboards</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Track historical carbon scores and sector breakdowns using responsive Chart.js visual graphics.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-md hover:border-emerald-500/30 transition-all duration-300">
          <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 flex items-center justify-center mb-6">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-xl text-white mb-3">AI Recommendations</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Consult our OpenAI-ready assistant to audit calculations and recommend personalized emission reductions.
          </p>
        </div>
      </section>
    </div>
  );
}
