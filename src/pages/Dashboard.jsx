import React, { useMemo } from 'react';
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
  AlertCircle
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
  Legend
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

const SummaryCard = ({ title, value, icon, trend, type }) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50 dark:bg-gray-900 dark:border-gray-800 transition-all hover:shadow-xl hover:-translate-y-1 group">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-4 rounded-2xl ${
        type === 'income' ? 'bg-income/10 text-income' : 
        type === 'expense' ? 'bg-expense/10 text-expense' : 
        'bg-accent/10 text-accent'
      } group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider ${
          trend >= 0 ? 'bg-income/10 text-income' : 'bg-expense/10 text-expense'
        }`}>
          {trend >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</p>
      <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">{value}</h3>
    </div>
  </div>
);

const TransactionRow = ({ t, currency }) => {
  const isIncome = t.type === 'income';
  
  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-2xl transition-all group">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl border ${
          isIncome ? 'bg-income/5 border-income/10 text-income' : 'bg-accent/5 border-accent/10 text-accent'
        } group-hover:rotate-12 transition-transform`}>
          {t.category === 'Salary' ? <Wallet size={18} /> : 
           t.category === 'Shopping' ? <ShoppingBag size={18} /> : 
           <CreditCard size={18} />}
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900 dark:text-white">{t.description}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase">{t.date?.split('T')[0]}</span>
            <span className="w-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full" />
            <span className="text-[10px] font-black text-accent uppercase tracking-tighter bg-accent/5 px-1.5 py-0.5 rounded-md">{t.category}</span>
          </div>
        </div>
      </div>
      <div className={`text-sm font-black ${isIncome ? 'text-income' : 'text-gray-900 dark:text-white'}`}>
        {isIncome ? '+' : '-'}{formatCurrency(t.amount, currency)}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { transactions, goals, userProfile, accounts, budgets, currency } = useStore();
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
  const goalMetrics = useMemo(() => getGoalMetrics(goals), [goals]);

  const COLORS = ['#10b981', '#059669', '#34d399', '#6ee7b7', '#a7f3d0'];
  const CHART_ACCENT = '#10b981';
  const PROJECTION_COLOR = '#9CA3AF';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="text-4xl font-black tracking-tight text-gray-900 dark:text-white">
            {isLoading ? <Skeleton className="h-10 w-64 rounded-xl" /> : `${greeting}, ${userProfile?.name || 'Executive'} 👋`}
          </div>
          <div className="text-gray-500 dark:text-gray-400 mt-1">
            {isLoading ? <Skeleton className="h-4 w-48 mt-2 rounded-lg" /> : `${userProfile?.title || 'Here\'s a comprehensive overview of your financial trajectory.'}`}
          </div>
        </div>
        
        {/* Health Gauge */}
        {isLoading ? (
          <div className="flex items-center gap-4 bg-white dark:bg-gray-900 p-4 rounded-3xl border border-gray-50 dark:border-gray-800 w-56 h-[88px] animate-pulse">
            <Skeleton className="w-14 h-14 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-2 w-12" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 bg-white dark:bg-gray-900 p-4 rounded-3xl border border-gray-50 dark:border-gray-800 shadow-sm transition-all hover:shadow-xl group">
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle cx="28" cy="28" r="24" fill="transparent" stroke="currentColor" strokeWidth="5" className="text-gray-100 dark:text-gray-800" />
                <circle 
                  cx="28" cy="28" r="24" fill="transparent" stroke="currentColor" strokeWidth="5" 
                  strokeDasharray={150.8} 
                  strokeDashoffset={150.8 - (150.8 * healthScore) / 100}
                  strokeLinecap="round"
                  className={`${health.color} transition-all duration-1000 ease-out`}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-gray-900 dark:text-white">{Math.round(healthScore)}%</span>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Health Index</p>
              <p className={`text-sm font-black ${health.color} drop-shadow-sm`}>{health.label}</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Metrics Row */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? [1,2,3,4].map(i => <Skeleton key={i} className="h-32 w-full rounded-3xl" />) : (
          <>
            <SummaryCard title="Total Liquidity" value={formatCurrency(accountMetrics.totalBalance, currency)} icon={<Wallet size={24} />} trend={0} />
            <SummaryCard title="Monthly Income" value={formatCurrency(metrics.income, currency)} icon={<TrendingUp size={24} />} type="income" trend={0} />
            <SummaryCard title="Monthly Expenses" value={formatCurrency(metrics.expenses, currency)} icon={<TrendingDown size={24} />} type="expense" trend={0} />
            <SummaryCard title="Savings Rate" value={`${metrics.savingsRate.toFixed(1)}%`} icon={<Percent size={24} />} type="accent" />
          </>
        )}
      </div>

      {/* Accounts Hub */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
        <div className="flex items-center justify-between mb-6">
           <h3 className="text-xl font-black text-gray-900 dark:text-white">Accounts Hub</h3>
            <button onClick={() => navigate('/transactions/new')} className="p-2 bg-accent/10 text-accent rounded-xl hover:bg-accent hover:text-white transition-all"><Plus size={18} /></button>
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
           {isLoading ? [1,2,3,4,5].map(i => <Skeleton key={i} className="h-32 w-full rounded-3xl" />) : accounts.map(acc => (
             <div key={acc.id} className="p-5 bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-50 dark:border-gray-800 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 group">
                <div className="flex items-center justify-between mb-4">
                   <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-accent"><AccountIcon type={acc.type} size={20} /></div>
                   <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 px-2 py-1 bg-gray-50 dark:bg-gray-800 rounded-md">{acc.type}</span>
                </div>
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest truncate">{acc.name}</h4>
                <p className="text-xl font-black text-gray-900 dark:text-white mt-1">{formatCurrency(acc.balance, currency)}</p>
             </div>
           ))}
        </div>
      </div>

      {/* Main Charts & Budgets Section */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Velocity Chart */}
        <div className="lg:col-span-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          {isLoading ? <Skeleton className="h-[400px] w-full rounded-3xl" /> : (
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 dark:bg-gray-900 dark:border-gray-800 h-full">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white">Capital Velocity</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">6-Month History + Forecast</p>
                </div>
                <Calendar size={20} className="text-gray-300" />
              </div>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={projectionData}>
                    <defs>
                      <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={CHART_ACCENT} stopOpacity={0.2}/>
                        <stop offset="95%" stopColor={CHART_ACCENT} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.3} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#9CA3AF' }} dy={10} />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px' }}
                      itemStyle={{ fontWeight: 900, fontSize: '14px' }}
                    />
                    <Area type="monotone" dataKey="balance" stroke={CHART_ACCENT} strokeWidth={4} fillOpacity={1} fill="url(#colorBalance)" />
                    <Area type="monotone" dataKey="projection" stroke={PROJECTION_COLOR} strokeWidth={4} fillOpacity={0} strokeDasharray="8 8" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* Budget Watch */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
           {isLoading ? <Skeleton className="h-[400px] w-full rounded-3xl" /> : (
             <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 dark:bg-gray-900 dark:border-gray-800 h-full">
               <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Budget Watch</h3>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8">Performance Tracking</p>
               <div className="space-y-6">
                 {budgetMetrics.slice(0, 5).map(b => (
                   <div key={b.category}>
                     <div className="flex justify-between items-end mb-2">
                       <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight">{b.category}</span>
                       <span className={`text-[10px] font-black ${b.isOverBudget ? 'text-expense' : 'text-accent'}`}>{Math.round(b.percentage)}%</span>
                     </div>
                     <div className="w-full h-2 bg-gray-50 dark:bg-gray-800 rounded-full overflow-hidden">
                       <div className={`h-full rounded-full transition-all duration-1000 ${b.isOverBudget ? 'bg-expense' : 'bg-accent'}`} style={{ width: `${b.percentage}%` }} />
                     </div>
                     <div className="flex justify-between mt-1 text-[8px] font-bold text-gray-400 uppercase tracking-widest">
                       <span>Spent: {formatCurrency(b.spent, currency)}</span>
                       <span>Limit: {formatCurrency(b.limit, currency)}</span>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
           )}
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Resource Allocation */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
          {isLoading ? <Skeleton className="h-[400px] w-full rounded-3xl" /> : (
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 dark:bg-gray-900 dark:border-gray-800">
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-8">Asset Distribution</h3>
              <div className="h-[300px] w-full flex items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value">
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" wrapperStyle={{ paddingLeft: '30px', fontWeight: 700, fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* Goals Roadmap */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-600">
           {isLoading ? <Skeleton className="h-[400px] w-full rounded-3xl" /> : (
             <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 dark:bg-gray-900 dark:border-gray-800">
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Roadmap Alpha</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8">Wealth Milestone Tracker</p>
                <div className="space-y-6">
                   {goalMetrics.map(goal => (
                     <div key={goal.id} className="p-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                           <div className="flex items-center gap-3">
                              <div className="p-2 bg-accent/10 text-accent rounded-lg"><TrendingUp size={16} /></div>
                              <span className="text-xs font-black text-gray-900 dark:text-white uppercase">{goal.title}</span>
                           </div>
                           <span className="text-xs font-black text-accent">{Math.round(goal.percentage)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                           <div className="h-full bg-accent transition-all duration-1000" style={{ width: `${goal.percentage}%` }} />
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           )}
        </div>
      </div>

      {/* Activity Feed */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
        {isLoading ? <Skeleton className="h-[300px] w-full rounded-3xl" /> : (
          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-50 dark:bg-gray-900 dark:border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-gray-900 dark:text-white">Recent Intelligence</h3>
              <button onClick={() => navigate('/transactions')} className="text-xs font-black uppercase tracking-widest text-accent hover:underline">View Ledger</button>
            </div>
            <div className="divide-y divide-gray-50 dark:divide-gray-800">
              {latestTransactions.map((t) => (
                <TransactionRow key={t.id} t={t} currency={currency} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

