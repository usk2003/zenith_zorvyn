import React, { useMemo, useState } from 'react';
import { 
  Zap, TrendingUp, ShieldAlert, BarChart3, CreditCard, 
  Wallet, Briefcase, Calendar, ArrowUpRight, ArrowDownRight,
  Calculator, Landmark, PieChart as PieIcon, LineChart as LineIcon
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, Cell, PieChart, Pie, AreaChart, Area
} from 'recharts';
import useStore from '../store/useStore';
import { formatCurrency } from '../utils/dashboardUtils';
import { 
  calculateLoanMetrics, 
  calculateSIPFutureValue, 
  getFinancialAudit, 
  calculateLoanFreedomDate 
} from '../utils/advancedAnalytics';

const StrategicIntelligence = () => {
  const { transactions, loans, investments, creditCards, currency } = useStore();
  const [sipYears, setSipYears] = useState(10);
  const [returnRate, setReturnRate] = useState(12);

  const audit = useMemo(() => getFinancialAudit(transactions), [transactions]);
  const loanSummary = useMemo(() => loans.map(calculateLoanMetrics), [loans]);
  const freedomData = useMemo(() => calculateLoanFreedomDate(loans, investments, audit?.surplus || 0), [loans, investments, audit]);

  // Asset Allocation for Pie Chart
  const assetData = useMemo(() => investments.map(inv => ({
    name: inv.name,
    value: inv.current
  })), [investments]);

  // SIP Growth Data for Area Chart
  const growthData = useMemo(() => {
    const totalSip = investments.reduce((s, i) => s + (i.sip || 0), 0);
    return Array.from({ length: 11 }, (_, i) => ({
      year: `Yr ${i}`,
      value: calculateSIPFutureValue(totalSip, returnRate, i)
    }));
  }, [investments, returnRate]);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Intelligence Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 dark:border-white/5 pb-10">
        <div className="flex-1">
          <h1 className="text-5xl font-black tracking-tighter text-gray-900 dark:text-white uppercase italic leading-none">Strategic Intelligence</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 dark:text-gray-500 mt-4 opacity-80">Advanced Analytical Engine & Predictive Wealth Modeling</p>
        </div>
        <div className="flex items-center gap-8 bg-gray-50 dark:bg-white/5 p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm">
          <div className="text-right">
             <p className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-widest mb-1">Portfolio Surplus</p>
             <p className={`text-2xl font-black ${(audit?.surplus || 0) >= 0 ? 'text-accent' : 'text-red-500'} italic tracking-tighter`}>{formatCurrency(audit?.surplus || 0, currency)}</p>
          </div>
          <div className="w-14 h-14 bg-accent/10 border border-accent/20 rounded-2xl flex items-center justify-center text-accent shadow-xl shadow-accent/10 animate-pulse"><Zap size={28} /></div>
        </div>
      </div>

      {/* Row 1: Transaction Radar & Asset Nexus */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-10">
        {/* Transaction Radar */}
        <section className="bg-white dark:bg-black p-10 rounded-[3.5rem] border border-emerald-500/10 dark:border-emerald-500/20 space-y-10 relative overflow-hidden group shadow-sm transition-all hover:scale-[1.01] hover:shadow-[0_0_50px_rgba(16,185,129,0.15)] hover:border-accent/40 duration-700">
           <div className="absolute top-0 right-0 p-12 opacity-5 text-accent -rotate-12 group-hover:rotate-0 group-hover:scale-125 transition-all duration-1000"><BarChart3 size={150} /></div>
           <div className="relative z-10">
              <h2 className="text-2xl font-black uppercase tracking-tighter italic flex items-center gap-4 text-gray-900 dark:text-white leading-tight">
                <BarChart3 className="text-accent" size={24} /> Transaction Radar
              </h2>
              <p className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 mt-2 tracking-[0.3em]">Outlier Detection & Magnitude Analysis</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              {audit?.largestTransaction && (
                <div className="p-8 bg-gray-50 dark:bg-white/[0.03] rounded-3xl border border-gray-100 dark:border-white/5 group/card hover:border-accent/40 transition-all duration-500">
                   <p className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 mb-4 tracking-widest">Largest Outlier</p>
                   <div className="flex items-center justify-between">
                      <div>
                         <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter italic">{formatCurrency(audit.largestTransaction.amount, currency)}</p>
                         <p className="text-[10px] font-black text-accent uppercase tracking-widest mt-1 opacity-80">{audit.largestTransaction.category} Audit</p>
                      </div>
                      <div className="p-4 bg-red-500/10 text-red-500 rounded-2xl group-hover/card:rotate-12 transition-transform duration-500"><ShieldAlert size={24} /></div>
                   </div>
                </div>
              )}
              <div className="p-8 bg-gray-50 dark:bg-white/[0.03] rounded-3xl border border-gray-100 dark:border-white/5 group/card hover:border-accent/40 transition-all duration-500">
                 <p className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 mb-4 tracking-widest">Efficiency Ratio</p>
                 <div className="flex items-center justify-between">
                    <div>
                       <p className="text-4xl font-black text-accent tracking-tighter italic">{(audit?.incomeExpenseRatio || 0).toFixed(2)}x</p>
                       <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mt-2">Resource Velocity</p>
                    </div>
                    <div className="p-4 bg-accent/10 text-accent rounded-2xl group-hover/card:scale-110 transition-transform duration-500"><Zap size={24} /></div>
                 </div>
              </div>
           </div>

           <div className="h-60 pt-6">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={transactions.slice(0, 15).reverse()}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#888" opacity={0.1} />
                    <XAxis dataKey="date" hide />
                    <YAxis hide />
                    <RechartsTooltip 
                       contentStyle={{ borderRadius: '24px', border: 'none', backgroundColor: '#000', color: '#fff', padding: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
                       itemStyle={{ fontWeight: 900, fontSize: '12px' }}
                       cursor={{ fill: 'rgba(16,185,129,0.05)' }}
                    />
                    <Bar dataKey="amount" radius={[12, 12, 0, 0]}>
                       {transactions.slice(0,15).map((entry, index) => (
                         <Cell key={index} fill={entry.type === 'income' ? '#10b981' : '#fff'} opacity={0.4 + (index/15)*0.6} />
                       ))}
                    </Bar>
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </section>

        {/* Asset Nexus */}
        <section className="bg-white dark:bg-black p-10 rounded-[3.5rem] border border-emerald-500/10 dark:border-emerald-500/20 space-y-10 transition-all hover:scale-[1.01] hover:shadow-[0_0_50px_rgba(16,185,129,0.1)] hover:border-accent/30 duration-700">
           <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter italic flex items-center gap-4 text-gray-900 dark:text-white leading-tight">
                <Briefcase className="text-accent" size={24} /> Asset Nexus
              </h2>
              <p className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 mt-2 tracking-[0.3em]">Portfolio Allocation & Expansion</p>
           </div>
           
           <div className="flex flex-col sm:flex-row items-center justify-between gap-10">
              <div className="w-full sm:w-1/2 h-56">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie data={assetData} dataKey="value" innerRadius={60} outerRadius={90} paddingAngle={8} stroke="rgba(255,255,255,0.05)">
                          {assetData.map((entry, index) => (
                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                          ))}
                       </Pie>
                       <RechartsTooltip 
                          contentStyle={{ borderRadius: '20px', border: 'none', backgroundColor: '#000', color: '#fff' }}
                        />
                    </PieChart>
                 </ResponsiveContainer>
              </div>
              <div className="flex-1 w-full space-y-4">
                 {investments.map((inv, i) => (
                   <div key={inv.id} className="flex items-center justify-between group/inv">
                      <div className="flex items-center gap-3">
                         <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                         <span className="text-[11px] font-black uppercase text-gray-500 dark:text-gray-400 tracking-widest group-hover/inv:text-white transition-colors">{inv.name}</span>
                      </div>
                      <span className="text-sm font-black text-gray-900 dark:text-white italic tracking-tighter">{formatCurrency(inv.current, currency)}</span>
                   </div>
                 ))}
                 <div className="pt-6 mt-6 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-accent tracking-[0.2em]">Total Invested Protocol</span>
                    <span className="text-xl font-black text-gray-900 dark:text-white italic tracking-tighter">{formatCurrency(investments.reduce((s,i) => s + i.invested, 0), currency)}</span>
                 </div>
              </div>
           </div>
        </section>
      </div>

      {/* Row 2: Liability Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         {/* Loan Intelligence */}
         <section className="bg-white dark:bg-black p-10 rounded-[3.5rem] border border-emerald-500/10 dark:border-emerald-500/20 space-y-10 group shadow-sm transition-all hover:scale-[1.01] hover:shadow-[0_0_50px_rgba(239,68,68,0.05)] hover:border-red-500/20 duration-700">
            <div className="flex items-center justify-between">
               <div>
                  <h2 className="text-2xl font-black uppercase tracking-tighter italic flex items-center gap-4 text-gray-900 dark:text-white leading-tight">
                    <Landmark className="text-accent" size={24} /> Liability Matrix
                  </h2>
                  <p className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 mt-2 tracking-[0.3em]">Debt Service Coverage & Extinction</p>
               </div>
               <div className="px-5 py-2.5 bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-red-500/20 animate-pulse">
                  {loans.length} Active Liabilities
               </div>
            </div>

            <div className="space-y-6">
               {loans.map((loan, idx) => {
                 const m = loanSummary[idx];
                 return (
                   <div key={loan.id} className="space-y-5 p-8 bg-gray-50 dark:bg-white/[0.02] rounded-[2.5rem] border border-gray-100 dark:border-white/5 hover:border-accent/40 transition-all duration-500">
                      <div className="flex items-center justify-between">
                         <div>
                            <h4 className="text-sm font-black uppercase italic tracking-tighter text-gray-900 dark:text-white leading-tight">{loan.name}</h4>
                            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-widest">{loan.interestRate}% Int Rate | {m.remainingMonths} Months Protocol Remaining</p>
                         </div>
                         <div className="text-right">
                            <p className="text-[9px] font-black uppercase text-gray-400 mb-1 tracking-widest">Monthly EMI</p>
                            <p className="text-lg font-black text-accent italic tracking-tighter">{formatCurrency(m.emi, currency)}</p>
                         </div>
                      </div>
                      <div className="h-2.5 bg-gray-200 dark:bg-white/5 rounded-full overflow-hidden border border-gray-100 dark:border-white/5">
                         <div className="h-full bg-accent rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all duration-1000" style={{ width: `${m.progress}%` }} />
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                         <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-white/20 rounded-full" /> Extinguished: {formatCurrency(loan.paidAmount, currency)}</span>
                         <span className="text-accent italic">Principal: {formatCurrency(loan.principal, currency)}</span>
                      </div>
                   </div>
                 );
               })}

               {/* Credit Cards Grid */}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                   {creditCards.map(card => (
                     <div key={card.id} className="p-7 bg-white dark:bg-black text-gray-900 dark:text-white rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl relative overflow-hidden group/card hover:border-accent/40 transition-all duration-500">
                        <div className="absolute -top-8 -right-8 w-24 h-24 bg-accent/5 dark:bg-accent/10 rounded-full blur-2xl group-hover/card:scale-150 transition-transform duration-1000" />
                        <div className="relative z-10 space-y-4">
                           <div className="flex items-center justify-between">
                              <p className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-widest">{card.name}</p>
                              <CreditCard size={16} className="text-accent opacity-40" />
                           </div>
                           <div>
                              <p className="text-2xl font-black italic tracking-tighter">{formatCurrency(card.balance, currency)}</p>
                              <div className="h-1 w-8 bg-accent rounded-full mt-2" />
                           </div>
                           <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-accent">
                              <span className="opacity-80">Due: {card.dueDate}</span>
                              <span className="text-gray-400 dark:text-gray-600">LMT: {formatCurrency(card.limit, currency)}</span>
                           </div>
                        </div>
                     </div>
                   ))}
               </div>
            </div>
         </section>

         {/* Predictive Intelligence & Freedom Clock */}
         <section className="bg-white dark:bg-black text-gray-900 dark:text-white p-10 rounded-[3.5rem] border border-emerald-500/10 dark:border-emerald-500/20 shadow-2xl relative overflow-hidden group transition-all hover:scale-[1.01] hover:shadow-[0_0_60px_rgba(16,185,129,0.2)] hover:border-accent/30 duration-700">
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[radial-gradient(circle_at_1px_1px,#000_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] bg-[size:32px_32px] pointer-events-none" />
            
            <div className="relative z-10 space-y-12">
               <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter italic flex items-center gap-4 leading-tight">
                      <Zap className="text-accent" size={24} /> Freedom Logic
                    </h2>
                    <p className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 mt-2 tracking-[0.3em]">Predictive Debt Extinction Model</p>
                  </div>
                  <Calendar className="text-accent/20 group-hover:text-accent/40 transition-colors duration-700" size={48} />
               </div>

               {/* The Freedom Clock */}
               <div className="text-center py-12 bg-gray-50 dark:bg-white/[0.03] rounded-[3.5rem] border border-emerald-500/10 dark:border-emerald-500/20 backdrop-blur-3xl relative group/clock overflow-hidden shadow-inner transition-all duration-700 hover:shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                  <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover/clock:opacity-100 transition-opacity duration-700" />
                  <p className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-[0.6em] mb-6 opacity-80">Projected Liberty Horizon</p>
                  <h3 className="text-6xl font-black tracking-tighter text-accent animate-in zoom-in-75 duration-1000 italic">{freedomData.date || 'Analyzing Assets...'}</h3>
                  <p className="text-base font-black text-gray-500 dark:text-gray-400 mt-6 italic uppercase tracking-tight">Est. {freedomData.months} Months to Absolute Sovereignty</p>
                  
                  <div className="mt-10 flex items-center justify-center gap-8 px-6">
                     <div className="flex-1 p-5 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-3xl shadow-sm">
                        <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1 leading-tight">Liquidity Capacity</p>
                        <p className="text-sm font-black text-gray-900 dark:text-white italic">{formatCurrency(audit?.surplus || 0, currency)}</p>
                     </div>
                     <div className="flex-1 p-5 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-3xl shadow-sm">
                        <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1 leading-tight">Growth Acceleration</p>
                        <p className="text-sm font-black text-gray-900 dark:text-white italic">{formatCurrency(investments.reduce((s,i) => s + i.sip, 0), currency)}</p>
                     </div>
                  </div>
               </div>

               {/* Wealth Projections */}
               <div className="space-y-8 bg-gray-50 dark:bg-white/[0.02] p-8 rounded-[3rem] border border-gray-100 dark:border-white/5">
                  <div className="flex items-center justify-between">
                     <div>
                        <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">Asset Growth Projections</h4>
                        <p className="text-[8px] font-bold text-accent uppercase tracking-widest mt-1 italic">Simulation Rate: {returnRate}% Expected Yield</p>
                     </div>
                     <div className="flex items-center gap-4">
                        <input 
                           type="range" 
                           min="8" 
                           max="25" 
                           value={returnRate} 
                           onChange={e => setReturnRate(Number(e.target.value))} 
                           className="w-24 h-1.5 bg-gray-500 dark:bg-gray-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg" 
                        />
                     </div>
                  </div>
                  <div className="h-48 group-hover:scale-[1.02] transition-transform duration-700">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={growthData}>
                           <defs>
                              <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                 <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                              </linearGradient>
                           </defs>
                           <RechartsTooltip 
                              contentStyle={{ backgroundColor: '#000', border: 'none', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', padding: '12px' }}
                              itemStyle={{ color: '#10b981', fontWeight: 900, fontSize: '14px', textTransform: 'uppercase', fontStyle: 'italic' }}
                           />
                           <Area type="monotone" dataKey="value" stroke="#10b981" fillOpacity={1} fill="url(#colorVal)" strokeWidth={4} animationDuration={2000} />
                        </AreaChart>
                     </ResponsiveContainer>
                  </div>
                  <div className="flex items-start gap-4 p-5 bg-accent/5 rounded-2xl border border-accent/10">
                     <Calculator size={18} className="text-accent shrink-0 mt-1" />
                     <p className="text-[9px] font-black italic text-gray-500 dark:text-gray-400 uppercase tracking-widest leading-relaxed">
                        ZENITH Intelligence Note: Predictive analytics assume reinvestment of all generated surplus. 
                        Debt extinction cycles prioritize high-interest liabilities via automated protocol.
                     </p>
                  </div>
               </div>
            </div>
         </section>
      </div>
    </div>
  );
};

export default StrategicIntelligence;
