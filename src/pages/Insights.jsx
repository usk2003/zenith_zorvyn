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
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 dark:border-white/5 pb-8">
        <div className="flex-1">
          <div className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white uppercase italic leading-none">
            {isLoading ? <Skeleton className="h-10 w-80 rounded-xl" /> : 'Strategic Intelligence'}
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mt-3 opacity-60">
            {isLoading ? <Skeleton className="h-4 w-48 rounded-lg" /> : 'Advanced pattern analysis and optimization.'}
          </p>
        </div>
        
        {/* [Analytical Navigation] */}
        <div className="flex bg-gray-50 dark:bg-white/5 p-1.5 rounded-[1.5rem] border border-gray-100 dark:border-white/5">
          {[
            { id: 'overview', name: 'Overview', icon: <Activity size={16} /> },
            { id: 'budgets', name: 'Budgets', icon: <ShieldAlert size={16} /> },
            { id: 'accounts', name: 'Accounts', icon: <LayoutGrid size={16} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                activeTab === tab.id ? 'bg-white dark:bg-accent text-accent dark:text-white shadow-xl shadow-accent/20' : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
          {/* [Diagnostic Cards] */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
             <div className="p-8 bg-white dark:bg-black rounded-[2.5rem] border border-emerald-500/10 dark:border-emerald-500/20 shadow-sm relative group animate-in fade-in slide-in-from-bottom-4 duration-700 delay-75 overflow-hidden transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(16,185,129,0.1)] hover:border-accent/40">
                <div className="absolute top-0 right-0 p-8 opacity-5 text-accent group-hover:scale-125 transition-transform duration-1000"><BarChart3 size={80} /></div>
                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Top Spend Category</p>
                <p className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">{metrics.highestCategory}</p>
                <p className="text-[10px] text-accent font-black mt-4 flex items-center gap-2 uppercase tracking-widest">
                   <Activity size={14} className="animate-pulse" /> Optimization targets found
                </p>
             </div>
             <div className="p-8 bg-white dark:bg-black rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm relative group animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 overflow-hidden transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(239,68,68,0.15)] hover:border-red-500/40">
                <div className="absolute top-0 right-0 p-8 opacity-5 text-red-500 group-hover:scale-125 transition-transform duration-1000"><TrendingUp size={80} /></div>
                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Largest Singe Outflow</p>
                <p className="text-3xl font-black text-expense uppercase tracking-tighter italic">{formatCurrency(metrics.biggestExpense, currency)}</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-black mt-4 uppercase tracking-[0.2em] opacity-80">Requires Oversight</p>
             </div>
             <div className="p-8 bg-white dark:bg-black rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm relative group animate-in fade-in slide-in-from-bottom-4 duration-700 delay-225 overflow-hidden transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(16,185,129,0.1)] hover:border-accent/40">
                <div className="absolute top-0 right-0 p-8 opacity-5 text-emerald-500 group-hover:scale-125 transition-transform duration-1000"><Zap size={80} /></div>
                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Avg. Monthly Spend</p>
                <p className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">{formatCurrency(metrics.avgMonthlySpend, currency)}</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-black mt-4 uppercase tracking-[0.2em] opacity-80">Based on history</p>
             </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* [Historical Variance] */}
            <div className="lg:col-span-2 p-8 bg-white dark:bg-black rounded-[2.5rem] border border-emerald-500/10 dark:border-emerald-500/20 shadow-sm transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.05)] duration-700">
               <div className="flex items-center justify-between mb-10">
                  <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">Income vs Expenses (6 Mo)</h3>
                  <div className="flex gap-4">
                     <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"/><span className="text-[10px] font-black uppercase text-gray-400">Income</span></div>
                     <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-red-500"/><span className="text-[10px] font-black uppercase text-gray-400">Expense</span></div>
                  </div>
               </div>
               <div className="h-72">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={momData}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.1} />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#6B7280' }} dy={10} />
                     <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#6B7280' }} />
                     <Tooltip 
                        contentStyle={{ borderRadius: '24px', border: 'none', backgroundColor: '#000', color: '#fff', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', padding: '16px' }} 
                        itemStyle={{ fontWeight: 900, fontSize: '12px' }}
                     />
                     <Bar dataKey="income" fill="#10b981" radius={[8, 8, 0, 0]} name="Income" />
                     <Bar dataKey="expense" fill="#ef4444" radius={[8, 8, 0, 0]} name="Expense" />
                   </BarChart>
                 </ResponsiveContainer>
               </div>
            </div>

            {/* [Spending Concentration] */}
            <div className="p-8 bg-white dark:bg-black rounded-[2.5rem] border border-emerald-500/10 dark:border-emerald-500/20 shadow-xl transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] duration-700">
               <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter mb-10">Spending Peaks</h3>
               <div className="grid grid-cols-7 gap-3">
                 {[...Array(28)].map((_, i) => {
                   const dayData = heatmapData.find(d => d.day === i + 1);
                   const val = dayData ? dayData.value : 0;
                   const intensity = val === 0 ? 'bg-gray-50 dark:bg-white/[0.03]' : val < 1000 ? 'bg-accent/20' : val < 5000 ? 'bg-accent/40' : val < 10000 ? 'bg-accent/60' : 'bg-accent';
                   return (
                     <div 
                       key={i} 
                       className={`aspect-square rounded-xl ${intensity} cursor-help group transition-all duration-500 hover:scale-110 hover:shadow-lg hover:shadow-accent/20`} 
                       title={`${formatCurrency(val, currency)} on Day ${i+1}`} 
                     />
                   );
                 })}
               </div>
               <div className="mt-10 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
                 <span>Strategic Chill</span>
                 <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-accent/20"/><div className="w-2.5 h-2.5 rounded-sm bg-accent/40"/><div className="w-2.5 h-2.5 rounded-sm bg-accent"/></div>
                 <span>Outflow Peak</span>
               </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'budgets' && (
        <div className="animate-in fade-in slide-in-from-right-8 duration-500">
           {/* [Budget Protocol] */}
           <div className="grid gap-10 grid-cols-1 lg:grid-cols-4">
              <div className="lg:col-span-3 space-y-6">
                 {budgetData.map(b => (
                   <div key={b.category} className={`p-8 bg-white dark:bg-black rounded-[2.5rem] border transition-all duration-500 hover:scale-[1.01] ${b.isOverBudget ? 'border-red-500/20 hover:border-red-500/50 hover:shadow-[0_0_40px_rgba(239,68,68,0.15)] shadow-xl shadow-red-500/5' : 'border-emerald-500/10 dark:border-emerald-500/20 hover:border-accent/40 hover:shadow-[0_0_40px_rgba(16,185,129,0.1)] shadow-sm'}`}>
                      <div className="flex justify-between items-start mb-6">
                         <div>
                            <h4 className="text-xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">{b.category}</h4>
                            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">Monthly Allowance Protocol</p>
                         </div>
                         <button 
                            onClick={() => handleUpdateBudget(b.category, b.limit)}
                            className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-accent hover:bg-accent/10 transition-all duration-500 group-hover:scale-110"
                         >
                            <Settings size={18} />
                         </button>
                      </div>
                      <div className="relative pt-1">
                         <div className="flex mb-4 items-center justify-between">
                            <div>
                               <span className={`text-[10px] font-black inline-block py-1.5 px-4 uppercase tracking-widest rounded-full ${b.isOverBudget ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                  {b.isOverBudget ? 'Protocol Breach' : `${Math.round(b.percentage)}% Consumed`}
                               </span>
                            </div>
                            <div className="text-right">
                               <span className="text-sm font-black text-gray-900 dark:text-white italic">{formatCurrency(b.spent, currency)} / {formatCurrency(b.limit, currency)}</span>
                            </div>
                         </div>
                         <div className="overflow-hidden h-3 mb-6 flex rounded-full bg-gray-100 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                            <div style={{ width: `${b.percentage}%` }} className={`shadow-lg flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-1000 ${b.isOverBudget ? 'bg-red-500' : 'bg-accent'}`}></div>
                         </div>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
                         <span>Remaining Balance: {formatCurrency(b.remaining, currency)}</span>
                         {b.isOverBudget && <div className="flex items-center gap-2 text-red-500 font-black animate-pulse"><AlertCircle size={14} /> CRITICAL OVER-SPEND</div>}
                      </div>
                   </div>
                 ))}
              </div>
              <div className="p-8 bg-accent rounded-[2.5rem] text-white shadow-2xl shadow-accent/20 h-fit sticky top-28 group overflow-hidden transition-all hover:scale-[1.03] hover:shadow-[0_0_50px_rgba(16,185,129,0.3)] duration-700">
                 <div className="absolute top-0 right-0 p-10 opacity-10 -rotate-12 transition-transform group-hover:rotate-0 group-hover:scale-125 duration-1000"><ShieldAlert size={140} fill="white" /></div>
                 <div className="relative z-10">
                   <h3 className="text-3xl font-black mb-4 uppercase italic italic tracking-tighter leading-tight">Budget Intelligence</h3>
                   <p className="text-emerald-100 font-black text-[11px] leading-relaxed uppercase tracking-widest opacity-80">
                      ZENITH allows you to define strict allowance protocols for every financial outflow. 
                      Monitor real-time velocity and receive predictive breach alerts.
                   </p>
                   <button className="mt-10 w-full py-5 bg-white text-accent rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl shadow-accent/20">
                      Define Protocol
                   </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'accounts' && (
        <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-10">
           {/* [Resource Distribution] */}
           <div className="grid gap-10 grid-cols-1 lg:grid-cols-3">
              <div className="lg:col-span-2 p-10 bg-white dark:bg-black rounded-[3rem] border border-emerald-500/10 dark:border-emerald-500/20 shadow-sm transition-all hover:shadow-[0_0_40px_rgba(16,185,129,0.05)] duration-700">
                 <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter mb-10">Asset Liquidity & Distribution</h3>
                 <div className="h-80">
                   <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                       <Pie 
                          data={accountDist} 
                          cx="50%" 
                          cy="50%" 
                          innerRadius={80} 
                          outerRadius={120} 
                          paddingAngle={8} 
                          dataKey="value"
                        >
                         {accountDist.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(255,255,255,0.05)" />
                         ))}
                       </Pie>
                       <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', backgroundColor: '#000', color: '#fff', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', padding: '16px' }} />
                       <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }} />
                     </PieChart>
                   </ResponsiveContainer>
                 </div>
              </div>

              <div className="space-y-4">
                 {accountDist.map((acc, i) => (
                   <div key={acc.name} className="p-7 bg-white dark:bg-black rounded-[2rem] border border-emerald-500/10 dark:border-emerald-500/20 shadow-sm flex items-center justify-between group hover:border-accent/40 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] transition-all duration-500">
                      <div className="flex items-center gap-5">
                         <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl text-accent group-hover:scale-110 transition-all duration-500 shadow-sm"><AccountIcon type={acc.type} size={22} /></div>
                         <div>
                            <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase italic leading-tight truncate max-w-[140px]">{acc.name}</h4>
                            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-0.5">{acc.type}</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-base font-black text-gray-900 dark:text-white tracking-tighter">{formatCurrency(acc.value, currency)}</p>
                         <p className="text-[10px] font-black text-accent uppercase tracking-widest mt-0.5 animate-in slide-in-from-right-1">{((acc.value / accountDist.reduce((s, a) => s + a.value, 0)) * 100).toFixed(1)}%</p>
                      </div>
                   </div>
                 ))}
                 <button className="w-full py-5 border-2 border-dashed border-gray-100 dark:border-white/10 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-accent hover:border-accent/40 hover:bg-accent/5 hover:scale-[1.02] transition-all">Connect New Resource</button>
              </div>
           </div>
        </div>
      )}

      {/* [AI Strategy Summary] */}
      <div 
        className="p-12 bg-white dark:bg-black border border-emerald-500/10 dark:border-emerald-500/20 rounded-[3rem] shadow-2xl relative overflow-hidden group transition-all hover:shadow-[0_0_60px_rgba(16,185,129,0.2)] duration-700"
      >
        <div className="absolute top-0 right-0 p-12 opacity-5 text-accent -rotate-12 transition-transform group-hover:rotate-0 group-hover:scale-150 duration-1000">
           <Zap size={180} fill="#10b981" />
        </div>
        <div className="relative max-w-3xl">
           <div className="w-14 h-14 bg-accent/10 border border-accent/20 rounded-2xl flex items-center justify-center text-accent mb-8 shadow-xl shadow-accent/10">
              <Activity size={28} />
           </div>
           <h3 className="text-4xl font-black text-gray-900 dark:text-white mb-6 uppercase italic tracking-tighter leading-none">Executive Summary</h3>
           <p className="text-gray-600 dark:text-gray-400 text-2xl font-black italic leading-tight tracking-tight">
              "{smartObservation}"
           </p>
           <div className="mt-10 flex flex-wrap gap-6">
              <button className="px-10 py-5 bg-gray-900 dark:bg-white text-white dark:text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-gray-200 dark:shadow-none">
                 Download Audit Report
              </button>
              <button 
                onClick={() => exportTransactionsToJSON(transactions, role)}
                className="px-10 py-5 bg-white dark:bg-black border border-gray-200 dark:border-white/10 text-gray-900 dark:text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
              >
                 Vault Backup Protocol
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;
