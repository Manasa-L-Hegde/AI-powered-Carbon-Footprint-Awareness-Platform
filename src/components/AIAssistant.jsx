import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Key, BrainCircuit, RefreshCw, AlertCircle, CheckCircle2, FileText, Download, Shield, TrendingDown, Target } from 'lucide-react';
import { generateRecommendations, generateAuditReport, classifyRisk } from '../utils/carbonEngine';

const RISK_STYLES = {
  emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
  rose: 'bg-rose-500/10 border-rose-500/20 text-rose-400'
};

export default function AIAssistant({ history, openaiKey, onUpdateKey }) {
  const [keyInput, setKeyInput] = useState(openaiKey);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('recommendations');
  const [apiResponse, setApiResponse] = useState('');
  const reportRef = useRef(null);

  const latest = history.length > 0 ? history[history.length - 1] : null;
  const recs = generateRecommendations(latest);
  const auditReport = latest ? generateAuditReport(latest) : null;
  const risk = latest ? classifyRisk(latest.score) : null;

  // Optional OpenAI fetch
  const handleFetchOpenAI = async () => {
    if (!openaiKey || !latest) return;
    setError('');
    setLoading(true);
    try {
      const prompt = `You are a professional climate sustainability auditor.\nAnalyze the user's carbon footprint:\n- Transport: ${latest.transport} T\n- Energy: ${latest.energy} T\n- Flights: ${latest.flights} T\n- Diet: ${latest.diet} T\n- Total: ${latest.total} T\nProvide 3 actionable steps for the top emission categories. Use Markdown.`;
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${openaiKey}` },
        body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'system', content: 'You are an environmental consultant.' }, { role: 'user', content: prompt }], temperature: 0.7 })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'OpenAI API error');
      setApiResponse(data.choices[0].message.content);
    } catch (err) {
      setError(err.message || 'API call failed. Local analysis is always available.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveKey = () => { onUpdateKey(keyInput.trim()); };
  const handleClearKey = () => { setKeyInput(''); onUpdateKey(''); setApiResponse(''); };

  // Download report as text
  const downloadReport = () => {
    if (!auditReport) return;
    const blob = new Blob([auditReport], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EcoTrace_Audit_Report_${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!latest) {
    return (
      <div className="max-w-3xl mx-auto w-full animate-fade-in">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-md text-center">
          <BrainCircuit className="w-16 h-16 text-emerald-400/40 mx-auto mb-6" />
          <h2 className="font-heading font-extrabold text-2xl text-white mb-3">AI Assistant Ready</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">Complete a carbon calculation first. The AI engine will analyze your data and generate personalized sustainability recommendations — entirely offline.</p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5" /> No API Key Required
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full flex flex-col gap-6 animate-fade-in">

      {/* Tab Navigation */}
      <div className="flex gap-2 p-1 rounded-2xl bg-slate-900/60 border border-slate-800" role="tablist" aria-label="AI Assistant tabs">
        {[
          { id: 'recommendations', label: 'Smart Recommendations', icon: Sparkles },
          { id: 'audit', label: 'Audit Report', icon: FileText },
          { id: 'api', label: 'OpenAI (Optional)', icon: Key }
        ].map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button key={tab.id} role="tab" id={`tab-${tab.id}`} aria-selected={active} aria-controls={`panel-${tab.id}`} onClick={() => setActiveTab(tab.id)} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 border border-transparent hover:text-slate-200'}`}>
              <Icon className="w-4 h-4" /> <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── TAB: Recommendations ── */}
      {activeTab === 'recommendations' && recs && (
        <div id="panel-recommendations" role="tabpanel" aria-labelledby="tab-recommendations" className="flex flex-col gap-6 animate-slide-up">
          {/* Profile Summary */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className={`px-3 py-1.5 rounded-full border text-xs font-bold ${RISK_STYLES[risk.color]}`}>
                {risk.label}
              </div>
              <span className="text-sm text-slate-400">
                Score: <strong className="text-white">{recs.profile.score}/100</strong> • Total: <strong className="text-white">{recs.profile.total.toFixed(1)} T</strong>
              </span>
            </div>
            <p className="text-slate-400 text-sm">{risk.description}</p>
          </div>

          {/* Primary Focus */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-md">
            <h3 className="font-heading font-bold text-lg text-white mb-1 flex items-center gap-2">
              <span className="text-xl">{recs.primary.icon}</span> Primary Focus: {recs.primary.name}
            </h3>
            <p className="text-slate-400 text-xs mb-6">Highest emission category at <strong className="text-white">{recs.primary.value.toFixed(1)} Tons</strong> ({Math.round((recs.primary.value / recs.profile.total) * 100)}% of total)</p>
            <div className="flex flex-col gap-4">
              {recs.primary.tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-slate-950/30 border border-slate-800/60">
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold flex-shrink-0 mt-0.5 ${tip.impact === 'high' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-sky-500/20 text-sky-400'}`}>
                    {tip.impact === 'high' ? 'H' : 'M'}
                  </span>
                  <div>
                    <h4 className="font-semibold text-sm text-slate-200">{tip.action}</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{tip.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Secondary Focus */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-md">
            <h3 className="font-heading font-bold text-lg text-white mb-1 flex items-center gap-2">
              <span className="text-xl">{recs.secondary.icon}</span> Secondary Focus: {recs.secondary.name}
            </h3>
            <p className="text-slate-400 text-xs mb-6">Second highest at <strong className="text-white">{recs.secondary.value.toFixed(1)} Tons</strong> ({Math.round((recs.secondary.value / recs.profile.total) * 100)}% of total)</p>
            <div className="flex flex-col gap-4">
              {recs.secondary.tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-slate-950/30 border border-slate-800/60">
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold flex-shrink-0 mt-0.5 ${tip.impact === 'high' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-sky-500/20 text-sky-400'}`}>
                    {tip.impact === 'high' ? 'H' : 'M'}
                  </span>
                  <div>
                    <h4 className="font-semibold text-sm text-slate-200">{tip.action}</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{tip.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reduction Estimate */}
          <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/15 flex items-center gap-4">
            <TrendingDown className="w-8 h-8 text-emerald-400 flex-shrink-0" />
            <div>
              <h4 className="font-heading font-bold text-sm text-emerald-400">Estimated Reduction Potential</h4>
              <p className="text-slate-400 text-xs mt-1">By implementing the above recommendations, you could reduce emissions by approximately <strong className="text-white">{recs.reductionEstimate} Tons</strong>, bringing your footprint to <strong className="text-emerald-400">{Math.max(0, recs.profile.total - recs.reductionEstimate).toFixed(1)} T</strong>.</p>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: Audit Report ── */}
      {activeTab === 'audit' && (
        <div id="panel-audit" role="tabpanel" aria-labelledby="tab-audit" className="animate-slide-up">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-md">
            <div className="flex justify-between items-center border-b border-slate-800/60 pb-4 mb-6">
              <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" /> Full Audit Report
              </h3>
              <button id="download-report-btn" onClick={downloadReport} className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
                <Download className="w-3.5 h-3.5" /> Download .md
              </button>
            </div>
            <div ref={reportRef} className="prose prose-invert max-w-none text-slate-300 text-sm space-y-3 leading-relaxed">
              {auditReport && auditReport.split('\n').map((line, i) => {
                if (line.startsWith('# ')) return <h2 key={i} className="font-heading font-extrabold text-2xl text-white mt-6 mb-2">{line.replace('# ', '')}</h2>;
                if (line.startsWith('## ')) return <h3 key={i} className="font-heading font-bold text-lg text-white mt-6 mb-2">{line.replace('## ', '')}</h3>;
                if (line.startsWith('### ')) return <h4 key={i} className="font-heading font-semibold text-base text-emerald-400 mt-4 mb-1">{line.replace('### ', '')}</h4>;
                if (line.startsWith('> ')) return <blockquote key={i} className="pl-4 border-l-2 border-emerald-500/30 text-slate-400 text-xs italic">{line.replace('> ', '')}</blockquote>;
                if (line.startsWith('| ')) {
                  const cells = line.split('|').filter(c => c.trim() !== '');
                  if (cells.every(c => c.trim().match(/^-+$/))) return null;
                  const isHeader = i > 0 && auditReport.split('\n')[i + 1]?.includes('---');
                  return (
                    <div key={i} className={`grid gap-2 text-xs py-1.5 ${isHeader ? 'font-bold text-slate-200 border-b border-slate-800' : 'text-slate-400'}`} style={{ gridTemplateColumns: `repeat(${cells.length}, 1fr)` }}>
                      {cells.map((cell, j) => <span key={j} className="px-1">{cell.replace(/\*\*/g, '').trim()}</span>)}
                    </div>
                  );
                }
                if (line.startsWith('---')) return <hr key={i} className="border-slate-800/80 my-4" />;
                if (line.startsWith('*') && line.endsWith('*') && !line.startsWith('**')) return <p key={i} className="text-xs text-slate-500 italic mt-4">{line.replace(/\*/g, '')}</p>;
                if (line.trim() === '') return null;
                return <p key={i}>{line.replace(/\*\*/g, '')}</p>;
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: OpenAI API ── */}
      {activeTab === 'api' && (
        <div id="panel-api" role="tabpanel" aria-labelledby="tab-api" className="flex flex-col gap-6 animate-slide-up">
          <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-md">
            <h3 className="font-heading font-bold text-base text-white mb-2 flex items-center gap-2">
              <Key className="w-5 h-5 text-emerald-400" /> OpenAI Integration (Optional)
            </h3>
            <p className="text-slate-400 text-xs mb-4">
              Optionally provide your API key for GPT-powered analysis. The key stays in local storage only. <strong className="text-emerald-400">All features work without this.</strong>
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input type="password" id="openai-key-input" placeholder="sk-..." value={keyInput} onChange={e => setKeyInput(e.target.value)} className="flex-1 px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm outline-none focus:border-emerald-500 transition-colors" aria-label="OpenAI API key" />
              <div className="flex gap-2">
                <button id="save-key-btn" onClick={handleSaveKey} className="flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-slate-950 border border-emerald-500/20 text-emerald-400 text-sm font-semibold hover:bg-emerald-500/10 transition-colors">Save</button>
                {openaiKey && <button id="clear-key-btn" onClick={handleClearKey} className="px-5 py-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-950/40 text-sm font-semibold hover:bg-rose-500/20 transition-colors">Clear</button>}
              </div>
            </div>
            {openaiKey && (
              <div className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> Key stored locally. Click below to fetch GPT analysis.
              </div>
            )}
          </div>

          {openaiKey && (
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-md">
              <div className="flex justify-between items-center border-b border-slate-800/60 pb-4 mb-6">
                <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-emerald-400" /> GPT-4o Analysis
                </h3>
                <button id="fetch-gpt-btn" onClick={handleFetchOpenAI} disabled={loading} className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 disabled:opacity-40 transition-colors">
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Fetch
                </button>
              </div>
              {error && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-start gap-3 mb-4">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-xs">{error}</p>
                </div>
              )}
              {apiResponse ? (
                <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{apiResponse}</div>
              ) : (
                <p className="text-slate-500 text-sm text-center py-8">Click "Fetch" to get GPT-powered recommendations.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
