import React, { useState, useEffect } from 'react';
import { Sparkles, Key, Send, BrainCircuit, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AIAssistant({ history, openaiKey, onUpdateKey }) {
  const [keyInput, setKeyInput] = useState(openaiKey);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const activeProfile = history.length > 0 ? history[history.length - 1] : null;

  // Handles offline client-side parsing of user data
  const generateOfflineRecommendations = (profile) => {
    if (!profile) {
      return `### EcoTrace AI Audit Summary
Please complete a calculation under the **Calculator** tab first. Once calculated, this panel will automatically parse your metrics and render tailored actions.`;
    }

    const categories = [
      { name: 'Transport', val: profile.transport, tips: [
        'Committing to an EV for daily commutes cuts vehicle emissions by roughly 70% against traditional petrol cars.',
        'Consider utilizing train or rapid bus transit for regional trips to drop passenger emissions below 0.04kg/km.',
        'Carpooling or sharing commutes divides gasoline consumption directly by the participant count.'
      ]},
      { name: 'Home Energy', val: profile.energy, tips: [
        'Upgrading standard halogen bulbs to LED replacements reduces lighting energy draw by up to 80%.',
        'Heating and cooling account for 50% of home bills; a smart thermostat optimizes usage to avoid idle heating.',
        'Inquire with your utility supplier about switching to a certified renewable or green power tariff.'
      ]},
      { name: 'Flights', val: profile.flights, tips: [
        'Short-haul flights spend high portions of fuel during take-off; prefer high-speed trains for distances under 500km.',
        'When flying long-haul is required, consider direct routes to reduce takeoff cycles and select carbon-offset checkboxes.',
        'Hold virtual conferences instead of physical cross-country meetings where possible.'
      ]},
      { name: 'Diet & Lifestyle', val: profile.diet, tips: [
        'Reducing red meat intake in favor of chicken or fish cuts your diet emissions in half.',
        'Aggressive recycling and food composting stops organic waste decomposing in high-emission landfills.',
        'Transitioning to plant-based diets reduces agricultural carbon footprint by up to 60%.'
      ]}
    ];

    // Sort categories to find highest emitter
    const sorted = [...categories].sort((a, b) => b.val - a.val);
    const primaryEmitter = sorted[0];

    let mdText = `### EcoTrace AI Sustainability Audit

**Audit Profile:** ${profile.name} (Footprint: **${profile.total.toFixed(1)} Tons CO2e**)
**Target Focus:** ${primaryEmitter.name} (Highest Emitter: **${primaryEmitter.val.toFixed(1)} Tons**)

---

#### 🚨 Primary Focus Area: ${primaryEmitter.name}
Your emissions in **${primaryEmitter.name}** represent the largest slice of your footprint. Implement these high-impact changes:
${primaryEmitter.tips.map(tip => `*   **Action:** ${tip}`).join('\n')}

#### 💡 Secondary Focus: ${sorted[1].name}
Because **${sorted[1].name}** represents your second-highest emission category (**${sorted[1].val.toFixed(1)} Tons**), consider these steps:
${sorted[1].tips.map(tip => `*   **Action:** ${tip}`).join('\n')}

---

*Note: This report was compiled locally in real-time based on your carbon metrics. Provide an OpenAI API key above to unlock full natural language completions from GPT-4o.*`;

    return mdText;
  };

  const handleFetchRecommendations = async () => {
    setError('');
    setLoading(true);
    
    if (!activeProfile) {
      setError('Please add a calculation audit in the calculator before consulting the assistant.');
      setLoading(false);
      return;
    }

    if (!openaiKey) {
      // Offline fallback
      setTimeout(() => {
        const mdText = generateOfflineRecommendations(activeProfile);
        setResponse(mdText);
        setLoading(false);
      }, 1000);
      return;
    }

    // Call OpenAI API (Secure Endpoint client-side call)
    try {
      const prompt = `You are a professional climate sustainability auditor.
Analyze the user's carbon footprint profile and write a highly personalized, structured recommendations report.
Here is the user's data (in metric Tons CO2e per year):
- Transportation: ${activeProfile.transport}
- Home Energy: ${activeProfile.energy}
- Flights: ${activeProfile.flights}
- Diet & Lifestyle: ${activeProfile.diet}
- Total Annual Footprint: ${activeProfile.total}
- National Average baseline: 8.0 Tons/yr

Provide 3 primary actionable steps tailored specifically to their highest emitter categories, a summary of how they compare to average citizens, and a brief message of encouragement. Keep your response concise, using Markdown formatting.`;

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are an environmental consultant providing carbon reduction advice.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7
        })
      });

      const resultData = await res.json();
      
      if (!res.ok) {
        throw new Error(resultData.error?.message || 'OpenAI API request failed.');
      }

      setResponse(resultData.choices[0].message.content);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to reach OpenAI. Using local analysis instead.');
      // Local fallback on API error
      const mdText = generateOfflineRecommendations(activeProfile);
      setResponse(mdText);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Generate initial recommendation
    if (activeProfile) {
      const mdText = generateOfflineRecommendations(activeProfile);
      setResponse(mdText);
    } else {
      setResponse(`### EcoTrace AI Audit Summary\nPlease complete a calculation under the **Calculator** tab first. Once calculated, this panel will automatically parse your metrics and render tailored actions.`);
    }
  }, [history]);

  const handleSaveKey = () => {
    onUpdateKey(keyInput.trim());
    alert('API Key saved locally. All requests will now run through OpenAI.');
  };

  const handleClearKey = () => {
    setKeyInput('');
    onUpdateKey('');
    alert('API Key removed.');
  };

  return (
    <div className="max-w-3xl mx-auto w-full flex flex-col gap-6 animate-fade-in">
      
      {/* API Key Panel */}
      <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-md">
        <h3 className="font-heading font-bold text-base text-white mb-2 flex items-center gap-2">
          <Key className="w-5 h-5 text-emerald-400" /> OpenAI API Integration (Optional)
        </h3>
        <p className="text-slate-400 text-xs mb-4">
          Provide your API key to enable customized natural language recommendations. The key is stored locally in your browser and never sent to our servers.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <input 
            type="password" 
            placeholder="sk-..."
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            className="flex-1 px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm outline-none focus:border-emerald-500 transition-colors"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSaveKey}
              className="flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-slate-950 border border-emerald-500/20 text-emerald-400 text-sm font-semibold hover:bg-emerald-500/10 transition-colors"
            >
              Save Key
            </button>
            {openaiKey && (
              <button
                onClick={handleClearKey}
                className="px-5 py-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-950/40 text-sm font-semibold hover:bg-rose-500/20 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
        {openaiKey && (
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> OpenAI active (GPT-4o-mini will be consulted)
          </div>
        )}
      </div>

      {/* AI Assistant Output Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-md flex flex-col gap-6">
        <div className="flex justify-between items-center border-b border-slate-800/60 pb-4">
          <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-emerald-400 animate-pulse" /> Environmental Auditor AI
          </h3>
          <button
            onClick={handleFetchRecommendations}
            disabled={loading || !activeProfile}
            className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Recalculate AI Audit
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="font-semibold">Request Notice</p>
              <p className="text-xs text-rose-400/80 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Rendered report output */}
        <div className="prose prose-invert max-w-none text-slate-300 text-sm space-y-4 leading-relaxed">
          {response.split('\n').map((line, index) => {
            if (line.startsWith('### ')) {
              return <h3 key={index} className="font-heading font-bold text-lg text-white mt-6 mb-2">{line.replace('### ', '')}</h3>;
            }
            if (line.startsWith('#### ')) {
              return <h4 key={index} className="font-heading font-semibold text-base text-emerald-400 mt-4 mb-2">{line.replace('#### ', '')}</h4>;
            }
            if (line.startsWith('**') && line.endsWith('**')) {
              return <p key={index} className="font-bold text-white my-2">{line.replace(/\*\*/g, '')}</p>;
            }
            if (line.startsWith('*   **Action:**') || line.startsWith('*   ')) {
              return (
                <div key={index} className="flex items-start gap-2.5 ml-4 my-2 text-slate-300">
                  <span className="text-emerald-400 mt-1.5 font-bold">•</span>
                  <span>{line.replace('*   **Action:**', '').replace('*   ', '')}</span>
                </div>
              );
            }
            if (line.trim() === '---') {
              return <hr key={index} className="border-slate-800/80 my-6" />;
            }
            if (line.startsWith('*Note:')) {
              return <p key={index} className="text-xs text-slate-500 italic mt-6">{line.replace('*', '')}</p>;
            }
            if (line.trim() === '') return null;
            return <p key={index}>{line.replace(/\*\*/g, '')}</p>;
          })}
        </div>
      </div>

    </div>
  );
}
