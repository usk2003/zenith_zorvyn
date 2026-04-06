import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line, Cell, PieChart, Pie
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Zap, 
  ShieldAlert, 
  PieChart as PieIcon, 
  BarChart3, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Settings,
  LayoutGrid,
  Wallet,
  Landmark,
  Bitcoin,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import useStore from '../store/useStore';
import { formatCurrency, getBudgetMetrics } from '../utils/dashboardUtils';
import { 
  getInsightCards, 
  getMoMComparison, 
  getTopCategories, 
  getSavingsTrend, 
  getSmartInsight,
  getHeatmapData,
  exportTransactionsToCSV,
  exportTransactionsToJSON,
  importTransactionsFromJSON,
  getAccountDistribution
} from '../utils/insights';
import Skeleton from '../components/Skeleton';
import useInitialLoading from '../hooks/useInitialLoading';

const AccountIcon = ({ type, ...props }) => {
  switch (type) {
    case 'Bank': return <Landmark {...props} />;
    case 'UPI': return <Zap {...props} />;
    case 'Demat': return <TrendingUp {...props} />;
    case 'Coins': return <Bitcoin {...props} />;
    default: return <Wallet {...props} />;
  }
};

const Insights = () => {
  const { transactions, role, restoreData, accounts, budgets, setBudget, currency } = useStore();
  const [activeTab, setActiveTab] = useState('overview');
  const isAdmin = role === 'admin';
  const isLoading = useInitialLoading(1000);
  
  const metrics = useMemo(() => getInsightCards(transactions), [transactions]);
  const momData = useMemo(() => getMoMComparison(transactions), [transactions]);
  const categories = useMemo(() => getTopCategories(transactions), [transactions]);
  const savingsTrend = useMemo(() => getSavingsTrend(transactions), [transactions]);
  const smartObservation = useMemo(() => getSmartInsight(transactions, budgets), [transactions, budgets]);
  const heatmapData = useMemo(() => getHeatmapData(transactions), [transactions]);
  const budgetData = useMemo(() => getBudgetMetrics(budgets, transactions), [budgets, transactions]);
  const accountDist = useMemo(() => getAccountDistribution(accounts), [accounts]);

  const COLORS = ['#10b981', '#14b8a6', '#059669', '#0d9488', '#22c55e'];

  const handleJSONImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    importTransactionsFromJSON(file, (data) => {
      restoreData(data);
    });
  };

  const handleUpdateBudget = (category, currentLimit) => {
    const newLimit = prompt(`Update budget for ${category}:`, currentLimit);
    if (newLimit && !isNaN(newLimit)) {
      setBudget({ category, limit: parseFloat(newLimit), type: 'expense' });
    }
  };

  if (!transactions.length) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100 dark:bg-gray-900 dark:border-gray-800">
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-full mb-6">
          <Zap size={48} className="text-gray-300" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white">Analysis Pending</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-center max-w-sm">We need more transaction history to generate meaningful insights and smart observations.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">
            {isLoading ? <Skeleton className="h-9 w-64 rounded-xl" /> : 'Strategic Intelligence'}
          </div>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {isLoading ? <Skeleton className="h-4 w-48 rounded-lg" /> : 'Advanced pattern analysis and optimization.'}
          </p>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl">
          {[
            { id: 'overview', name: 'Overview', icon: <Activity size={16} /> },
            { id: 'budgets', name: 'Budgets', icon: <ShieldAlert size={16} /> },
            { id: 'accounts', name: 'Accounts', icon: <LayoutGrid size={16} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id ? 'bg-white dark:bg-gray-900 text-accent shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
          {/* Insight Cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
             <div className="p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm relative group">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Top Spend Category</p>
                <p className="text-2xl font-black text-gray-900 dark:text-white">{metrics.highestCategory}</p>
                <p className="text-xs text-accent font-medium mt-2 flex items-center gap-1">
                   <Activity size={14} /> Optimization targets found
                </p>
             </div>
             <div className="p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm relative group">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Largest Singe Outflow</p>
                <p className="text-2xl font-black text-expense">{formatCurrency(metrics.biggestExpense, currency)}</p>
                <p className="text-xs text-gray-400 font-bold mt-2 uppercase tracking-tight">Requires Oversight</p>
             </div>
             <div className="p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm relative group">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Avg. Monthly Spend</p>
                <p className="text-2xl font-black text-gray-900 dark:text-white">{formatCurrency(metrics.avgMonthlySpend, currency)}</p>
                <p className="text-xs text-gray-400 font-bold mt-2 uppercase tracking-tight">Based on history</p>
             </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 p-8 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
               <h3 className="text-xl font-black text-gray-900 dark:text-white mb-8">Income vs Expenses (6 Mo)</h3>
               <div className="h-72">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={momData}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.5} />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#9CA3AF' }} dy={10} />
                     <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#9CA3AF' }} />
                     <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                     <Bar dataKey="income" fill="#10b981" radius={[8, 8, 0, 0]} name="Income" />
                     <Bar dataKey="expense" fill="#ef4444" radius={[8, 8, 0, 0]} name="Expense" />
                   </BarChart>
                 </ResponsiveContainer>
               </div>
            </div>

            <div className="p-8 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
               <h3 className="text-xl font-black text-gray-900 dark:text-white mb-8">Spending Peaks</h3>
               <div className="grid grid-cols-7 gap-2">
                 {[...Array(28)].map((_, i) => {
                   const dayData = heatmapData.find(d => d.day === i + 1);
                   const val = dayData ? dayData.value : 0;
                   const intensity = val === 0 ? 'bg-gray-50 dark:bg-gray-800/50' : val < 1000 ? 'bg-accent/20' : val < 5000 ? 'bg-accent/40' : val < 10000 ? 'bg-accent/60' : 'bg-accent';
                   return <div key={i} className={`aspect-square rounded-lg ${intensity} cursor-help group transition-all hover:scale-110`} title={`${formatCurrency(val, currency)} on Day ${i+1}`} />;
                 })}
               </div>
               <div className="mt-8 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                 <span>Chill</span>
                 <div className="flex gap-1"><div className="w-2 h-2 rounded-sm bg-accent/20"/><div className="w-2 h-2 rounded-sm bg-accent/40"/><div className="w-2 h-2 rounded-sm bg-accent"/></div>
                 <span>Flame</span>
               </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'budgets' && (
        <div className="animate-in fade-in slide-in-from-right-8 duration-500">
           <div className="grid gap-6 grid-cols-1 lg:grid-cols-4">
              <div className="lg:col-span-3 space-y-4">
                 {budgetData.map(b => (
                   <div key={b.category} className="p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm group hover:shadow-xl hover:-translate-y-1 transition-all">
                      <div className="flex justify-between items-start mb-4">
                         <div>
                            <h4 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">{b.category}</h4>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Monthly Allowance</p>
                         </div>
                         <button 
                            onClick={() => handleUpdateBudget(b.category, b.limit)}
                            className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-accent hover:bg-accent/10 transition-all opacity-0 group-hover:opacity-100"
                         >
                            <Settings size={16} />
                         </button>
                      </div>
                      <div className="relative pt-1">
                         <div className="flex mb-2 items-center justify-between">
                            <div>
                               <span className={`text-[10px] font-black inline-block py-1 px-2 uppercase rounded-full ${b.isOverBudget ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                  {b.isOverBudget ? 'Exceeded' : `${Math.round(b.percentage)}% Consumed`}
                               </span>
                            </div>
                            <div className="text-right">
                               <span className="text-xs font-black text-gray-900 dark:text-white">{formatCurrency(b.spent, currency)} / {formatCurrency(b.limit, currency)}</span>
                            </div>
                         </div>
                         <div className="overflow-hidden h-2.5 mb-4 text-xs flex rounded-full bg-gray-100 dark:bg-gray-800">
                            <div style={{ width: `${b.percentage}%` }} className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-1000 ${b.isOverBudget ? 'bg-red-500' : 'bg-accent'}`}></div>
                         </div>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                         <span>Remaining: {formatCurrency(b.remaining, currency)}</span>
                         {b.isOverBudget && <span className="text-red-500 animate-pulse">Critical Over-spend</span>}
                      </div>
                   </div>
                 ))}
              </div>
              <div className="p-6 bg-accent rounded-[2.5rem] text-white shadow-xl shadow-accent/20 h-fit sticky top-24">
                 <ShieldAlert size={40} fill="white" fillOpacity={0.2} className="mb-4" />
                 <h3 className="text-2xl font-black mb-2">Budget Intelligence</h3>
                 <p className="text-emerald-100 font-bold text-xs leading-relaxed uppercase tracking-widest">
                    Your budgeting system allows you to define hard limits for every outflow category. 
                    Monitor real-time progress and receive smart alerts before critical limits are reached.
                 </p>
                 <button className="mt-8 w-full py-4 bg-white text-accent rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all active:scale-95 shadow-xl">
                    Define New Limit
                 </button>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'accounts' && (
        <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-8">
           <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
              <div className="lg:col-span-2 p-8 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                 <h3 className="text-xl font-black text-gray-900 dark:text-white mb-8">Asset Liquidity & Distribution</h3>
                 <div className="h-80">
                   <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                       <Pie 
                          data={accountDist} 
                          cx="50%" 
                          cy="50%" 
                          innerRadius={80} 
                          outerRadius={110} 
                          paddingAngle={8} 
                          dataKey="value"
                        >
                         {accountDist.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                         ))}
                       </Pie>
                       <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                       <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" />
                     </PieChart>
                   </ResponsiveContainer>
                 </div>
              </div>

              <div className="space-y-4">
                 {accountDist.map((acc, i) => (
                   <div key={acc.name} className="p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between group hover:shadow-lg transition-all">
                      <div className="flex items-center gap-4">
                         <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-accent group-hover:scale-110 transition-transform"><AccountIcon type={acc.type} size={20} /></div>
                         <div>
                            <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase truncate max-w-[120px]">{acc.name}</h4>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{acc.type}</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-sm font-black text-gray-900 dark:text-white">{formatCurrency(acc.value, currency)}</p>
                         <p className="text-[10px] font-bold text-accent uppercase tracking-widest">{((acc.value / accountDist.reduce((s, a) => s + a.value, 0)) * 100).toFixed(1)}%</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      {/* AI Smart Observation Summary */}
      <div 
        className="p-10 bg-gradient-to-br from-accent to-[#059669] rounded-[2.5rem] shadow-2xl shadow-accent/20 relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10 -rotate-12 transition-transform group-hover:rotate-0 duration-1000">
           <Zap size={140} fill="white" />
        </div>
        <div className="relative max-w-2xl">
           <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mb-6">
              <Activity size={24} />
           </div>
           <h3 className="text-3xl font-black text-white mb-4 tracking-tight">Executive Summary</h3>
           <p className="text-emerald-50 text-xl font-bold leading-relaxed italic">
              "{smartObservation}"
           </p>
           <div className="mt-8 flex gap-4">
              <button className="px-8 py-4 bg-white text-accent rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
                 Download Report
              </button>
              <button 
                onClick={() => exportTransactionsToJSON(transactions, role)}
                className="px-8 py-4 bg-accent-dark/20 border border-white/20 backdrop-blur-sm text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                 Vault Backup
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;
