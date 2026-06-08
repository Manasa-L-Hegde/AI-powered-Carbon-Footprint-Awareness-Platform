import React, { useState } from 'react';
import { Globe, ChevronDown, ChevronUp, Leaf, Scale, ShieldAlert } from 'lucide-react';

export default function About() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: 'How does EcoTrace calculate my carbon emissions?',
      a: 'EcoTrace converts user utility usages, travel logs, flight counts, and dietary habits into carbon dioxide equivalents (CO2e) using emission factors compiled by organizations like the EPA and DEFRA. For example, average utility grid electricity is modeled at 0.38 kg CO2e per kWh, and standard petrol passenger vehicles are calculated at 0.18 kg CO2e per driven kilometer.'
    },
    {
      q: 'What is a "Carbon Score" and how is it calculated?',
      a: 'The Carbon Score is a relative scale (from 1 to 100) representing how sustainable your footprint is. We use an exponential decay mathematical model: Score = 100 * exp(-Total Emissions / 12). If your emissions are 0 Tons, you receive a score of 100. The national average of 8.0 Tons yields a score of ~51. Lower scores indicate high ecological footprints.'
    },
    {
      q: 'What is the significance of CO2e?',
      a: 'CO2e stands for Carbon Dioxide Equivalent. It is a standard metric used to compare emissions from various greenhouse gases (like carbon dioxide, methane, and nitrous oxide) based on their global warming potential (GWP), scaling them all into equivalent units of carbon dioxide.'
    },
    {
      q: 'Is my data secure?',
      a: 'Absolutely. EcoTrace runs entirely client-side. Your inputs, calculation audits, history logs, API keys, and offset checkboxes are stored directly in your browser\'s local storage. No information is transmitted or stored on remote servers.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto w-full flex flex-col gap-12 animate-fade-in">
      
      {/* Educational Header */}
      <section className="flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <Globe className="w-3.5 h-3.5" /> Climate Literacy
          </div>
          <h2 className="font-heading font-extrabold text-3xl text-white mb-4">
            Understanding Your <br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Greenhouse Impact
            </span>
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-4">
            A carbon footprint measures the total greenhouse gas emissions caused directly and indirectly by an individual, organization, event, or product. It is expressed in equivalent tons of carbon dioxide (CO2e).
          </p>
          <p className="text-slate-400 text-sm leading-relaxed">
            Everyday activities—such as burning fuel in cars, consuming coal-heavy grid electricity, taking flights, and eating carbon-heavy red meat—all contribute to the warming of our atmosphere. Tracking these activities lets you pinpoint where you can make changes.
          </p>
        </div>

        <div className="flex-1 flex justify-center">
          <div className="p-8 rounded-3xl bg-slate-900/20 border border-slate-800/80 max-w-sm w-full flex flex-col gap-4">
            <div className="flex items-center gap-3 text-emerald-400">
              <Leaf className="w-5 h-5" />
              <span className="font-heading font-bold text-sm">Carbon Factors Used</span>
            </div>
            <div className="text-xs text-slate-400 flex flex-col gap-2.5">
              <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span>Petrol Driving</span>
                <span className="text-slate-300 font-semibold">0.18 kg CO2e / km</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span>Grid Electricity</span>
                <span className="text-slate-300 font-semibold">0.38 kg CO2e / kWh</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span>Short Flights</span>
                <span className="text-slate-300 font-semibold">0.25 kg CO2e / km</span>
              </div>
              <div className="flex justify-between">
                <span>Balanced Diet</span>
                <span className="text-slate-300 font-semibold">1.8 Tons CO2e / yr</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="flex flex-col gap-6">
        <h3 className="font-heading font-bold text-2xl text-white text-center mb-4">Frequently Asked Questions</h3>
        
        <div className="flex flex-col gap-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div 
                key={index} 
                className="rounded-2xl bg-slate-900/40 border border-slate-800 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-slate-800/20 transition-colors"
                >
                  <span className="font-heading font-bold text-sm sm:text-base text-slate-200">{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-emerald-400" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                </button>
                
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-slate-400 text-xs sm:text-sm leading-relaxed border-t border-slate-800/40 bg-slate-950/20 animate-fade-in">
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
