import React, { useState, useMemo } from 'react';
import {
  User, Edit3, Check, X, Plus, Trash2, Target,
  TrendingUp, Wallet, Sparkles, Award, Shield,
  Database, Landmark, Briefcase, Calendar, Mail, Phone,
  Download, Upload, RefreshCw, AlertTriangle
} from 'lucide-react';
import useStore from '../store/useStore';
import { formatCurrency } from '../utils/dashboardUtils';

const AVATAR_COLORS = [
  '#10b981', '#059669', '#14b8a6', '#0d9488',
  '#22c55e', '#16a34a', '#84cc16', '#65a30d'
];

const Profile = () => {
  const { 
    userProfile, setUserProfile,
    goals, addGoal, deleteGoal, updateGoal,
    loans, addLoan, deleteLoan, updateLoan,
    investments, addInvestment, deleteInvestment, updateInvestment,
    transactions, accounts, addAccount, deleteAccount,
    incomeCategories, expenseCategories, addCategory, removeCategory,
    security, setSecurity, currency, setCurrency, resetStore, restoreData 
  } = useStore();

  const [activeTab, setActiveTab] = useState('identity');
  const [editing, setEditing] = useState(!userProfile.name);
  const [draft, setDraft] = useState({ ...userProfile });

  // Security States
  const [pinForm, setPinForm] = useState({ current: '', new: '', confirm: '' });
  const [secForm, setSecForm] = useState({ question: security.question || '', answer: '' });
  const [pinError, setPinError] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);

  const totalBalance = useMemo(() => accounts.reduce((s, a) => s + a.balance, 0), [accounts]);

  const handleProfileSave = () => {
    if (!draft.name.trim()) return;
    setUserProfile(draft);
    setEditing(false);
  };

  const handlePinChange = () => {
    if (pinForm.current !== security.pin) return setPinError('Current PIN Incorrect');
    if (pinForm.new.length !== 4) return setPinError('PIN must be 4 digits');
    if (pinForm.new !== pinForm.confirm) return setPinError('New PINs do not match');
    
    setSecurity({ pin: pinForm.new });
    setPinForm({ current: '', new: '', confirm: '' });
    setPinError('');
    setPinSuccess(true);
    setTimeout(() => setPinSuccess(false), 3000);
  };

  const handleSecUpdate = () => {
    if (!secForm.question || !secForm.answer) return;
    setSecurity({ question: secForm.question, answer: secForm.answer });
    setPinSuccess(true);
    setTimeout(() => setPinSuccess(false), 3000);
  };

  const handleExportData = () => {
    const data = useStore.getState();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zorvyn-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        restoreData(data);
        alert("Data restoration successful.");
      } catch (err) {
        alert("Invalid backup file.");
      }
    };
    reader.readAsText(file);
  };

  const initials = (userProfile.name || 'Z').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      {/* Page Header */}
      <div className="flex items-end justify-between border-b border-gray-100 dark:border-gray-800 pb-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-gray-900 dark:text-white uppercase italic leading-none">Command Center</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mt-3 opacity-60">Personnel Identity & Infrastructure Protocols</p>
        </div>
        <div className="flex bg-gray-100 dark:bg-gray-900 p-1.5 rounded-[1.5rem] border border-gray-200/50 dark:border-gray-800/50 shadow-inner">
           {['identity', 'infrastructure', 'security'].map(tab => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`px-8 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                 activeTab === tab ? 'bg-accent text-white shadow-xl shadow-accent/20 scale-105' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
               }`}
             >
               {tab}
             </button>
           ))}
        </div>
      </div>

      {activeTab === 'identity' && (
        <div className="space-y-8 animate-in slide-in-from-left-4 duration-500">
          <div className="bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden group">
            <div className="px-10 py-12">
              <div className="flex items-center gap-10">
                <div 
                  className="w-28 h-28 rounded-[2.5rem] bg-accent flex items-center justify-center text-white text-4xl font-black shadow-2xl transition-all duration-500 hover:rotate-6 shrink-0" 
                  style={{ backgroundColor: userProfile.avatarColor }}
                >
                  {initials}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">{userProfile.name || 'Anonymous Executive'}</h2>
                      <p className="text-[10px] font-black uppercase text-accent tracking-[0.4em] mt-3">Strategic Identity Profile</p>
                    </div>
                    {!editing ? (
                      <button onClick={() => setEditing(true)} className="btn-primary text-xs px-6"><Edit3 size={14} /> Update Personnel File</button>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={() => setEditing(false)} className="btn-primary opacity-60 text-xs">Cancel</button>
                        <button onClick={handleProfileSave} className="btn-primary text-xs"><Check size={14} /> Commit Changes</button>
                      </div>
                    )}
                  </div>

                  {!editing ? (
                    <div className="grid grid-cols-2 gap-8">
                      <div className="flex items-center gap-4 group/item">
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-400 group-hover/item:text-accent group-hover/item:bg-accent/5 transition-all"><Briefcase size={20} /></div>
                        <div>
                          <p className="text-[8px] font-black uppercase text-gray-400 tracking-widest mb-1">Job Title</p>
                          <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{userProfile.jobTitle}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 group/item">
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-400 group-hover/item:text-accent group-hover/item:bg-accent/5 transition-all"><Calendar size={20} /></div>
                        <div>
                          <p className="text-[8px] font-black uppercase text-gray-400 tracking-widest mb-1">Date of Birth</p>
                          <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{userProfile.dob || 'Not Initialized'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 group/item">
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-400 group-hover/item:text-accent group-hover/item:bg-accent/5 transition-all"><Mail size={20} /></div>
                        <div>
                          <p className="text-[8px] font-black uppercase text-gray-400 tracking-widest mb-1">Private Email</p>
                          <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{userProfile.email || 'None'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 group/item">
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-400 group-hover/item:text-accent group-hover/item:bg-accent/5 transition-all"><Phone size={20} /></div>
                        <div>
                          <p className="text-[8px] font-black uppercase text-gray-400 tracking-widest mb-1">Secure Line</p>
                          <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{userProfile.phone || 'None'}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                       <div className="space-y-6">
                          <div>
                             <label className="text-[10px] font-black uppercase text-gray-400 block mb-2 tracking-widest">Full Name</label>
                             <input type="text" value={draft.name} onChange={e => setDraft({...draft, name: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border-none outline-none font-bold text-sm focus:ring-2 focus:ring-accent/20 transition-all" />
                          </div>
                          <div>
                             <label className="text-[10px] font-black uppercase text-gray-400 block mb-2 tracking-widest">Job Title</label>
                             <input type="text" value={draft.jobTitle} onChange={e => setDraft({...draft, jobTitle: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border-none outline-none font-bold text-sm focus:ring-2 focus:ring-accent/20 transition-all" />
                          </div>
                       </div>
                       <div className="space-y-6">
                          <div>
                             <label className="text-[10px] font-black uppercase text-gray-400 block mb-2 tracking-widest">Date of Birth</label>
                             <input type="date" value={draft.dob} onChange={e => setDraft({...draft, dob: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border-none outline-none font-bold text-sm focus:ring-2 focus:ring-accent/20 transition-all" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="text-[10px] font-black uppercase text-gray-400 block mb-2 tracking-widest">Phone</label>
                                <input type="text" value={draft.phone} onChange={e => setDraft({...draft, phone: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border-none outline-none font-bold text-sm focus:ring-2 focus:ring-accent/20 transition-all" />
                             </div>
                             <div>
                                <label className="text-[10px] font-black uppercase text-gray-400 block mb-2 tracking-widest">Email</label>
                                <input type="email" value={draft.email} onChange={e => setDraft({...draft, email: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border-none outline-none font-bold text-sm focus:ring-2 focus:ring-accent/20 transition-all" />
                             </div>
                          </div>
                       </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-accent/10 text-accent rounded-xl"><Wallet size={20} /></div>
                <div>
                   <p className="text-[10px] font-black uppercase text-gray-400">Net Liquidity</p>
                   <p className="text-xl font-black">{formatCurrency(totalBalance, currency)}</p>
                </div>
             </div>
             <div className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl"><Database size={20} /></div>
                <div>
                   <p className="text-[10px] font-black uppercase text-gray-400">Asset Count</p>
                   <p className="text-xl font-black">{accounts.length}</p>
                </div>
             </div>
             <div className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-accent/10 text-accent rounded-xl"><Target size={20} /></div>
                <div>
                   <p className="text-[10px] font-black uppercase text-gray-400">Active Goals</p>
                   <p className="text-xl font-black">{goals.length}</p>
                </div>
             </div>
          </div>

          {/* Goal Roadmap Section */}
          <section className="bg-white dark:bg-gray-900 p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 space-y-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[100px] rounded-full group-hover:bg-accent/10 transition-colors" />
              <div className="flex items-center justify-between relative z-10">
                  <div>
                      <h2 className="text-3xl font-black uppercase tracking-tighter italic">Goal Roadmap</h2>
                      <p className="text-[10px] font-black uppercase text-accent tracking-[0.4em] mt-1 italic">Victory Trajectory Visualization</p>
                  </div>
                  <button onClick={() => {
                    const title = window.prompt("Goal Title:");
                    const target = window.prompt("Target Value:");
                    const monthly = window.prompt("Monthly Contribution (SIP/Savings):");
                    if (title && target) {
                      addGoal({ 
                        id: 'goal_' + Date.now(), 
                        title, 
                        target: parseFloat(target), 
                        current: 0, 
                        sipContribution: parseFloat(monthly || 0),
                        icon: 'target', 
                        color: '#10b981' 
                      });
                    }
                  }} className="px-6 py-3 bg-black dark:bg-white text-white dark:text-gray-900 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-xl">New Objective</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                {goals.map(goal => {
                  const progress = (goal.current / goal.target) * 100;
                  const remaining = Math.max(0, goal.target - goal.current);
                  const monthly = goal.sipContribution || 1000; // Default estimate if not provided
                  const monthsToVictory = Math.ceil(remaining / monthly);
                  
                  return (
                    <div key={goal.id} className="p-8 bg-gray-50 dark:bg-gray-800/30 rounded-[2.5rem] border border-gray-100 dark:border-white/5 space-y-6">
                       <div className="flex justify-between items-start">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-accent/10 border border-accent/20 rounded-2xl flex items-center justify-center text-accent"><Target size={24} /></div>
                             <div>
                                <h4 className="text-lg font-black uppercase tracking-tight italic">{goal.title}</h4>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Active Pursuit</p>
                             </div>
                          </div>
                          <button onClick={() => deleteGoal(goal.id)} className="text-gray-300 hover:text-red-500"><X size={16} /></button>
                       </div>

                       <div className="space-y-3">
                          <div className="flex justify-between items-end">
                             <div>
                                <p className="text-[8px] font-black uppercase text-gray-400 tracking-widest mb-1">Accumulated</p>
                                <p className="text-xl font-black text-accent">{formatCurrency(goal.current, currency)}</p>
                             </div>
                             <div className="text-right">
                                <p className="text-[8px] font-black uppercase text-gray-400 tracking-widest mb-1">Target Node</p>
                                <p className="text-sm font-black text-gray-900 dark:text-white uppercase">{formatCurrency(goal.target, currency)}</p>
                             </div>
                          </div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-700/50 rounded-full overflow-hidden">
                             <div className="h-full bg-accent transition-all duration-1000" style={{ width: `${progress}%` }} />
                          </div>
                       </div>

                       <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                          <div>
                             <p className="text-[8px] font-black uppercase text-gray-400 italic">Time To Victory</p>
                             <p className="text-xs font-black text-gray-900 dark:text-white mt-1 uppercase italic tracking-tighter">
                                {monthsToVictory >= 12 
                                  ? `${Math.floor(monthsToVictory/12)}y ${monthsToVictory%12}m remaining` 
                                  : `${monthsToVictory} months remaining`}
                             </p>
                          </div>
                          <div className="text-right">
                             <p className="text-[8px] font-black uppercase text-gray-400 italic">Savings Velocity</p>
                             <p className="text-xs font-black text-accent mt-1">{formatCurrency(monthly, currency)} / mo</p>
                          </div>
                       </div>
                    </div>
                  );
                })}
              </div>
          </section>
        </div>
      )}

      {activeTab === 'infrastructure' && (
        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8">
            {/* Capital Assets Management */}
            <section className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                      <h2 className="text-xl font-black uppercase tracking-tight">Capital Assets</h2>
                      <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Reserve Management Library</p>
                  </div>
                  <button onClick={() => {
                    const name = window.prompt("Account Name:");
                    const balance = window.prompt("Initial Balance:");
                    if (name && balance) addAccount({ id: Date.now().toString(), name, balance: parseFloat(balance), type: 'Cash' });
                  }} className="p-2 px-4 bg-accent text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all">Add Account</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {accounts.map(acc => (
                    <div key={acc.id} className="p-5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 relative group">
                        <div className="flex justify-between items-start mb-3">
                          <div className="p-2 bg-white dark:bg-gray-900 rounded-lg text-accent shadow-sm"><Landmark size={14} /></div>
                          <button onClick={() => deleteAccount(acc.id)} className="p-1.5 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                        </div>
                        <h4 className="text-xs font-black uppercase tracking-tight">{acc.name}</h4>
                        <p className="text-lg font-black text-accent mt-1">{formatCurrency(acc.balance, currency)}</p>
                    </div>
                  ))}
                </div>
            </section>

            {/* Currency & Classification Schemas */}
            <div className="space-y-8">
                <section className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 space-y-6">
                  <div>
                      <h2 className="text-xl font-black uppercase tracking-tight">Currency Protocol</h2>
                      <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Global Financial Units Configuration</p>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                      {[
                        { code: 'INR', label: 'Rupee ₹' },
                        { code: 'USD', label: 'Dollar $' },
                        { code: 'EUR', label: 'Euro €' },
                        { code: 'GBP', label: 'Pound £' }
                      ].map(curr => (
                        <button
                          key={curr.code}
                          onClick={() => setCurrency(curr.code)}
                          className={`p-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                            currency === curr.code 
                              ? 'bg-accent text-white border-accent shadow-lg shadow-accent/20' 
                              : 'bg-gray-50 dark:bg-gray-800 border-transparent text-gray-400 hover:border-accent/40'
                          }`}
                        >
                          {curr.label}
                        </button>
                      ))}
                  </div>
                </section>

                <section className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 space-y-8">
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-tight">Classification Schemas</h2>
                    <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Income & Expense Taxonomy</p>
                  </div>
                  
                  <div className="space-y-8">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[10px] font-black uppercase text-accent tracking-widest">Inflow Vectors</span>
                          <button onClick={() => {
                              const n = window.prompt("New Income Category:");
                              if (n) addCategory('income', n);
                          }} className="text-[18px] text-accent"><Plus size={16} /></button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {incomeCategories.map(c => (
                            <div key={c} className="flex items-center gap-2 group p-2 px-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-transparent hover:border-accent/20 transition-all">
                                <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300">{c}</span>
                                <button onClick={() => removeCategory('income', c)} className="p-0.5 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><X size={10} /></button>
                            </div>
                          ))}
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[10px] font-black uppercase text-red-500 tracking-widest">Outflow Vectors</span>
                          <button onClick={() => {
                              const n = window.prompt("New Expense Category:");
                              if (n) addCategory('expense', n);
                          }} className="text-[18px] text-red-500"><Plus size={16} /></button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {expenseCategories.map(c => (
                            <div key={c} className="flex items-center gap-2 group p-2 px-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-transparent hover:border-red-500/20 transition-all">
                                <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300">{c}</span>
                                <button onClick={() => removeCategory('expense', c)} className="p-0.5 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><X size={10} /></button>
                            </div>
                          ))}
                        </div>
                    </div>
                  </div>
                </section>
            </div>
          </div>

          {/* Data Management Section */}
          <section className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 space-y-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-[100px] rounded-full" />
              <div className="flex items-center gap-4 mb-4 relative z-10">
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl"><AlertTriangle size={20} className="text-red-500" /></div>
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-tight text-red-500">Data Management</h2>
                    <p className="text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-widest">Backup, Restore & Purge Protocols</p>
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                  <button 
                    onClick={handleExportData}
                    className="p-6 bg-white/5 border border-white/5 rounded-2xl flex flex-col items-center justify-center gap-3 hover:bg-white/10 transition-all group"
                  >
                    <Download size={24} className="text-accent group-hover:scale-110 transition-transform" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Backup JSON</span>
                  </button>
                  
                  <label className="p-6 bg-white/5 border border-white/5 rounded-2xl flex flex-col items-center justify-center gap-3 hover:bg-white/10 transition-all group cursor-pointer text-center">
                    <Upload size={24} className="text-blue-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Restore JSON</span>
                    <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
                  </label>

                  <button 
                    onClick={() => {
                        if(window.confirm("CRITICAL: This will purge all financial records. Proceed?")) {
                          resetStore();
                          window.location.href = "/";
                        }
                    }}
                    className="p-6 bg-red-500/5 border border-red-500/10 rounded-2xl flex flex-col items-center justify-center gap-3 hover:bg-red-500/10 transition-all group"
                  >
                    <RefreshCw size={24} className="text-red-500 group-hover:rotate-180 transition-transform duration-700" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Purge Store</span>
                  </button>
              </div>
          </section>

          {/* Liabilities Matrix Section */}
          <section className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 space-y-6">
              <div className="flex items-center justify-between mb-4">
                  <div>
                      <h2 className="text-xl font-black uppercase tracking-tight">Liabilities Matrix</h2>
                      <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Debt Extinction & Interest Engineering</p>
                  </div>
                  <button onClick={() => {
                    const name = window.prompt("Liability Name:");
                    const principal = window.prompt("Principal Amount:");
                    const interest = window.prompt("Interest Rate (APR %):");
                    const tenure = window.prompt("Tenure (Months):");
                    if (name && principal && interest && tenure) {
                      addLoan({ 
                        id: 'loan_' + Date.now(), 
                        name, 
                        principal: parseFloat(principal), 
                        interestRate: parseFloat(interest),
                        tenure: parseInt(tenure),
                        paidAmount: 0,
                        startDate: new Date().toISOString().slice(0, 10)
                      });
                    }
                  }} className="p-2 px-4 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all outline-none">Add Liability</button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loans.map(loan => {
                  const r = (loan.interestRate / 12) / 100;
                  const n = loan.tenure;
                  const P = loan.principal;
                  const EMI = P * r * (Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1));
                  const progress = Math.min(100, (loan.paidAmount / loan.principal) * 100);
                  
                  // Projection: Freedom Date
                  const startDate = new Date(loan.startDate);
                  const freedomDate = new Date(startDate);
                  freedomDate.setMonth(startDate.getMonth() + n);
                  
                  return (
                    <div key={loan.id} className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-[2rem] border border-gray-100 dark:border-gray-800 relative group">
                        <div className="flex justify-between items-start mb-6">
                           <div className="p-3 bg-red-500/10 text-red-500 rounded-xl"><Shield size={18} /></div>
                           <div className="flex items-center gap-2">
                             <button onClick={() => {
                               const morePaid = window.prompt(`Add to amount paid on "${loan.name}":`);
                               if (morePaid) updateLoan({ ...loan, paidAmount: (loan.paidAmount || 0) + parseFloat(morePaid) });
                             }} className="p-2 text-gray-400 hover:text-accent transition-all"><TrendingUp size={14} /></button>
                             <button onClick={() => deleteLoan(loan.id)} className="p-2 text-gray-300 hover:text-red-500 transition-all"><Trash2 size={14} /></button>
                           </div>
                        </div>
                        
                        <div className="space-y-4">
                           <div>
                              <h4 className="text-sm font-black uppercase tracking-tight text-gray-900 dark:text-white leading-none">{loan.name}</h4>
                              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-1">Status: Active Amortization</p>
                           </div>

                           <div className="grid grid-cols-2 gap-4">
                              <div>
                                 <p className="text-[8px] font-black uppercase text-gray-400 mb-1">Obligation</p>
                                 <p className="text-lg font-black text-gray-900 dark:text-white">{formatCurrency(loan.principal, currency)}</p>
                              </div>
                              <div className="text-right">
                                 <p className="text-[8px] font-black uppercase text-gray-400 mb-1">APR</p>
                                 <p className="text-lg font-black text-red-500 italic">{loan.interestRate}%</p>
                              </div>
                           </div>

                           <div className="space-y-2">
                              <div className="flex justify-between text-[8px] font-black uppercase tracking-widest">
                                 <span>Extinguished ({formatCurrency(loan.paidAmount || 0, currency)})</span>
                                 <span className="text-red-500">{progress.toFixed(1)}%</span>
                              </div>
                              <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                 <div className="h-full bg-red-500 transition-all duration-1000" style={{ width: `${progress}%` }} />
                              </div>
                           </div>

                           <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                              <div>
                                 <p className="text-[8px] font-black uppercase text-gray-400 underline decoration-red-500/30 underline-offset-4">Projected Freedom</p>
                                 <p className="text-xs font-black text-gray-700 dark:text-gray-300 mt-1 uppercase italic tracking-tighter">{freedomDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}</p>
                              </div>
                              <div className="text-right">
                                 <p className="text-[8px] font-black uppercase text-gray-400">Monthly EMI Est.</p>
                                 <p className="text-xs font-black text-red-500 mt-1">{formatCurrency(EMI, currency)}</p>
                              </div>
                           </div>
                        </div>
                    </div>
                  );
                })}
                {loans.length === 0 && (
                   <div className="col-span-full py-12 text-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-[3rem] opacity-40">
                      <p className="text-[10px] font-black uppercase tracking-[0.4em]">Zero Liabilities Detected In Protocol</p>
                   </div>
                )}
              </div>
          </section>

          {/* Investment Strategy Library */}
          <section className="bg-white dark:bg-gray-900 p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 space-y-8 relative overflow-hidden group/inv">
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full group-hover/inv:bg-blue-500/10 transition-colors" />
              <div className="flex items-center justify-between relative z-10">
                  <div>
                      <h2 className="text-3xl font-black uppercase tracking-tighter italic">Strategy Library</h2>
                      <p className="text-[10px] font-black uppercase text-blue-500 tracking-[0.4em] mt-1 italic">Mutual Fund & Multi-Asset Planning</p>
                  </div>
                  <button onClick={() => {
                    const name = window.prompt("Fund Name:");
                    const invested = window.prompt("Invested Capital:");
                    const market = window.prompt("Current Market Value:");
                    const rate = window.prompt("Expected Long-Term Return (Annual %):");
                    const horizon = window.prompt("Horizon (Years):");
                    if (name && invested) {
                      addInvestment({ 
                        id: 'inv_' + Date.now(), 
                        name, 
                        type: 'Mutual Fund',
                        invested: parseFloat(invested), 
                        current: parseFloat(market || invested),
                        expectedReturn: parseFloat(rate || 12),
                        horizon: parseInt(horizon || 10)
                      });
                    }
                  }} className="px-6 py-3 bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-xl shadow-blue-500/20">Add Exposure</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                {investments.map(inv => {
                   const P = inv.current;
                   const r = inv.expectedReturn / 100;
                   const t = inv.horizon;
                   const futureValue = P * Math.pow(1 + r, t);
                   const gainPct = ((inv.current - inv.invested) / inv.invested) * 100;
                   
                   return (
                     <div key={inv.id} className="p-8 bg-gray-50 dark:bg-gray-900/50 rounded-[2.5rem] border border-gray-100 dark:border-white/5 space-y-8">
                        <div className="flex justify-between items-start">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-500"><TrendingUp size={24} /></div>
                              <div>
                                 <h4 className="text-lg font-black uppercase tracking-tight italic">{inv.name}</h4>
                                 <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Type: {inv.type}</p>
                              </div>
                           </div>
                           <button onClick={() => deleteInvestment(inv.id)} className="text-gray-300 hover:text-red-500"><Trash2 size={16} /></button>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                           <div className="space-y-4">
                              <div>
                                 <p className="text-[8px] font-black uppercase text-gray-400 mb-1">Market Value</p>
                                 <p className="text-2xl font-black text-blue-500 italic">{formatCurrency(inv.current, currency)}</p>
                              </div>
                              <div className="flex items-center gap-3">
                                 <span className="text-[10px] font-black px-2 py-1 bg-green-500/10 text-green-500 rounded-lg">+{gainPct.toFixed(1)}% Gain</span>
                              </div>
                           </div>
                           <div className="bg-gray-100 dark:bg-white/5 p-4 rounded-3xl border border-gray-200 dark:border-white/10">
                              <p className="text-[8px] font-black uppercase text-gray-400 mb-1">Expected Return</p>
                              <p className="text-xl font-black text-gray-900 dark:text-white italic">{inv.expectedReturn}% <span className="text-[9px] font-bold text-gray-500">APR</span></p>
                              <p className="text-[8px] font-black uppercase text-gray-400 mt-3 mb-1">Horizon</p>
                              <p className="text-sm font-black text-blue-400 uppercase italic">{inv.horizon} Years</p>
                           </div>
                        </div>

                        <div className="p-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl relative overflow-hidden group/wealth">
                           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/wealth:scale-110 transition-transform"><Sparkles size={48} className="text-white" /></div>
                           <p className="text-[9px] font-black uppercase text-white/60 tracking-widest mb-1 italic">Projected Terminal Wealth</p>
                           <p className="text-3xl font-black text-white italic tracking-tighter">
                              {formatCurrency(futureValue, currency)}
                           </p>
                           <p className="text-[8px] font-bold text-white/40 mt-2 uppercase">Estimated value at the end of {inv.horizon}-year horizon</p>
                        </div>
                     </div>
                   );
                })}
              </div>
          </section>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-8 duration-500">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* PIN Management */}
              <section className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 space-y-6 shadow-xl">
                 <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-accent text-white rounded-2xl shadow-lg shadow-accent/20"><Shield size={20} /></div>
                    <div>
                       <h2 className="text-xl font-black uppercase">PIN Rotation</h2>
                       <p className="text-[9px] font-black uppercase text-gray-400">Security Credentials Protocol</p>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div>
                       <label className="text-[10px] font-bold uppercase text-gray-400 block mb-2">Current PIN</label>
                       <input type="password" value={pinForm.current} onChange={e => setPinForm({...pinForm, current: e.target.value.slice(0,4)})} placeholder="****" className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl outline-none font-black tracking-widest" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="text-[10px] font-bold uppercase text-gray-400 block mb-2">New PIN</label>
                          <input type="password" value={pinForm.new} onChange={e => setPinForm({...pinForm, new: e.target.value.slice(0,4)})} placeholder="****" className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl outline-none font-black tracking-widest text-accent" />
                       </div>
                       <div>
                          <label className="text-[10px] font-bold uppercase text-gray-400 block mb-2">Confirm PIN</label>
                          <input type="password" value={pinForm.confirm} onChange={e => setPinForm({...pinForm, confirm: e.target.value.slice(0,4)})} placeholder="****" className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl outline-none font-black tracking-widest text-accent" />
                       </div>
                    </div>
                    {pinError && <p className="text-[10px] font-black uppercase text-red-500 animate-shake">{pinError}</p>}
                    {pinSuccess && <p className="text-[10px] font-black uppercase text-accent animate-pulse">Update Succeeded</p>}
                    <button onClick={handlePinChange} className="w-full btn-primary py-4 mt-4">Initialize Rotation</button>
                 </div>
              </section>

              {/* Recovery Infrastructure */}
              <section className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 space-y-6 shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 blur-[100px] rounded-full" />
                 <div className="flex items-center gap-4 mb-4 relative z-10">
                    <div className="p-3 bg-accent/10 border border-accent/20 rounded-2xl"><Award size={20} className="text-accent" /></div>
                    <div>
                       <h2 className="text-xl font-black uppercase tracking-tight">Recovery Schema</h2>
                       <p className="text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-widest">Emergency Access Restoration Protocol</p>
                    </div>
                 </div>

                 <div className="space-y-5 relative z-10">
                    <div>
                       <label className="text-[10px] font-bold uppercase text-gray-400 dark:text-gray-500 block mb-2 tracking-widest">Security Question</label>
                       <input type="text" value={secForm.question} onChange={e => setSecForm({...secForm, question: e.target.value})} placeholder="e.g. Unique Identifier from 2008?" className="w-full bg-gray-50 dark:bg-white/5 p-4 rounded-2xl outline-none font-bold italic border border-gray-100 dark:border-white/10" />
                    </div>
                    <div>
                       <label className="text-[10px] font-bold uppercase text-gray-400 dark:text-gray-500 block mb-2 tracking-widest">Private Answer</label>
                       <input type="password" value={secForm.answer} onChange={e => setSecForm({...secForm, answer: e.target.value})} placeholder="********" className="w-full bg-gray-50 dark:bg-white/5 p-4 rounded-2xl outline-none font-black text-accent tracking-tighter" />
                    </div>
                    <button onClick={handleSecUpdate} className="w-full bg-accent hover:bg-emerald-600 text-white p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-accent/20">Update Recovery Key</button>
                 </div>
                 <div className="mt-6 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 leading-relaxed">
                    Warning: Recovery Answer is the only bypass to Administrative Lock. Keep it encrypted in memory.
                 </div>
              </section>
           </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
