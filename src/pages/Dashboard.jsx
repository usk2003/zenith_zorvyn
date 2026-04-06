import React, { useMemo, useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  Percent, 
  Calendar,
  CreditCard,
  ShoppingBag,
  Plus,
  Landmark,
  Zap,
  Bitcoin,
  CheckCircle2,
  AlertCircle,
  Activity,
  LayoutGrid,
  PieChart as PieChartIcon
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Treemap
} from 'recharts';
import useStore from '../store/useStore';
import { 
  getSummaryMetrics, 
  getMonthlyTrend, 
  getCategoryData, 
  getRecentTransactions,
  getProjectionData,
  getGoalMetrics,
  getAccountMetrics,
  getBudgetMetrics,
  formatCurrency 
} from '../utils/dashboardUtils';
import Skeleton from '../components/Skeleton';
import useInitialLoading from '../hooks/useInitialLoading';
import { useNavigate } from 'react-router-dom';

const AccountIcon = ({ type, ...props }) => {
  switch (type) {
    case 'Bank': return <Landmark {...props} />;
    case 'UPI': return <Zap {...props} />;
    case 'Demat': return <TrendingUp {...props} />;
    case 'Coins': return <Bitcoin {...props} />;
    default: return <Wallet {...props} />;
  }
};

const LiquidityNode = ({ title, value, icon, trend, type, isDarkMode }) => (
  <div className={`p-6 rounded-[2rem] border transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.1)] hover:-translate-y-1 group relative overflow-hidden ${isDarkMode ? 'bg-white/[0.02] border-emerald-500/20 hover:border-emerald-500/40 hover:bg-emerald-500/[0.03]' : 'bg-white border-emerald-500/10 shadow-sm hover:border-emerald-200 hover:bg-emerald-50/10'}`}>
    <div className="flex items-center justify-between relative z-10">
      <div className="space-y-1">
         <div className="flex items-center gap-3">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{title}</p>
            {trend !== undefined && trend !== 0 && (
              <div className={`flex items-center gap-1 text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                trend >= 0 ? 'bg-income/10 text-income' : 'bg-expense/10 text-expense'
              }`}>
                {trend >= 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                {Math.abs(trend)}%
              </div>
            )}
         </div>
         <h3 className="text-2xl font-black text-gray-900 dark:text-white italic tracking-tighter leading-none">{value}</h3>
      </div>
      
      <div className={`p-3 rounded-2xl ${
        type === 'income' ? 'bg-income/10 text-income' : 
        type === 'expense' ? 'bg-expense/10 text-expense' : 
        'bg-accent/10 text-accent'
      } group-hover:scale-110 transition-transform shadow-sm border border-emerald-500/10 dark:border-emerald-500/20`}>
        {React.cloneElement(icon, { size: 24 })}
      </div>
    </div>
    <div className="absolute -bottom-4 -left-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity rotate-12">
       {React.cloneElement(icon, { size: 90 })}
    </div>
  </div>
);

const TransactionRow = ({ t, currency }) => {
  const isIncome = t.type === 'income';
  
  return (
    <div className="flex items-center justify-between p-4 hover:bg-emerald-50/50 dark:hover:bg-emerald-500/[0.02] rounded-2xl transition-all group border-b border-transparent hover:border-emerald-100 dark:hover:border-emerald-500/10">
      <div className="flex items-center gap-4">
        <div className={`p-2.5 rounded-xl border ${
          isIncome ? 'bg-income/5 border-income/10 text-income' : 'bg-accent/5 border-accent/10 text-accent'
        } group-hover:rotate-12 transition-transform`}>
          {t.category === 'Salary' ? <Wallet size={16} /> : 
           t.category === 'Shopping' ? <ShoppingBag size={16} /> : 
           <CreditCard size={16} />}
        </div>
        <div>
          <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight italic">{t.description}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{t.date?.split('T')[0]}</span>
            <span className="w-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full" />
            <span className="text-[9px] font-black text-accent uppercase tracking-tighter bg-accent/5 px-1.5 py-0.5 rounded-md">{t.category}</span>
          </div>
        </div>
      </div>
      <div className={`text-sm font-black italic ${isIncome ? 'text-income' : 'text-gray-900 dark:text-white'}`}>
        {isIncome ? '+' : '-'}{formatCurrency(t.amount, currency)}
      </div>
    </div>
  );
};

const CustomTreemapContent = (props) => {
  const { x, y, width, height, index, name, value, isDarkMode } = props;
  const colors = ['#10b981', '#059669', '#34d399', '#6ee7b7', '#a7f3d0'];

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: colors[index % 5],
          stroke: isDarkMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
          strokeWidth: 1,
          rx: 12,
          ry: 12
        }}
        className="hover:opacity-90 transition-all cursor-pointer shadow-lg"
      />
      {width > 60 && height > 40 && (
        <>
          <text
            x={x + 12}
            y={y + 24}
            fill="#fff"
            fontSize={12}
            fontWeight={900}
            className="uppercase italic tracking-tighter"
            style={{ opacity: 1 }}
          >
            {name}
          </text>
          <text
            x={x + 12}
            y={y + 42}
            fill="#fff"
            fontSize={11}
            fontWeight={700}
            style={{ opacity: 0.8 }}
          >
            ₹{Math.round(value).toLocaleString('en-IN')}
          </text>
        </>
      )}
    </g>
  );
};

const CustomTreemapTooltip = ({ active, payload, transactions, currency, isDarkMode }) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0].payload;
  
  // High-density transaction filtering protocol
  const categoryTransactions = transactions
    .filter(t => t.category === name && t.type === 'expense')
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  return (
    <div className={`p-4 rounded-2xl shadow-2xl border min-w-[220px] backdrop-blur-xl animate-in fade-in zoom-in duration-200 ${
      isDarkMode ? 'bg-[#050505]/95 border-emerald-500/30' : 'bg-white/95 border-emerald-500/20'
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div className="space-y-0.5">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{name}</p>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
            <p className="text-lg font-black text-emerald-500 italic leading-none">{formatCurrency(value, currency)}</p>
          </div>
        </div>
      </div>
      
      {categoryTransactions.length > 0 && (
        <div className="space-y-2 pt-3 border-t border-emerald-500/10 dark:border-emerald-500/20">
           <p className="text-[8px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Tactical Inflow/Outflow</p>
           {categoryTransactions.map(t => (
             <div key={t.id} className="flex justify-between items-center group/tx">
                <span className="text-[9px] font-bold text-gray-400 truncate max-w-[120px] group-hover/tx:text-white transition-colors capitalize">{t.description || t.category}</span>
                <span className="text-[10px] font-black text-white italic">-{formatCurrency(t.amount, currency)}</span>
             </div>
           ))}
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const { transactions, goals, userProfile, accounts, budgets, currency, isDarkMode } = useStore();
  const isLoading = useInitialLoading(1200);
  const navigate = useNavigate();

  const metrics = useMemo(() => getSummaryMetrics(transactions), [transactions]);
  const accountMetrics = useMemo(() => getAccountMetrics(accounts), [accounts]);
  const budgetMetrics = useMemo(() => getBudgetMetrics(budgets, transactions), [budgets, transactions]);
  const trendData = useMemo(() => getMonthlyTrend(transactions), [transactions]);
  const categoryData = useMemo(() => getCategoryData(transactions), [transactions]);
  const latestTransactions = useMemo(() => getRecentTransactions(transactions), [transactions]);

  const healthScore = useMemo(() => {
    if (metrics.income === 0) return 0;
    const ratio = (metrics.income / (metrics.expenses || 1));
    return Math.min(100, (ratio / 2) * 100); 
  }, [metrics]);

  const health = useMemo(() => {
    if (healthScore < 40) return { label: 'Needs Attention', color: 'text-red-500' };
    if (healthScore < 70) return { label: 'Good Stability', color: 'text-yellow-500' };
    return { label: 'Excellent Health', color: 'text-income' };
  }, [healthScore]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const projectionData = useMemo(() => getProjectionData(trendData), [trendData]);
  const [goalSort, setGoalSort] = useState('progress'); // ['progress', 'target', 'time']
  const [distView, setDistView] = useState('treemap'); // ['treemap', 'pie']

  const goalMetrics = useMemo(() => {
    const metrics = getGoalMetrics(goals);
    return [...metrics].sort((a, b) => {
      if (goalSort === 'progress') return b.percentage - a.percentage;
      if (goalSort === 'target') return b.target - a.target;
      if (goalSort === 'time') {
        const timeA = (a.target - a.current) / (a.sipContribution || 1000);
        const timeB = (b.target - b.current) / (b.sipContribution || 1000);
        return timeA - timeB;
      }
      return 0;
    });
  }, [goals, goalSort]);

  const COLORS = ['#10b981', '#059669', '#34d399', '#6ee7b7', '#a7f3d0'];
  const CHART_ACCENT = '#10b981';
  const PROJECTION_COLOR = '#9CA3AF';

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* [Executive Status Node] */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-2">
        <div className="flex-1 space-y-1">
           <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
              <h1 className="text-2xl md:text-4xl font-black tracking-tight text-gray-900 dark:text-white">
                {isLoading ? <Skeleton className="h-10 w-64 rounded-xl" /> : `${greeting}, ${userProfile?.name || 'Executive'}`}
              </h1>
           </div>
           <div className="text-gray-400 dark:text-gray-500 font-black uppercase text-[10px] tracking-[0.3em] pl-4 opacity-80 italic">
             {isLoading ? <Skeleton className="h-4 w-48 mt-2 rounded-lg" /> : new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) + ' | ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
           </div>
        </div>
        
        {/* Unified Health Core */}
        <div className={`px-5 py-3 rounded-2xl border flex items-center gap-6 group transition-all duration-700 ${isDarkMode ? 'bg-white/[0.02] border-emerald-500/20 hover:border-emerald-500/40 shadow-emerald-500/5' : 'bg-white border-emerald-500/10 shadow-md'}`}>
           <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle cx="24" cy="24" r="20" fill="transparent" stroke="currentColor" strokeWidth="5" className="text-gray-100 dark:text-gray-800" />
                <circle 
                  cx="24" cy="24" r="20" fill="transparent" stroke="currentColor" strokeWidth="5" 
                  strokeDasharray={125.6} 
                  strokeDashoffset={125.6 - (125.6 * healthScore) / 100}
                  strokeLinecap="round"
                  className={`${health.color} transition-all duration-1000 ease-out`}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-gray-900 dark:text-white">{Math.round(healthScore)}%</span>
           </div>
           <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-0.5">Efficiency</p>
              <div className="flex items-center gap-2">
                 <span className={`text-xs font-black uppercase italic ${health.color}`}>{health.label}</span>
              </div>
           </div>
        </div>
      </div>

      {/* [Liquidity Ribbon] */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? [1,2,3,4].map(i => <Skeleton key={i} className="h-28 w-full rounded-[1.5rem]" />) : (
          <>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-75">
              <LiquidityNode title="Total Net Worth" value={formatCurrency(accountMetrics.totalBalance, currency)} icon={<Wallet size={20} />} isDarkMode={isDarkMode} />
            </div>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
              <LiquidityNode title="Inflow Node" value={formatCurrency(metrics.income, currency)} icon={<TrendingUp size={20} />} type="income" isDarkMode={isDarkMode} trend={0} />
            </div>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-225">
              <LiquidityNode title="Outflow Node" value={formatCurrency(metrics.expenses, currency)} icon={<TrendingDown size={20} />} type="expense" isDarkMode={isDarkMode} trend={0} />
            </div>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <LiquidityNode title="Capital Velocity" value={`${metrics.savingsRate.toFixed(1)}%`} icon={<Activity size={20} />} type="accent" isDarkMode={isDarkMode} />
            </div>
          </>
        )}
      </div>

      {/* [Asymmetrical Intelligence Grid] */}
      <div className="grid gap-6 grid-cols-1 xl:grid-cols-3">
        {/* Primary Chart Layer */}
        <div className="xl:col-span-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          {isLoading ? <Skeleton className="h-[350px] w-full rounded-[2rem]" /> : (
            <div className={`p-6 rounded-[2rem] border h-full transition-all duration-700 hover:shadow-[0_30px_60px_-15px_rgba(16,185,129,0.08)] ${isDarkMode ? 'bg-white/[0.02] border-emerald-500/20 hover:border-emerald-500/30 hover:bg-emerald-500/[0.01]' : 'bg-white border-emerald-500/10 shadow-sm hover:border-emerald-100'}`}>
              <div className="flex items-center justify-between mb-6">
                <div className="space-y-0.5">
                  <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">Strategic Velocity</h3>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.3em]">6-Month Intelligence</p>
                </div>
                <div className="p-2.5 bg-gray-50 dark:bg-white/5 rounded-xl"><Calendar size={16} className="text-emerald-500" /></div>
              </div>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={projectionData}>
                    <defs>
                      <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={CHART_ACCENT} stopOpacity={0.2}/>
                        <stop offset="95%" stopColor={CHART_ACCENT} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.1} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: '#9CA3AF' }} dy={10} />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 8, fontWeight: 900, fill: '#6B7280' }}
                      tickFormatter={(value) => value.toLocaleString('en-IN', { style: 'currency', currency: currency, maximumFractionDigits: 0 })}
                    />
                    <Tooltip 
                      formatter={(value) => value.toLocaleString('en-IN', { style: 'currency', currency: currency, minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      contentStyle={{ backgroundColor: isDarkMode ? '#050505' : '#fff', borderRadius: '16px', border: '1px solid rgba(16,185,129,0.1)', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.3)', padding: '12px' }}
                      itemStyle={{ fontWeight: 900, fontSize: '12px', fontStyle: 'italic', textTransform: 'uppercase', color: '#10b981' }}
                      labelStyle={{ fontWeight: 900, fontSize: '10px', textTransform: 'uppercase', color: isDarkMode ? '#9CA3AF' : '#4B5563', marginBottom: '4px' }}
                    />
                    <Area type="monotone" dataKey="balance" stroke={CHART_ACCENT} strokeWidth={4} fillOpacity={1} fill="url(#colorBalance)" />
                    <Area type="monotone" dataKey="projection" stroke={PROJECTION_COLOR} strokeWidth={3} fillOpacity={0} strokeDasharray="8 8" opacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* Tactical Watch Layer */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-[400ms]">
           {isLoading ? <Skeleton className="h-[350px] w-full rounded-[2rem]" /> : (
             <div className={`p-6 rounded-[2rem] border h-full transition-all duration-700 hover:shadow-[0_30px_60px_-15px_rgba(16,185,129,0.08)] ${isDarkMode ? 'bg-white/[0.02] border-emerald-500/20 hover:border-emerald-500/30 hover:bg-emerald-500/[0.01]' : 'bg-white border-emerald-500/10 shadow-sm hover:border-emerald-100'}`}>
               <div className="space-y-0.5 mb-6">
                 <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">Budget Watch</h3>
                 <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.3em]">Consumption</p>
               </div>
               <div className="space-y-4">
                 {budgetMetrics.slice(0, 4).map(b => (
                   <div key={b.category} className="space-y-2 group">
                     <div className="flex justify-between items-end">
                       <span className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-wider italic">{b.category}</span>
                       <span className={`text-[9px] font-black ${b.isOverBudget ? 'text-expense' : 'text-accent'}`}>{Math.round(b.percentage)}%</span>
                     </div>
                     <div className="w-full h-1.5 bg-gray-50 dark:bg-gray-800 rounded-full overflow-hidden">
                       <div className={`h-full rounded-full transition-all duration-1000 ${b.isOverBudget ? 'bg-expense' : 'bg-accent'}`} style={{ width: `${b.percentage}%` }} />
                     </div>
                   </div>
                 ))}
               </div>
             </div>
           )}
        </div>
      </div>

      {/* [Asset Distribution Hierarchy] */}
      <div className="grid gap-8 grid-cols-1 xl:grid-cols-2">
        {/* Portfolio Distribution */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
          {isLoading ? <Skeleton className="h-[400px] w-full rounded-[3rem]" /> : (
            <div className={`p-8 rounded-[3rem] border transition-all duration-700 h-full flex flex-col hover:shadow-[0_30px_60px_-15px_rgba(16,185,129,0.08)] ${isDarkMode ? 'bg-white/[0.02] border-emerald-500/20 hover:border-emerald-500/30 hover:bg-emerald-500/[0.01]' : 'bg-white border-emerald-500/10 shadow-sm hover:border-emerald-100'}`}>
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-emerald-500/10 dark:border-emerald-500/20">
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">Asset Distribution</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em]">Diversification Intelligence</p>
                </div>
                <div className="flex items-center gap-3">
                   <div className="flex bg-gray-50 dark:bg-white/5 p-1 rounded-xl">
                      {[
                        { id: 'treemap', icon: <LayoutGrid size={14} />, label: 'Spatial' },
                        { id: 'pie', icon: <PieChartIcon size={14} />, label: 'Proportional' }
                      ].map(v => (
                        <button
                          key={v.id}
                          onClick={() => setDistView(v.id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                            distView === v.id ? 'bg-white dark:bg-gray-900 text-accent shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                          }`}
                        >
                          {v.icon}
                          <span className="hidden md:block">{v.label}</span>
                        </button>
                      ))}
                   </div>
                </div>
              </div>
              <div className="h-[280px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  {distView === 'pie' ? (
                    <PieChart>
                      <Pie data={categoryData} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={8} dataKey="value" stroke="none">
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#059669'][index % 5]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => value.toLocaleString('en-IN', { style: 'currency', currency: currency, minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        contentStyle={{ backgroundColor: isDarkMode ? '#050505' : '#fff', borderRadius: '24px', border: '1px solid rgba(16,185,129,0.1)', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.3)', padding: '16px' }} 
                        itemStyle={{ fontWeight: 900, fontSize: '12px', fontStyle: 'italic', textTransform: 'uppercase', color: '#10b981' }}
                        labelStyle={{ fontWeight: 900, fontSize: '10px', textTransform: 'uppercase', color: isDarkMode ? '#9CA3AF' : '#4B5563', marginBottom: '4px' }}
                      />
                      <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" wrapperStyle={{ paddingLeft: '40px', fontWeight: 900, fontSize: '11px', textTransform: 'uppercase', fontStyle: 'italic', opacity: 0.8 }} />
                    </PieChart>
                  ) : (
                    <Treemap
                      data={categoryData}
                      dataKey="value"
                      ratio={4 / 3}
                      stroke="none"
                      fill="#10b981"
                      content={<CustomTreemapContent isDarkMode={isDarkMode} />}
                    >
                       <Tooltip 
                         content={<CustomTreemapTooltip transactions={transactions} currency={currency} isDarkMode={isDarkMode} />}
                       />
                    </Treemap>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* Roadmap Node */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-[500ms]">
           {isLoading ? <Skeleton className="h-[400px] w-full rounded-[3rem]" /> : (
             <div className={`p-8 rounded-[3rem] border transition-all duration-700 hover:shadow-[0_30px_60px_-15px_rgba(16,185,129,0.08)] ${isDarkMode ? 'bg-white/[0.02] border-emerald-500/20 hover:border-emerald-500/30 hover:bg-emerald-500/[0.01]' : 'bg-white border-emerald-500/10 shadow-sm hover:border-emerald-100'}`}>
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-emerald-500/10 dark:border-emerald-500/20">
                   <div className="space-y-1">
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">Roadmap Alpha</h3>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em]">Strategic Milestone Tracker</p>
                   </div>
                   <div className="flex items-center gap-3">
                      <button 
                        onClick={() => {
                          const next = goalSort === 'progress' ? 'target' : goalSort === 'target' ? 'time' : 'progress';
                          setGoalSort(next);
                        }}
                        className="p-3 bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-accent rounded-2xl transition-all flex items-center gap-2 group"
                        title={`Sort by: ${goalSort}`}
                      >
                        <LayoutGrid size={18} className="group-hover:rotate-90 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">Sort: {goalSort}</span>
                      </button>
                      <button onClick={() => navigate('/profile')} className="w-10 h-10 bg-emerald-500 text-black rounded-xl hover:scale-110 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center font-bold" title="Add New Target">
                         <Plus size={20} />
                      </button>
                   </div>
                </div>
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                   {goalMetrics.map(goal => {
                     const monthly = goal.sipContribution || 1000;
                     const monthsToVictory = Math.ceil((goal.target - goal.current) / monthly);
                     
                     return (
                       <div key={goal.id} className="p-5 bg-gray-50/50 dark:bg-white/5 rounded-2xl group hover:shadow-lg transition-all border border-transparent hover:border-emerald-500/20">
                          <div className="flex justify-between items-start mb-3">
                             <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl group-hover:scale-110 transition-transform"><TrendingUp size={18} /></div>
                                <div>
                                   <span className="text-xs font-black text-gray-900 dark:text-white uppercase italic tracking-tighter block">{goal.title}</span>
                                   <div className="flex items-center gap-2 mt-0.5">
                                      <Calendar size={10} className="text-gray-400" />
                                      <span className="text-[8px] font-black text-accent uppercase tracking-widest italic">
                                         {monthsToVictory > 0 ? `${monthsToVictory} months until victory` : 'Victory Achieved'}
                                      </span>
                                   </div>
                                </div>
                             </div>
                             <div className="text-right">
                                <span className="text-base font-black text-accent italic leading-none">{Math.round(goal.percentage)}%</span>
                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">Completed</p>
                             </div>
                          </div>
                          <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                             <div className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all duration-1000" style={{ width: `${goal.percentage}%` }} />
                          </div>
                       </div>
                     );
                   })}
                </div>
             </div>
           )}
        </div>
      </div>

      {/* [Tactical Ledger & Accounts Hub] */}
      <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
         {/* Account Strip Card */}
         <div className={`lg:col-span-1 p-8 rounded-[3rem] border transition-all duration-700 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.1)] ${isDarkMode ? 'bg-white/[0.02] border-emerald-500/20 hover:border-emerald-500/30 hover:bg-emerald-500/[0.02]' : 'bg-white border-gray-50 shadow-sm hover:border-emerald-200'}`}>
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-emerald-500/10 dark:border-emerald-500/20">
               <div className="space-y-1">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">Asset Hub</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em]">Unified Capital Repository</p>
               </div>
               <button onClick={() => navigate('/transactions/new')} className="w-10 h-10 bg-emerald-500 text-black rounded-xl hover:scale-110 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center font-bold" title="Add Asset Node">
                  <Plus size={20} />
               </button>
            </div>
            
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
               {accounts.map(acc => (
                 <div key={acc.id} className={`p-4 rounded-2xl border transition-all hover:translate-x-1.5 group min-h-[82px] flex flex-col justify-center ${isDarkMode ? 'bg-white/[0.02] border-emerald-500/20 hover:border-emerald-500/30 hover:bg-emerald-500/[0.02]' : 'bg-white border-gray-100 shadow-sm hover:bg-emerald-50/20 hover:border-emerald-100'}`}>
                    <div className="space-y-1.5">
                       {/* Row 1: Name and Tag */}
                       <div className="flex justify-between items-center">
                          <h4 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest truncate max-w-[120px]">{acc.name}</h4>
                          <span className="text-[7px] font-black uppercase tracking-[0.2em] text-gray-400 px-1.5 py-0.5 bg-gray-50 dark:bg-gray-800 rounded-md">{acc.type}</span>
                       </div>
                       
                       {/* Row 2: Value and Icon */}
                       <div className="flex justify-between items-center">
                          <p className="text-lg font-black text-gray-900 dark:text-white italic tracking-tighter leading-none">{formatCurrency(acc.balance, currency)}</p>
                          <div className="p-1.5 bg-gray-50 dark:bg-white/5 rounded-lg text-accent group-hover:rotate-12 transition-transform shadow-sm flex items-center justify-center"><AccountIcon type={acc.type} size={14} /></div>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Transaction Ledger Card */}
         <div className="lg:col-span-2 animate-in fade-in slide-in-from-right-4 duration-700 delay-800">
            <div className={`p-8 rounded-[3rem] border transition-all duration-700 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.1)] ${isDarkMode ? 'bg-white/[0.02] border-emerald-500/20 hover:border-emerald-500/30 hover:bg-emerald-500/[0.02]' : 'bg-white border-gray-50 shadow-sm hover:border-emerald-200'}`}>
               <div className="flex items-center justify-between mb-8 pb-4 border-b border-emerald-500/10 dark:border-emerald-500/20">
                 <div className="space-y-1">
                   <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">Tactical Ledger</h3>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em]">Real-time Transaction Stream</p>
                 </div>
                 <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/transactions')} className="text-[10px] font-black uppercase tracking-[0.3em] text-accent hover:underline decoration-2 underline-offset-8 transition-all hidden md:block">Audit Ledger →</button>
                    <button onClick={() => navigate('/transactions/new')} className="w-10 h-10 bg-emerald-500 text-black rounded-xl hover:scale-110 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center font-bold" title="New Transaction">
                       <Plus size={20} />
                    </button>
                 </div>
               </div>
               <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                 {latestTransactions.slice(0, 5).map((t) => (
                   <div key={t.id} className="min-h-[82px] flex flex-col justify-center">
                      <TransactionRow t={t} currency={currency} />
                   </div>
                 ))}
               </div>
            </div>
         </div>
      </div>

    </div>
  );
};

export default Dashboard;
