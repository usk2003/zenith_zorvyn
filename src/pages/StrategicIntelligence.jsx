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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      {/* Intelligence Header */}
      <div className="flex items-end justify-between border-b border-gray-100 dark:border-gray-800 pb-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-gray-900 dark:text-white uppercase italic leading-none">Strategic Intelligence</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mt-3 opacity-60">Advanced Analytical Engine & Predictive Wealth Modeling</p>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <div className="text-right">
             <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Net Surplus</p>
             <p className={`text-xl font-black ${(audit?.surplus || 0) >= 0 ? 'text-accent' : 'text-red-500'}`}>{formatCurrency(audit?.surplus || 0, currency)}</p>
          </div>
          <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent"><Zap size={24} /></div>
        </div>
      </div>

      {/* Row 1: Transaction Radar & Asset Nexus */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8">
        {/* Transaction Radar */}
        <section className="bg-white dark:bg-gray-900 p-8 rounded-[3rem] border border-gray-100 dark:border-gray-800 space-y-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-5 text-accent"><BarChart3 size={120} /></div>
           <div className="relative z-10">
              <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                <BarChart3 className="text-accent" size={20} /> Transaction Radar
              </h2>
              <p className="text-[9px] font-black uppercase text-gray-400 mt-1 tracking-widest">Outlier and Magnitude Analysis</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
              {audit?.largestTransaction && (
                <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-gray-800 group hover:border-accent/40 transition-all">
                   <p className="text-[9px] font-black uppercase text-gray-400 mb-3 tracking-widest">Largest Outlier</p>
                   <div className="flex items-center justify-between">
                      <div>
                         <p className="text-lg font-black">{formatCurrency(audit.largestTransaction.amount, currency)}</p>
                         <p className="text-[10px] font-bold text-gray-500 truncate">{audit.largestTransaction.category} | {audit.largestTransaction.description}</p>
                      </div>
                      <div className="p-3 bg-red-500/10 text-red-500 rounded-xl group-hover:rotate-12 transition-transform"><ShieldAlert size={20} /></div>
                   </div>
                </div>
              )}
              <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-gray-800">
                 <p className="text-[9px] font-black uppercase text-gray-400 mb-3 tracking-widest">Efficiency Ratio</p>
                 <div className="flex items-center justify-between">
                    <div>
                       <p className="text-3xl font-black text-accent">{(audit?.incomeExpenseRatio || 0).toFixed(2)}x</p>
                       <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mt-1">Income to Expense Velocity</p>
                    </div>
                    <div className="p-3 bg-accent/10 text-accent rounded-xl"><Zap size={20} /></div>
                 </div>
              </div>
           </div>

           <div className="h-48 pt-4">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={transactions.slice(0, 15).reverse()}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#8882" />
                    <XAxis dataKey="date" hide />
                    <YAxis hide />
                    <RechartsTooltip 
                       contentStyle={{ borderRadius: '16px', border: 'none', fontWeight: 'bold' }}
                       cursor={{ fill: 'transparent' }}
                    />
                    <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                       {transactions.slice(0,15).map((entry, index) => (
                         <Cell key={index} fill={entry.type === 'income' ? '#10b981' : '#3b82f6'} opacity={0.6 + (index/15)*0.4} />
                       ))}
                    </Bar>
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </section>

        {/* Asset Nexus */}
        <section className="bg-white dark:bg-gray-900 p-8 rounded-[3rem] border border-gray-100 dark:border-gray-800 space-y-8">
           <div>
              <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                <Briefcase className="text-accent" size={20} /> Asset Nexus
              </h2>
              <p className="text-[9px] font-black uppercase text-gray-400 mt-1 tracking-widest">Portfolio Allocation & Growth</p>
           </div>
           
           <div className="flex items-center justify-between">
              <div className="w-1/2 h-48">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie data={assetData} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={5}>
                          {assetData.map((entry, index) => (
                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                          ))}
                       </Pie>
                    </PieChart>
                 </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-3">
                 {investments.map((inv, i) => (
                   <div key={inv.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                         <span className="text-[10px] font-black uppercase text-gray-500">{inv.name}</span>
                      </div>
                      <span className="text-xs font-black">{formatCurrency(inv.current, currency)}</span>
                   </div>
                 ))}
                 <div className="pt-3 mt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-accent">Total Invested</span>
                    <span className="text-sm font-black">{formatCurrency(investments.reduce((s,i) => s + i.invested, 0), currency)}</span>
                 </div>
              </div>
           </div>
        </section>
      </div>

      {/* Row 2: Liability Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8">
         {/* Loan Intelligence */}
         <section className="bg-white dark:bg-gray-900 p-8 rounded-[3rem] border border-gray-100 dark:border-gray-800 space-y-8">
            <div className="flex items-center justify-between">
               <div>
                  <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                    <Landmark className="text-accent" size={20} /> Liability Matrix
                  </h2>
                  <p className="text-[9px] font-black uppercase text-gray-400 mt-1 tracking-widest">Debt Service Coverage & Progress</p>
               </div>
               <div className="px-4 py-2 bg-red-500/10 text-red-500 text-[10px] font-black uppercase rounded-xl">
                  {loans.length} Active Loans
               </div>
            </div>

            <div className="space-y-8">
               {loans.map((loan, idx) => {
                 const m = loanSummary[idx];
                 return (
                   <div key={loan.id} className="space-y-3 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-gray-800">
                      <div className="flex items-center justify-between">
                         <div>
                            <h4 className="text-xs font-black uppercase">{loan.name}</h4>
                            <p className="text-[9px] font-bold text-gray-400">{loan.interestRate}% Int Rate | {m.remainingMonths} Months Left</p>
                         </div>
                         <div className="text-right">
                            <p className="text-[9px] font-black uppercase text-gray-400">Monthly EMI</p>
                            <p className="text-sm font-black text-accent">{formatCurrency(m.emi, currency)}</p>
                         </div>
                      </div>
                      <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                         <div className="h-full bg-accent rounded-full" style={{ width: `${m.progress}%` }} />
                      </div>
                      <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest">
                         <span className="text-gray-400">Paid: {formatCurrency(loan.paidAmount, currency)}</span>
                         <span className="text-accent">Goal: {formatCurrency(loan.principal, currency)}</span>
                      </div>
                   </div>
                 );
               })}

               {/* Credit Cards Grid */}
               <div className="grid grid-cols-2 gap-4">
                   {creditCards.map(card => (
                     <div key={card.id} className="p-5 bg-white dark:bg-gray-950 text-gray-900 dark:text-white rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm relative overflow-hidden group">
                        <div className="absolute -top-4 -right-4 w-16 h-16 bg-accent/5 dark:bg-white/5 rounded-full blur-xl group-hover:scale-150 transition-all" />
                        <div className="relative z-10">
                           <p className="text-[8px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-widest mb-1">{card.name}</p>
                           <p className="text-sm font-black">{formatCurrency(card.balance, currency)}</p>
                           <div className="mt-4 flex items-center justify-between text-[7px] font-black uppercase text-accent">
                              <span>Due: {card.dueDate}</span>
                              <span className="opacity-80">Limit: {formatCurrency(card.limit, currency)}</span>
                           </div>
                        </div>
                     </div>
                   ))}
               </div>
            </div>
         </section>

         {/* Predictive Intelligence & Freedom Clock */}
         <section className="bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white p-8 rounded-[3rem] border border-gray-100 dark:border-none shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-10 bg-[radial-gradient(circle_at_1px_1px,#000_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] bg-[size:32px_32px]" />
            
            <div className="relative z-10 space-y-12">
               <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black uppercase flex items-center gap-3">
                      <Zap className="text-accent" size={20} /> Freedom Logic
                    </h2>
                    <p className="text-[9px] font-black uppercase text-gray-400 mt-1 tracking-widest">Predictive Debt Extinction</p>
                  </div>
                  <Calendar className="text-accent/40" size={32} />
               </div>

               {/* The Freedom Clock */}
               <div className="text-center py-10 bg-gray-50 dark:bg-white/5 rounded-[3rem] border border-gray-100 dark:border-white/5 backdrop-blur-xl relative group overflow-hidden">
                  <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <p className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-[0.5em] mb-4">Projected Liberty Date</p>
                  <h3 className="text-5xl font-black tracking-tighter text-accent animate-pulse">{freedomData.date || 'Calculating...'}</h3>
                  <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mt-4 italic uppercase">Estimated {freedomData.months} Months to Absolute Freedom</p>
                  <div className="mt-6 flex items-center justify-center gap-6">
                     <div className="px-4 py-2 bg-white dark:bg-white/10 border border-gray-100 dark:border-none rounded-xl">
                        <p className="text-[8px] font-black text-gray-400 dark:text-gray-500 uppercase">Monthly Capacity</p>
                        <p className="text-xs font-black">{formatCurrency(audit?.surplus || 0, currency)}</p>
                     </div>
                     <div className="px-4 py-2 bg-white dark:bg-white/10 border border-gray-100 dark:border-none rounded-xl">
                        <p className="text-[8px] font-black text-gray-400 dark:text-gray-500 uppercase">SIP Acceleration</p>
                        <p className="text-xs font-black">{formatCurrency(investments.reduce((s,i) => s + i.sip, 0), currency)}</p>
                     </div>
                  </div>
               </div>

               {/* SIP Growth Simulator */}
               <div className="space-y-6">
                  <div className="flex items-center justify-between">
                     <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Wealth Projections (SIP)</h4>
                     <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                           <span className="text-[8px] font-black text-gray-500 uppercase">Rate: {returnRate}%</span>
                           <input type="range" min="8" max="25" value={returnRate} onChange={e => setReturnRate(Number(e.target.value))} className="w-16 h-1 bg-gray-700 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:rounded-full" />
                        </div>
                     </div>
                  </div>
                  <div className="h-40">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={growthData}>
                           <defs>
                              <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                 <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                              </linearGradient>
                           </defs>
                           <RechartsTooltip 
                              contentStyle={{ backgroundColor: '#111', border: 'none', borderRadius: '12px' }}
                              itemStyle={{ color: '#10b981', fontWeight: 'black', fontSize: '12px' }}
                           />
                           <Area type="monotone" dataKey="value" stroke="#10b981" fillOpacity={1} fill="url(#colorVal)" strokeWidth={3} />
                        </AreaChart>
                     </ResponsiveContainer>
                  </div>
                  <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed">
                     Strategic Intelligence Note: Projections are based on current market volatility and annual compounding. 
                     Loan freedom assumes all investment surplus is redirected to principal extinguishing.
                  </p>
               </div>
            </div>
         </section>
      </div>
    </div>
  );
};

export default StrategicIntelligence;
