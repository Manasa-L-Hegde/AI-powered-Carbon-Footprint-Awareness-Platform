import React, { useState } from 'react';
import { Car, Zap, Plane, Utensils, ArrowLeft, ArrowRight, Sparkles, RefreshCw, Save, Tag, Shield } from 'lucide-react';
import { calculateEmissions, classifyRisk } from '../utils/carbonEngine';

const RISK_STYLES = {
  emerald: { badge: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.15)]' },
  amber:   { badge: 'bg-amber-500/10 border-amber-500/20 text-amber-400', glow: 'shadow-[0_0_20px_rgba(245,158,11,0.15)]' },
  rose:    { badge: 'bg-rose-500/10 border-rose-500/20 text-rose-400', glow: 'shadow-[0_0_20px_rgba(244,63,94,0.15)]' }
};

export default function Calculator({ onSave, currentResult, setCurrentResult }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [formData, setFormData] = useState({
    carDistance: 80, carType: 'petrol', transitDistance: 40, motoDistance: 0,
    electricityUsage: 300, gasUsage: 50, heatingOil: 0, houseMembers: 2,
    shortFlights: 1, medFlights: 0, longFlights: 0,
    dietType: 'balanced', recycleHabit: 'partial'
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    let errorMsg = '';
    if (typeof value === 'number' && value < 0) errorMsg = 'Value cannot be negative';
    setErrors(prev => ({ ...prev, [field]: errorMsg }));
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (Object.values(errors).some(e => e !== '')) return;
    if (step < 4) { setStep(step + 1); }
    else {
      setLoading(true);
      setTimeout(() => {
        const result = calculateEmissions(formData);
        setCurrentResult(result);
        setLoading(false);
      }, 1200);
    }
  };

  const handleBack = () => { if (step > 1) setStep(step - 1); };
  const handleReset = () => { setCurrentResult(null); setStep(1); setSaveName(''); };

  const progressPercent = ((step - 1) / 3) * 100;
  const stepLabels = ['Transport', 'Energy', 'Flights', 'Lifestyle'];

  // ── Loading State ──
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[400px]" role="status" aria-live="polite">
        <div className="w-16 h-16 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin shadow-[0_0_15px_rgba(16,185,129,0.15)] mb-8"></div>
        <h3 className="font-heading font-extrabold text-2xl mb-2 text-white">Analyzing Data...</h3>
        <p className="text-slate-400 text-sm">Computing greenhouse equivalents using EPA formulas</p>
      </div>
    );
  }

  // ── Result View ──
  if (currentResult) {
    const risk = currentResult.risk;
    const rs = RISK_STYLES[risk.color];
    return (
      <div className="max-w-2xl mx-auto w-full animate-fade-in" role="region" aria-live="polite" aria-label="Calculation results">
        <div className={`p-8 sm:p-10 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-md shadow-2xl`}>
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Calculation Complete
            </div>
            <h2 className="font-heading font-extrabold text-3xl text-white">Your Carbon Profile</h2>

            {/* Total Emissions */}
            <div className="my-8 flex justify-center items-baseline gap-2 animate-count-up">
              <span className="font-heading font-black text-7xl bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent filter drop-shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                {currentResult.total.toFixed(1)}
              </span>
              <span className="text-slate-400 text-lg font-medium">Tons CO2e / yr</span>
            </div>

            {/* Score + Risk Badge */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
              <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-900">
                <span className="text-sm font-semibold text-slate-400 mr-2">Carbon Score:</span>
                <span className={`font-heading font-bold text-xl ${currentResult.score >= 60 ? 'text-emerald-400' : currentResult.score >= 30 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {currentResult.score} / 100
                </span>
              </div>
              <div className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border font-heading font-bold text-sm ${rs.badge} ${rs.glow}`} role="status" aria-label={`Risk level: ${risk.label}`}>
                <Shield className="w-4 h-4" />
                {risk.label}
              </div>
            </div>

            <p className={`text-sm max-w-lg mx-auto ${risk.color === 'emerald' ? 'text-emerald-400' : risk.color === 'amber' ? 'text-amber-400' : 'text-rose-400'}`}>
              {risk.description}
            </p>
          </div>

          {/* Breakdown Cards */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {[
              { label: 'Transport', val: currentResult.transport },
              { label: 'Home Energy', val: currentResult.energy },
              { label: 'Flights', val: currentResult.flights },
              { label: 'Diet & Lifestyle', val: currentResult.diet }
            ].map((c, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-950/30 border border-slate-800 text-center hover:border-emerald-500/20 transition-colors">
                <span className="text-xs text-slate-500 uppercase font-semibold">{c.label}</span>
                <div className="font-heading font-bold text-xl text-white mt-1">{c.val.toFixed(1)} T</div>
                <div className="text-[10px] text-slate-600 mt-0.5">{Math.round((c.val / currentResult.total) * 100)}% of total</div>
              </div>
            ))}
          </div>

          {/* Save */}
          <div className="flex flex-col sm:flex-row gap-3 border-t border-slate-800/80 pt-8 justify-center items-center">
            <div className="relative w-full sm:max-w-xs">
              <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input type="text" id="save-name-input" placeholder="Name this calculation" value={saveName} onChange={(e) => setSaveName(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm outline-none focus:border-emerald-500 transition-colors" aria-label="Calculation name" />
            </div>
            <button id="save-calc-btn" onClick={() => onSave(saveName)} className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-heading font-bold text-sm hover:brightness-110 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:translate-y-[-1px] transition-all">
              <Save className="w-4 h-4" /> Save to Dashboard
            </button>
          </div>
          <div className="text-center mt-6">
            <button id="recalculate-btn" onClick={handleReset} className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors">
              <RefreshCw className="w-3.5 h-3.5" /> Recalculate
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Multi-Step Form ──
  return (
    <div className="max-w-2xl mx-auto w-full animate-fade-in">
      {/* Stepper */}
      <div className="relative flex justify-between items-center px-4 mb-8" role="navigation" aria-label="Calculator steps">
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-800/50 -translate-y-1/2 z-0"></div>
        <div className="absolute top-1/2 left-0 h-[2px] bg-gradient-to-r from-emerald-500 to-teal-400 -translate-y-1/2 z-0 transition-all duration-300" style={{width:`${progressPercent}%`}}></div>
        {[1,2,3,4].map(num => {
          const isActive = num === step;
          const isCompleted = num < step;
          return (
            <div key={num} className="flex flex-col items-center z-10">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-heading font-bold text-sm border-2 transition-all duration-300 ${isActive ? 'bg-slate-950 border-emerald-500 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)]' : isCompleted ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'bg-slate-900 border-slate-800 text-slate-500'}`} aria-current={isActive ? 'step' : undefined}>
                {isCompleted ? '✓' : num}
              </div>
              <span className="text-[10px] text-slate-500 mt-1.5 font-medium hidden sm:block">{stepLabels[num-1]}</span>
            </div>
          );
        })}
      </div>

      {/* Form Card */}
      <div className="p-6 sm:p-10 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-md shadow-2xl">
        <form onSubmit={e => e.preventDefault()} noValidate>
          {step === 1 && <Step1 formData={formData} onChange={handleInputChange} />}
          {step === 2 && <Step2 formData={formData} onChange={handleInputChange} />}
          {step === 3 && <Step3 formData={formData} onChange={handleInputChange} />}
          {step === 4 && <Step4 formData={formData} onChange={handleInputChange} />}

          <div className="flex justify-between items-center border-t border-slate-800/80 pt-8 mt-8">
            <button type="button" onClick={handleBack} disabled={step===1} id="calc-back-btn" className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${step===1 ? 'text-slate-600 cursor-not-allowed opacity-0':'text-slate-300 border border-slate-800 bg-slate-950 hover:bg-slate-900/50'}`} aria-label="Previous step">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button type="button" onClick={handleNext} id="calc-next-btn" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-heading font-bold text-sm hover:brightness-110 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] active:scale-95 transition-all" aria-label={step===4?'Calculate score':'Next step'}>
              {step===4 ? (<>Calculate score <Sparkles className="w-4 h-4" /></>) : (<>Next step <ArrowRight className="w-4 h-4" /></>)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Step Sub-Components ──

function SliderField({ id, label, unit, value, min, max, step, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-semibold text-slate-300 flex justify-between">
        {label} <span className="text-emerald-400 font-bold">{value} {unit}</span>
      </label>
      <input type="range" id={id} min={min} max={max} step={step} value={value} onChange={e => onChange(parseInt(e.target.value))} className="w-full" aria-valuenow={value} aria-valuemin={min} aria-valuemax={max} aria-label={`${label}: ${value} ${unit}`} />
    </div>
  );
}

function Step1({ formData, onChange }) {
  return (
    <div className="animate-slide-in-right">
      <div className="flex items-center gap-3 border-b border-slate-800/60 pb-6 mb-8">
        <Car className="w-6 h-6 text-emerald-400" aria-hidden="true" />
        <div>
          <h2 className="font-heading font-bold text-xl text-white">Transportation Habits</h2>
          <p className="text-slate-400 text-xs mt-0.5">Input your driving and transit commutes per week.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <SliderField id="car-distance" label="Weekly Car Commute" unit="km" value={formData.carDistance} min={0} max={1000} step={10} onChange={v=>onChange('carDistance',v)} />
        <div className="flex flex-col gap-2">
          <label htmlFor="car-type" className="text-sm font-semibold text-slate-300">Vehicle Fuel Type</label>
          <select id="car-type" value={formData.carType} onChange={e=>onChange('carType',e.target.value)} className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-slate-300 outline-none focus:border-emerald-500 transition-colors">
            <option value="petrol">Petrol (Standard Gas)</option>
            <option value="diesel">Diesel</option>
            <option value="hybrid">Hybrid Engine</option>
            <option value="ev">Electric Vehicle (EV)</option>
            <option value="none">No Private Vehicle</option>
          </select>
        </div>
        <SliderField id="transit-distance" label="Weekly Public Transit" unit="km" value={formData.transitDistance} min={0} max={400} step={5} onChange={v=>onChange('transitDistance',v)} />
        <SliderField id="moto-distance" label="Weekly Motorcycle" unit="km" value={formData.motoDistance} min={0} max={300} step={5} onChange={v=>onChange('motoDistance',v)} />
      </div>
    </div>
  );
}

function Step2({ formData, onChange }) {
  return (
    <div className="animate-slide-in-right">
      <div className="flex items-center gap-3 border-b border-slate-800/60 pb-6 mb-8">
        <Zap className="w-6 h-6 text-emerald-400" aria-hidden="true" />
        <div>
          <h2 className="font-heading font-bold text-xl text-white">Household Energy</h2>
          <p className="text-slate-400 text-xs mt-0.5">Average monthly home utility consumption.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <SliderField id="elec-usage" label="Monthly Electricity" unit="kWh" value={formData.electricityUsage} min={0} max={2000} step={20} onChange={v=>onChange('electricityUsage',v)} />
        <SliderField id="gas-usage" label="Monthly Natural Gas" unit="m³" value={formData.gasUsage} min={0} max={400} step={5} onChange={v=>onChange('gasUsage',v)} />
        <SliderField id="heating-oil" label="Monthly Heating Oil" unit="L" value={formData.heatingOil} min={0} max={300} step={5} onChange={v=>onChange('heatingOil',v)} />
        <div className="flex flex-col gap-2">
          <label htmlFor="house-members" className="text-sm font-semibold text-slate-300">Household Size</label>
          <select id="house-members" value={formData.houseMembers} onChange={e=>onChange('houseMembers',parseInt(e.target.value))} className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-slate-300 outline-none focus:border-emerald-500 transition-colors">
            <option value="1">1 Person</option>
            <option value="2">2 People</option>
            <option value="3">3 People</option>
            <option value="4">4 People</option>
            <option value="5">5+ People</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function Step3({ formData, onChange }) {
  return (
    <div className="animate-slide-in-right">
      <div className="flex items-center gap-3 border-b border-slate-800/60 pb-6 mb-8">
        <Plane className="w-6 h-6 text-emerald-400" aria-hidden="true" />
        <div>
          <h2 className="font-heading font-bold text-xl text-white">Flight Journeys</h2>
          <p className="text-slate-400 text-xs mt-0.5">Estimate annual flights taken.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <SliderField id="short-flights" label="Short Haul (< 500km)" unit="flights/yr" value={formData.shortFlights} min={0} max={15} step={1} onChange={v=>onChange('shortFlights',v)} />
        <SliderField id="med-flights" label="Medium Haul (500-1500km)" unit="flights/yr" value={formData.medFlights} min={0} max={10} step={1} onChange={v=>onChange('medFlights',v)} />
        <div className="sm:col-span-2">
          <SliderField id="long-flights" label="Long Haul (> 1500km)" unit="flights/yr" value={formData.longFlights} min={0} max={8} step={1} onChange={v=>onChange('longFlights',v)} />
        </div>
      </div>
    </div>
  );
}

function Step4({ formData, onChange }) {
  const diets = [
    { id:'meat-heavy', label:'Meat Lover', desc:'Frequent beef/pork' },
    { id:'balanced', label:'Balanced', desc:'Average meat & veg' },
    { id:'vegetarian', label:'Vegetarian', desc:'No meat, eats dairy' },
    { id:'vegan', label:'Vegan', desc:'Strictly plant-based' }
  ];
  return (
    <div className="animate-slide-in-right">
      <div className="flex items-center gap-3 border-b border-slate-800/60 pb-6 mb-8">
        <Utensils className="w-6 h-6 text-emerald-400" aria-hidden="true" />
        <div>
          <h2 className="font-heading font-bold text-xl text-white">Diet & Recycling Habits</h2>
          <p className="text-slate-400 text-xs mt-0.5">Select diet and recycling that fit your lifestyle.</p>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <div>
          <span className="text-sm font-semibold text-slate-300 block mb-3">Select Dietary Profile</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" role="radiogroup" aria-label="Diet type">
            {diets.map(opt => {
              const selected = formData.dietType === opt.id;
              return (
                <button key={opt.id} type="button" role="radio" aria-checked={selected} onClick={()=>onChange('dietType',opt.id)} className={`p-4 rounded-2xl border text-center transition-all ${selected ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'border-slate-800 bg-slate-950 hover:border-slate-700'}`}>
                  <span className="block font-heading font-bold text-sm">{opt.label}</span>
                  <span className="text-xs text-slate-500 mt-1 block leading-tight">{opt.desc}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="recycle-habit" className="text-sm font-semibold text-slate-300">Recycling Commitments</label>
          <select id="recycle-habit" value={formData.recycleHabit} onChange={e=>onChange('recycleHabit',e.target.value)} className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-slate-300 outline-none focus:border-emerald-500 transition-colors">
            <option value="none">No active sorting/recycling</option>
            <option value="partial">Recycle paper, cans & plastics partially</option>
            <option value="full">Aggressive recycling & food composting</option>
          </select>
        </div>
      </div>
    </div>
  );
}
