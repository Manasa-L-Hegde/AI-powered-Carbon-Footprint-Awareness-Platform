import React, { useState } from 'react';
import { Car, Zap, Plane, Utensils, ArrowLeft, ArrowRight, Sparkles, RefreshCw, Save, HelpCircle, Tag } from 'lucide-react';

export default function Calculator({ onSave, currentResult, setCurrentResult }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saveName, setSaveName] = useState('');
  
  // Form values state
  const [formData, setFormData] = useState({
    carDistance: 80,
    carType: 'petrol',
    transitDistance: 40,
    motoDistance: 0,
    electricityUsage: 300,
    gasUsage: 50,
    heatingOil: 0,
    houseMembers: 2,
    shortFlights: 1,
    medFlights: 0,
    longFlights: 0,
    dietType: 'balanced',
    recycleHabit: 'partial'
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    // Validate inputs
    let errorMsg = '';
    if (typeof value === 'number' && value < 0) {
      errorMsg = 'Value cannot be negative';
    }
    
    setErrors(prev => ({ ...prev, [field]: errorMsg }));
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateEmissions = () => {
    // 1. Transport CO2 (Weekly -> Annual)
    const carFactor = {
      petrol: 0.18,
      diesel: 0.17,
      hybrid: 0.09,
      ev: 0.05,
      none: 0
    }[formData.carType];

    const transportCO2Annual = (
      (formData.carDistance * carFactor) + 
      (formData.transitDistance * 0.04) + 
      (formData.motoDistance * 0.10)
    ) * 52;

    // 2. Home Energy (Monthly -> Annual)
    const energyCO2Annual = (
      (formData.electricityUsage * 0.38) + 
      (formData.gasUsage * 2.03) + 
      (formData.heatingOil * 2.68)
    ) * 12 / formData.houseMembers;

    // 3. Flights (Annual)
    // short: 700km, med: 2000km, long: 6000km round-trip
    const flightsCO2Annual = (
      (formData.shortFlights * 700 * 0.25) +
      (formData.medFlights * 2000 * 0.16) +
      (formData.longFlights * 6000 * 0.14)
    );

    // 4. Diet & Lifestyle (Annual)
    const dietTons = {
      'meat-heavy': 2.8,
      'balanced': 1.8,
      'vegetarian': 1.2,
      'vegan': 0.9
    }[formData.dietType];

    const wasteTons = {
      none: 0.2,
      partial: 0.05,
      full: -0.15
    }[formData.recycleHabit];

    const lifestyleCO2Annual = (dietTons + wasteTons) * 1000;

    // Sum in Tons
    const transportTons = transportCO2Annual / 1000;
    const energyTons = energyCO2Annual / 1000;
    const flightsTons = flightsCO2Annual / 1000;
    const lifestyleTons = lifestyleCO2Annual / 1000;
    const totalTons = transportTons + energyTons + flightsTons + lifestyleTons;

    // Carbon Score calculation: Exponential decay where 8.0 tons yields a score of ~51
    const score = Math.max(1, Math.min(100, Math.round(100 * Math.exp(-totalTons / 12))));

    return {
      transport: Math.round(transportTons * 100) / 100,
      energy: Math.round(energyTons * 100) / 100,
      flights: Math.round(flightsTons * 100) / 100,
      diet: Math.round(lifestyleTons * 100) / 100,
      total: Math.round(totalTons * 100) / 100,
      score
    };
  };

  const handleNext = () => {
    // Double check errors before navigating
    const activeErrors = Object.values(errors).filter(err => err !== '');
    if (activeErrors.length > 0) return;

    if (step < 4) {
      setStep(step + 1);
    } else {
      setLoading(true);
      setTimeout(() => {
        const result = calculateEmissions();
        setCurrentResult(result);
        setLoading(false);
      }, 1200);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleReset = () => {
    setCurrentResult(null);
    setStep(1);
    setSaveName('');
  };

  // Stepper UI progress line
  const progressPercent = ((step - 1) / 3) * 100;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
        <div className="w-16 h-16 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin shadow-[0_0_15px_rgba(16,185,129,0.15)] mb-8"></div>
        <h3 className="font-heading font-extrabold text-2xl mb-2 text-white">Analyzing Data...</h3>
        <p className="text-slate-400 text-sm">Computing greenhouse equivalents using standard EPA formulas</p>
      </div>
    );
  }

  if (currentResult) {
    const isGood = currentResult.total <= 8.0;
    return (
      <div className="max-w-2xl mx-auto w-full animate-fade-in" role="region" aria-live="polite">
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-md shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Calculation Complete
            </div>
            <h2 className="font-heading font-extrabold text-3xl text-white">Your Carbon Profile</h2>
            
            <div className="my-8 flex justify-center items-baseline gap-2">
              <span className="font-heading font-black text-7xl text-white bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent filter drop-shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                {currentResult.total.toFixed(1)}
              </span>
              <span className="text-slate-400 text-lg font-medium">Tons CO2e / yr</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-900 inline-block mb-2">
              <span className="text-sm font-semibold text-slate-400 mr-2">Carbon Score:</span>
              <span className={`font-heading font-bold text-xl ${currentResult.score >= 60 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {currentResult.score} / 100
              </span>
            </div>

            <p className={`text-sm max-w-md mx-auto mt-2 ${isGood ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isGood 
                ? `Excellent! You are under the national average of 8.0 Tons/yr.`
                : `Caution: Your emissions exceed the average. Explore the suggestions tab for offset actions.`
              }
            </p>
          </div>

          {/* Breakdown cards */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-slate-950/30 border border-slate-800 text-center">
              <span className="text-xs text-slate-500 uppercase font-semibold">Transport</span>
              <div className="font-heading font-bold text-xl text-white mt-1">{currentResult.transport.toFixed(1)} T</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/30 border border-slate-800 text-center">
              <span className="text-xs text-slate-500 uppercase font-semibold">Home Energy</span>
              <div className="font-heading font-bold text-xl text-white mt-1">{currentResult.energy.toFixed(1)} T</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/30 border border-slate-800 text-center">
              <span className="text-xs text-slate-500 uppercase font-semibold">Flights</span>
              <div className="font-heading font-bold text-xl text-white mt-1">{currentResult.flights.toFixed(1)} T</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/30 border border-slate-800 text-center">
              <span className="text-xs text-slate-500 uppercase font-semibold">Diet & Lifestyle</span>
              <div className="font-heading font-bold text-xl text-white mt-1">{currentResult.diet.toFixed(1)} T</div>
            </div>
          </div>

          {/* Save field */}
          <div className="flex flex-col sm:flex-row gap-3 border-t border-slate-800/80 pt-8 justify-center items-center">
            <div className="relative w-full sm:max-w-xs">
              <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Name this calculation (e.g. Summer 2026)"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm outline-none focus:border-emerald-500 transition-colors"
                id="save-name-input"
              />
            </div>
            <button
              onClick={() => onSave(saveName)}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-heading font-bold text-sm hover:brightness-110 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:translate-y-[-1px] transition-all"
            >
              <Save className="w-4 h-4" /> Save to Dashboard
            </button>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Recalculate
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto w-full animate-fade-in">
      {/* Horizontal Steps Navigator */}
      <div className="relative flex justify-between items-center px-4 mb-8">
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-800/50 -translate-y-1/2 z-0"></div>
        <div 
          className="absolute top-1/2 left-0 h-[2px] bg-gradient-to-r from-emerald-500 to-teal-400 -translate-y-1/2 z-0 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        ></div>

        {[1, 2, 3, 4].map((num) => {
          const isActive = num === step;
          const isCompleted = num < step;
          return (
            <div 
              key={num}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-heading font-bold text-sm z-10 border-2 transition-all duration-300 ${
                isActive 
                  ? 'bg-slate-950 border-emerald-500 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                  : isCompleted 
                    ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                    : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              {num}
            </div>
          );
        })}
      </div>

      {/* Form Card */}
      <div className="p-6 sm:p-10 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-md shadow-2xl">
        <form onSubmit={(e) => e.preventDefault()}>
          
          {/* STEP 1: TRANSPORT */}
          {step === 1 && (
            <div className="animate-slide-in-right">
              <div className="flex items-center gap-3 border-b border-slate-800/60 pb-6 mb-8">
                <Car className="w-6 h-6 text-emerald-400" />
                <div>
                  <h2 className="font-heading font-bold text-xl text-white">Transportation Habits</h2>
                  <p className="text-slate-400 text-xs mt-0.5">Input your driving and transit commutes per week.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="car-distance" className="text-sm font-semibold text-slate-300 flex justify-between">
                    Weekly Car Commute
                    <span className="text-emerald-400 font-bold">{formData.carDistance} km</span>
                  </label>
                  <input 
                    type="range" 
                    id="car-distance"
                    min="0" max="1000" step="10"
                    value={formData.carDistance}
                    onChange={(e) => handleInputChange('carDistance', parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="car-type" className="text-sm font-semibold text-slate-300">Vehicle Fuel Type</label>
                  <select 
                    id="car-type"
                    value={formData.carType}
                    onChange={(e) => handleInputChange('carType', e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-slate-300 outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="petrol">Petrol (Standard Gas)</option>
                    <option value="diesel">Diesel</option>
                    <option value="hybrid">Hybrid Engine</option>
                    <option value="ev">Electric Vehicle (EV)</option>
                    <option value="none">No Private Vehicle</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="transit-distance" className="text-sm font-semibold text-slate-300 flex justify-between">
                    Weekly Public Transit
                    <span className="text-emerald-400 font-bold">{formData.transitDistance} km</span>
                  </label>
                  <input 
                    type="range" 
                    id="transit-distance"
                    min="0" max="400" step="5"
                    value={formData.transitDistance}
                    onChange={(e) => handleInputChange('transitDistance', parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="moto-distance" className="text-sm font-semibold text-slate-300 flex justify-between">
                    Weekly Motorcycle Commute
                    <span className="text-emerald-400 font-bold">{formData.motoDistance} km</span>
                  </label>
                  <input 
                    type="range" 
                    id="moto-distance"
                    min="0" max="300" step="5"
                    value={formData.motoDistance}
                    onChange={(e) => handleInputChange('motoDistance', parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: UTILITIES */}
          {step === 2 && (
            <div className="animate-slide-in-right">
              <div className="flex items-center gap-3 border-b border-slate-800/60 pb-6 mb-8">
                <Zap className="w-6 h-6 text-emerald-400" />
                <div>
                  <h2 className="font-heading font-bold text-xl text-white">Household Energy</h2>
                  <p className="text-slate-400 text-xs mt-0.5">Input average monthly home utilities bills.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="electricity-usage" className="text-sm font-semibold text-slate-300 flex justify-between">
                    Monthly Electricity
                    <span className="text-emerald-400 font-bold">{formData.electricityUsage} kWh</span>
                  </label>
                  <input 
                    type="range" 
                    id="electricity-usage"
                    min="0" max="2000" step="20"
                    value={formData.electricityUsage}
                    onChange={(e) => handleInputChange('electricityUsage', parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="gas-usage" className="text-sm font-semibold text-slate-300 flex justify-between">
                    Monthly Natural Gas
                    <span className="text-emerald-400 font-bold">{formData.gasUsage} m³</span>
                  </label>
                  <input 
                    type="range" 
                    id="gas-usage"
                    min="0" max="400" step="5"
                    value={formData.gasUsage}
                    onChange={(e) => handleInputChange('gasUsage', parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="heating-oil" className="text-sm font-semibold text-slate-300 flex justify-between">
                    Monthly Heating Oil
                    <span className="text-emerald-400 font-bold">{formData.heatingOil} L</span>
                  </label>
                  <input 
                    type="range" 
                    id="heating-oil"
                    min="0" max="300" step="5"
                    value={formData.heatingOil}
                    onChange={(e) => handleInputChange('heatingOil', parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="house-members" className="text-sm font-semibold text-slate-300">Household Size (To split impact)</label>
                  <select 
                    id="house-members"
                    value={formData.houseMembers}
                    onChange={(e) => handleInputChange('houseMembers', parseInt(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-slate-300 outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="1">1 Person</option>
                    <option value="2">2 People</option>
                    <option value="3">3 People</option>
                    <option value="4">4 People</option>
                    <option value="5">5+ People</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: FLIGHTS */}
          {step === 3 && (
            <div className="animate-slide-in-right">
              <div className="flex items-center gap-3 border-b border-slate-800/60 pb-6 mb-8">
                <Plane className="w-6 h-6 text-emerald-400" />
                <div>
                  <h2 className="font-heading font-bold text-xl text-white">Flight Journeys</h2>
                  <p className="text-slate-400 text-xs mt-0.5">Input estimates of annual flights taken.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="short-flights" className="text-sm font-semibold text-slate-300 flex justify-between">
                    Short Haul (&lt; 500km)
                    <span className="text-emerald-400 font-bold">{formData.shortFlights} flights/yr</span>
                  </label>
                  <input 
                    type="range" 
                    id="short-flights"
                    min="0" max="15" step="1"
                    value={formData.shortFlights}
                    onChange={(e) => handleInputChange('shortFlights', parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="med-flights" className="text-sm font-semibold text-slate-300 flex justify-between">
                    Medium Haul (500 - 1500km)
                    <span className="text-emerald-400 font-bold">{formData.medFlights} flights/yr</span>
                  </label>
                  <input 
                    type="range" 
                    id="med-flights"
                    min="0" max="10" step="1"
                    value={formData.medFlights}
                    onChange={(e) => handleInputChange('medFlights', parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label htmlFor="long-flights" className="text-sm font-semibold text-slate-300 flex justify-between">
                    Long Haul (&gt; 1500km)
                    <span className="text-emerald-400 font-bold">{formData.longFlights} flights/yr</span>
                  </label>
                  <input 
                    type="range" 
                    id="long-flights"
                    min="0" max="8" step="1"
                    value={formData.longFlights}
                    onChange={(e) => handleInputChange('longFlights', parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: DIET & WASTE */}
          {step === 4 && (
            <div className="animate-slide-in-right">
              <div className="flex items-center gap-3 border-b border-slate-800/60 pb-6 mb-8">
                <Utensils className="w-6 h-6 text-emerald-400" />
                <div>
                  <h2 className="font-heading font-bold text-xl text-white">Diet & Recycling Habits</h2>
                  <p className="text-slate-400 text-xs mt-0.5">Select diet and recycling properties that fit your lifestyle.</p>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div>
                  <span className="text-sm font-semibold text-slate-300 block mb-3">Select Dietary Profile</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { id: 'meat-heavy', label: 'Meat Lover', desc: 'Frequent beef/pork' },
                      { id: 'balanced', label: 'Balanced', desc: 'Average meat & veg' },
                      { id: 'vegetarian', label: 'Vegetarian', desc: 'No meat, eats dairy' },
                      { id: 'vegan', label: 'Vegan', desc: 'Strictly plant-based' }
                    ].map((opt) => {
                      const selected = formData.dietType === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleInputChange('dietType', opt.id)}
                          className={`p-4 rounded-2xl border text-center transition-all ${
                            selected 
                              ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                              : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                          }`}
                        >
                          <span className="block font-heading font-bold text-sm">{opt.label}</span>
                          <span className="text-xs text-slate-500 mt-1 block leading-tight">{opt.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="recycle-habit" className="text-sm font-semibold text-slate-300">Recycling Commitments</label>
                  <select 
                    id="recycle-habit"
                    value={formData.recycleHabit}
                    onChange={(e) => handleInputChange('recycleHabit', e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-slate-300 outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="none">No active sorting/recycling</option>
                    <option value="partial">Recycle paper, cans & plastics partially</option>
                    <option value="full">Aggressive recycling & food composting</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Stepper Footer Action Buttons */}
          <div className="flex justify-between items-center border-t border-slate-800/80 pt-8 mt-8">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 1}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                step === 1 
                  ? 'text-slate-600 cursor-not-allowed opacity-0' 
                  : 'text-slate-300 border border-slate-800 bg-slate-950 hover:bg-slate-900/50'
              }`}
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-heading font-bold text-sm hover:brightness-110 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] active:scale-95 transition-all"
            >
              {step === 4 ? (
                <>
                  Calculate score <Sparkles className="w-4 h-4" />
                </>
              ) : (
                <>
                  Next step <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
