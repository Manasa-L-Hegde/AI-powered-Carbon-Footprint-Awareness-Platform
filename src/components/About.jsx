import React, { useState } from 'react';
import { Globe, ChevronDown, ChevronUp, Leaf, BookOpen, Shield, Lightbulb, Users, Heart } from 'lucide-react';

export default function About() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    { q: 'How does EcoTrace calculate my carbon emissions?', a: 'EcoTrace converts user utility usages, travel logs, flight counts, and dietary habits into carbon dioxide equivalents (CO2e) using emission factors from EPA and DEFRA. For example, grid electricity is modeled at 0.38 kg CO2e per kWh, and petrol vehicles at 0.18 kg CO2e per km.' },
    { q: 'What is a "Carbon Score" and how is it calculated?', a: 'The Carbon Score is a 1-100 scale measuring sustainability. It uses exponential decay: Score = 100 × exp(-Total/12). Zero emissions = 100, the 8.0 T national average ≈ 51. Higher scores indicate lower ecological footprints.' },
    { q: 'What do the risk levels mean?', a: 'Risk is derived from your Carbon Score: 71-100 = Low Impact (green), 31-70 = Medium Impact (amber), 0-30 = High Impact (red). These thresholds align with sustainability benchmarks and help you prioritize action.' },
    { q: 'What is CO2e?', a: 'CO2e (Carbon Dioxide Equivalent) is a standard metric comparing greenhouse gases by their global warming potential. Methane, nitrous oxide, etc. are converted to equivalent CO2 units for unified measurement.' },
    { q: 'Does EcoTrace require an API key?', a: 'No. All calculations, recommendations, risk classification, and audit reports work entirely offline using local decision logic. An optional OpenAI integration exists for users who want GPT-powered analysis, but it is never required.' },
    { q: 'Is my data secure?', a: 'Absolutely. EcoTrace runs entirely client-side in your browser. All data — inputs, history, goals, and API keys — is stored in localStorage. Nothing is transmitted to external servers.' },
    { q: 'How accurate are the emission factors?', a: 'Our factors are sourced from EPA GHG Emission Factors Hub and UK DEFRA conversion tables. While they represent averages and may vary by region, they provide reliable estimates for personal carbon awareness.' },
    { q: 'Can I export my data?', a: 'Yes. The Dashboard provides CSV export of all calculation history. The AI Audit Report can be downloaded as a Markdown file for offline reference or sharing.' }
  ];

  const practices = [
    { icon: '🏠', title: 'Home Energy', items: ['Switch to LED lighting (80% energy savings)', 'Install a smart thermostat for optimized heating', 'Choose renewable energy from your utility', 'Improve home insulation to reduce heat loss', 'Unplug idle electronics to avoid phantom drain'] },
    { icon: '🚗', title: 'Transportation', items: ['Use public transit for daily commutes', 'Carpool or ride-share to divide emissions', 'Consider EV or hybrid for next vehicle', 'Walk or cycle for trips under 5km', 'Maintain proper tire pressure for fuel efficiency'] },
    { icon: '✈️', title: 'Air Travel', items: ['Replace short flights with high-speed rail', 'Choose direct flights over connections', 'Fly economy class (lower per-seat emissions)', 'Use video calls instead of business travel', 'Purchase carbon offsets for necessary flights'] },
    { icon: '🥗', title: 'Diet & Lifestyle', items: ['Reduce red meat consumption (biggest dietary impact)', 'Choose locally sourced, seasonal produce', 'Start composting food waste', 'Plan meals to reduce food waste', 'Buy in bulk to minimize packaging'] }
  ];

  return (
    <div className="max-w-4xl mx-auto w-full flex flex-col gap-12 animate-fade-in">

      {/* Header */}
      <section className="flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <Globe className="w-3.5 h-3.5" /> Climate Literacy
          </div>
          <h1 className="font-heading font-extrabold text-3xl text-white mb-4">
            Understanding Your <br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Greenhouse Impact</span>
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed mb-4">
            A carbon footprint measures the total greenhouse gas emissions caused directly and indirectly by an individual. It is expressed in equivalent tons of carbon dioxide (CO2e).
          </p>
          <p className="text-slate-400 text-sm leading-relaxed">
            Everyday activities — driving, consuming electricity, taking flights, and eating carbon-heavy foods — all contribute to atmospheric warming. Tracking these lets you pinpoint where changes matter most.
          </p>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="p-6 rounded-3xl bg-slate-900/20 border border-slate-800/80 max-w-sm w-full">
            <div className="flex items-center gap-3 text-emerald-400 mb-4">
              <Leaf className="w-5 h-5" />
              <span className="font-heading font-bold text-sm">Emission Factors Used</span>
            </div>
            <div className="text-xs text-slate-400 flex flex-col gap-2.5">
              {[
                ['Petrol Driving', '0.18 kg CO2e / km'],
                ['Grid Electricity', '0.38 kg CO2e / kWh'],
                ['Natural Gas', '2.03 kg CO2e / m³'],
                ['Short Flights', '0.25 kg CO2e / km'],
                ['Balanced Diet', '1.8 Tons CO2e / yr'],
                ['Vegan Diet', '0.9 Tons CO2e / yr']
              ].map(([label, value], i) => (
                <div key={i} className="flex justify-between border-b border-slate-800/60 pb-1.5 last:border-0">
                  <span>{label}</span>
                  <span className="text-slate-300 font-semibold">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section aria-labelledby="how-heading">
        <h2 id="how-heading" className="font-heading font-extrabold text-2xl text-white text-center mb-8">How EcoTrace Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { step: '01', icon: BookOpen, title: 'Input Data', desc: 'Enter transport, energy, flight, and diet information in 4 guided steps.' },
            { step: '02', icon: Shield, title: 'Calculate', desc: 'EPA-based emission factors convert inputs into Tons CO2e with a Carbon Score.' },
            { step: '03', icon: Lightbulb, title: 'Get Advice', desc: 'AI engine identifies top emitters and generates personalized recommendations.' },
            { step: '04', icon: Heart, title: 'Take Action', desc: 'Set sustainability goals and track your projected footprint reduction.' }
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="p-6 rounded-2xl bg-slate-900/30 border border-slate-800/60 text-center group hover:border-emerald-500/20 transition-colors">
                <div className="text-emerald-500/30 font-heading font-black text-3xl mb-2">{item.step}</div>
                <Icon className="w-6 h-6 text-emerald-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-heading font-bold text-sm text-white mb-1">{item.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Sustainability Best Practices */}
      <section aria-labelledby="practices-heading">
        <h2 id="practices-heading" className="font-heading font-extrabold text-2xl text-white text-center mb-8">Sustainability Best Practices</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {practices.map((cat, i) => (
            <div key={i} className="p-6 rounded-2xl bg-slate-900/30 border border-slate-800/60">
              <h3 className="font-heading font-bold text-base text-white mb-4 flex items-center gap-2">
                <span className="text-xl">{cat.icon}</span> {cat.title}
              </h3>
              <ul className="space-y-2">
                {cat.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-slate-400">
                    <span className="text-emerald-400 mt-1 flex-shrink-0">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Environmental Impact */}
      <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border border-emerald-500/10">
        <div className="flex items-start gap-4">
          <Users className="w-8 h-8 text-emerald-400 flex-shrink-0 mt-1" />
          <div>
            <h2 className="font-heading font-bold text-xl text-white mb-3">Why It Matters</h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-3">
              The average person in the United States generates approximately <strong className="text-white">16 tons</strong> of CO2e annually — nearly 4x the global average of 4 tons. The Paris Agreement targets limiting warming to 1.5°C, which requires global per-capita emissions to drop below <strong className="text-white">2 tons by 2050</strong>.
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              Individual actions matter: if every person reduced their footprint by just 20%, it would prevent billions of tons of emissions annually. Tools like EcoTrace make this measurable and actionable.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="font-heading font-extrabold text-2xl text-white text-center mb-8">Frequently Asked Questions</h2>
        <div className="flex flex-col gap-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={index} className="rounded-2xl bg-slate-900/40 border border-slate-800 overflow-hidden transition-all">
                <button id={`faq-${index}`} onClick={() => setOpenFaq(isOpen ? null : index)} className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-slate-800/20 transition-colors" aria-expanded={isOpen} aria-controls={`faq-answer-${index}`}>
                  <span className="font-heading font-bold text-sm sm:text-base text-slate-200">{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-emerald-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />}
                </button>
                {isOpen && (
                  <div id={`faq-answer-${index}`} className="px-6 pb-5 pt-1 text-slate-400 text-xs sm:text-sm leading-relaxed border-t border-slate-800/40 bg-slate-950/20 animate-fade-in" role="region">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
