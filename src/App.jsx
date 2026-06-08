import React, { useState, useEffect } from 'react';
import { Leaf, Menu, X, Home as HomeIcon, Calculator as CalcIcon, LayoutDashboard, Sparkles, Info } from 'lucide-react';
import Home from './components/Home';
import Calculator from './components/Calculator';
import Dashboard from './components/Dashboard';
import AIAssistant from './components/AIAssistant';
import About from './components/About';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [currentResult, setCurrentResult] = useState(null);
  const [openaiKey, setOpenaiKey] = useState('');
  const [commits, setCommits] = useState({
    bulb: false,
    meatless: false,
    thermostat: false,
    carpool: false
  });

  // Seeds default baseline calculations if local storage is clean
  useEffect(() => {
    const savedHistory = localStorage.getItem('ecotrace_history_react');
    const savedKey = localStorage.getItem('ecotrace_openai_key');
    const savedCommits = localStorage.getItem('ecotrace_commits_react');

    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    } else {
      const demoData = [
        {
          id: Date.now() - 200000,
          date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          name: 'Baseline Footprint',
          transport: 3.4,
          energy: 2.9,
          flights: 1.5,
          diet: 1.8,
          total: 9.6,
          score: 38 // out of 100 (lower emissions = higher score)
        },
        {
          id: Date.now() - 100000,
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          name: 'Energy Savings Week',
          transport: 2.6,
          energy: 2.1,
          flights: 0.7,
          diet: 1.2,
          total: 6.6,
          score: 59
        }
      ];
      setHistory(demoData);
      localStorage.setItem('ecotrace_history_react', JSON.stringify(demoData));
    }

    if (savedKey) setOpenaiKey(savedKey);
    
    if (savedCommits) {
      setCommits(JSON.parse(savedCommits));
    }
  }, []);

  const saveHistoryEntry = (entryName) => {
    if (!currentResult) return;
    const newEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      name: entryName || `Audit - ${new Date().toLocaleDateString()}`,
      ...currentResult
    };

    const updatedHistory = [...history, newEntry];
    setHistory(updatedHistory);
    localStorage.setItem('ecotrace_history_react', JSON.stringify(updatedHistory));
    setCurrentResult(null);
    setActivePage('dashboard');
  };

  const deleteHistoryEntry = (id) => {
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem('ecotrace_history_react', JSON.stringify(updated));
  };

  const clearHistory = () => {
    if (window.confirm('Clear all calculation logs? This action is permanent.')) {
      setHistory([]);
      localStorage.removeItem('ecotrace_history_react');
    }
  };

  const updateCommits = (newCommits) => {
    setCommits(newCommits);
    localStorage.setItem('ecotrace_commits_react', JSON.stringify(newCommits));
  };

  const updateOpenaiKey = (key) => {
    setOpenaiKey(key);
    localStorage.setItem('ecotrace_openai_key', key);
  };

  // Rendering dynamic sub-views
  const renderContent = () => {
    switch (activePage) {
      case 'home':
        return <Home onNavigate={setActivePage} />;
      case 'calculator':
        return (
          <Calculator 
            onSave={saveHistoryEntry} 
            currentResult={currentResult} 
            setCurrentResult={setCurrentResult} 
          />
        );
      case 'dashboard':
        return (
          <Dashboard 
            history={history} 
            onDelete={deleteHistoryEntry} 
            onClearAll={clearHistory} 
            commits={commits}
            onUpdateCommits={updateCommits}
          />
        );
      case 'ai-assistant':
        return (
          <AIAssistant 
            history={history} 
            openaiKey={openaiKey} 
            onUpdateKey={updateOpenaiKey} 
          />
        );
      case 'about':
        return <About />;
      default:
        return <Home onNavigate={setActivePage} />;
    }
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'calculator', label: 'Calculator', icon: CalcIcon },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'ai-assistant', label: 'AI Recommendations', icon: Sparkles },
    { id: 'about', label: 'About', icon: Info }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#030712] text-slate-100">
      {/* Sticky Navigation Header */}
      <header className="sticky top-0 z-50 bg-[#030712]/85 backdrop-blur-md border-b border-emerald-950/40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActivePage('home')}>
            <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <Leaf className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="font-heading font-extrabold text-2xl tracking-tight bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              EcoTrace
            </span>
          </div>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-300 ${
                    active 
                      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-[inset_0_0_12px_rgba(16,185,129,0.05)]' 
                      : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-900/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Mobile Menu Trigger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-slate-200"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <nav className="md:hidden absolute top-20 left-0 w-full bg-[#030712] border-b border-emerald-950/40 p-4 flex flex-col gap-2 shadow-2xl">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActivePage(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold border transition-all duration-200 ${
                    active 
                      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
                      : 'text-slate-400 border-transparent hover:bg-slate-900/40'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        )}
      </header>

      {/* Main Content Sections */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10 flex flex-col justify-center">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900/80 bg-slate-950/50 py-8 text-center text-sm text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <p className="font-heading font-semibold text-slate-400">EcoTrace Platform &copy; 2026</p>
            <p className="text-xs text-slate-600 mt-1">Calculations align with EPA carbon coefficient standards.</p>
          </div>
          <div className="flex gap-4 text-xs">
            <button onClick={() => setActivePage('home')} className="hover:text-emerald-400 transition-colors">Home</button>
            <button onClick={() => setActivePage('calculator')} className="hover:text-emerald-400 transition-colors">Calculator</button>
            <button onClick={() => setActivePage('dashboard')} className="hover:text-emerald-400 transition-colors">Dashboard</button>
            <button onClick={() => setActivePage('about')} className="hover:text-emerald-400 transition-colors">Methodology</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
