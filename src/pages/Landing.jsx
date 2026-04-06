import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, ShieldCheck, PieChart, Zap, 
  Lock, Globe, Smartphone, Sparkles,
  TrendingUp, TrendingDown, Wallet, Landmark,
  Bitcoin
} from 'lucide-react';
import { 
  AreaChart, Area, ResponsiveContainer 
} from 'recharts';
import useStore from '../store/useStore';
import ThemeToggle from '../components/ThemeToggle';
import Footer from '../components/Footer';

const sparklineData = [
  { value: 400 }, { value: 600 }, { value: 500 }, 
  { value: 900 }, { value: 700 }, { value: 1200 }, 
  { value: 1000 }, { value: 1500 }
];

const SamplePortfolioNode = ({ isDarkMode }) => (
  <div className={`p-8 rounded-[2.5rem] border transition-all duration-500 animate-in fade-in zoom-in-95 delay-500 shadow-2xl relative overflow-hidden group ${isDarkMode ? 'bg-white/[0.02] border-white/5 shadow-emerald-500/5' : 'bg-white border-gray-100 shadow-xl'}`}>
    <div className="absolute top-0 right-0 p-6 opacity-10 -rotate-12 transition-transform group-hover:rotate-0 duration-1000">
       <Sparkles size={80} fill="currentColor" />
    </div>

    <div className="relative z-10 space-y-6">
       <div className="flex items-center justify-between">
          <div>
             <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-1">Executive Net Worth</p>
             <h3 className="text-3xl font-black italic tracking-tighter text-gray-900 dark:text-white">₹ 14,28,000</h3>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg uppercase">
             <TrendingUp size={12} /> +12.4%
          </div>
       </div>

       <div className="h-20 w-full opacity-60">
          <ResponsiveContainer width="100%" height="100%">
             <AreaChart data={sparklineData}>
                <defs>
                   <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                   </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
             </AreaChart>
          </ResponsiveContainer>
       </div>

       <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg"><TrendingUp size={14} /></div>
             <div>
                <p className="text-[8px] font-black uppercase text-gray-400 tracking-widest leading-none">Stocks</p>
                <p className="text-xs font-black text-gray-900 dark:text-white">₹ 8.4L</p>
             </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="p-2 bg-purple-500/10 text-purple-500 rounded-lg"><Landmark size={14} /></div>
             <div>
                <p className="text-[8px] font-black uppercase text-gray-400 tracking-widest leading-none">Savings</p>
                <p className="text-xs font-black text-gray-900 dark:text-white">₹ 2.8L</p>
             </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg"><Zap size={14} /></div>
             <div>
                <p className="text-[8px] font-black uppercase text-gray-400 tracking-widest leading-none">SIP</p>
                <p className="text-xs font-black text-gray-900 dark:text-white">₹ 15k/mo</p>
             </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="p-2 bg-orange-500/10 text-orange-500 rounded-lg"><Bitcoin size={14} /></div>
             <div>
                <p className="text-[8px] font-black uppercase text-gray-400 tracking-widest leading-none">Crypto</p>
                <p className="text-xs font-black text-gray-900 dark:text-white">₹ 1.2L</p>
             </div>
          </div>
       </div>
    </div>
  </div>
);

const Landing = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useStore();
  
  const features = [
    {
      title: "Bank-Grade Security",
      desc: "Your financial data is encrypted and stored locally. We never see your balances or transactions.",
      accent: "border-emerald-500/20 shadow-emerald-500/5",
    },
    {
      title: "Smart Analytics",
      desc: "Understand your spending patterns with intuitive charts and AI-driven growth projections.",
      accent: "border-blue-500/20 shadow-blue-500/5",
    },
    {
      title: "Privacy First",
      desc: "A completely private financial experience. No cloud tracking, no hidden data harvesting.",
      accent: "border-purple-500/20 shadow-purple-500/5",
    }
  ];

  return (
    <div className={`min-h-screen selection:bg-emerald-500/30 selection:text-emerald-900 overflow-x-hidden ${isDarkMode ? 'bg-[#050505] text-white' : 'bg-gray-50 text-gray-900'}`}>
      
      {/* [Structural Header] */}
      <header className="fixed top-0 left-0 w-full z-[100] px-6 lg:px-12 py-6 flex items-center justify-between backdrop-blur-md border-b border-gray-100/50 dark:border-white/5 transition-all duration-500">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
             <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:rotate-6 transition-transform duration-500 overflow-hidden">
                <img src="/logo.png" alt="Zenith Logo" className="w-full h-full object-contain" />
             </div>
             <span className="text-lg font-black tracking-tighter text-gray-900 dark:text-white uppercase italic">ZENITH</span>
          </div>
          <div className="flex items-center gap-6">
             <button onClick={() => navigate('/login')} className="hidden sm:block text-xs font-black uppercase tracking-widest text-gray-400 hover:text-emerald-500 transition-colors">Login</button>
             <ThemeToggle className="scale-75" />
          </div>
      </header>

      <main className="relative z-10 pt-24 lg:pt-32 pb-12 px-6 max-w-7xl mx-auto">
        
        {/* [Visual Accents] */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-3xl aspect-square pointer-events-none opacity-20">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[60%] bg-emerald-500/20 rounded-full blur-[120px] animate-pulse" />
        </div>

        {/* [Dual-Column Hero Node] */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-16">
           <section className="space-y-10 animate-in fade-in slide-in-from-left-8 duration-1000">
              <div className="space-y-8">
                 <div className="relative inline-block group">
                    <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-[0.9] italic uppercase">
                      ZENITH <br/>
                      <span className="text-emerald-500 relative">
                         DASHBOARD.
                         <div className="absolute -bottom-1.5 left-0 w-1/2 h-1.5 bg-emerald-500/20 rounded-full group-hover:w-full transition-all duration-1000" />
                      </span>
                    </h1>
                 </div>
                 <p className="text-lg md:text-xl font-black uppercase tracking-tighter text-gray-400 max-w-md leading-tight mt-6">
                   Financial management of all sources at ease.
                 </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                 <button 
                   onClick={() => navigate('/onboarding')}
                   className="group w-full sm:w-auto px-10 py-5 bg-emerald-500 text-black rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 hover:shadow-[0_0_25px_rgba(16,185,129,0.3)] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/20 z-10"
                 >
                   Establish Profile <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                 </button>
                 
                 <button 
                   onClick={() => {
                      useStore.getState().loadMockData();
                      navigate('/dashboard');
                   }}
                   className={`group w-full sm:w-auto px-10 py-5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border hover:scale-105 hover:shadow-[0_0_25px_rgba(16,185,129,0.2)] active:scale-95 flex items-center justify-center gap-3 ${isDarkMode ? 'bg-white/5 border-white/10 text-white hover:border-emerald-500/30' : 'bg-white border-gray-100 text-gray-900 hover:border-emerald-500/30'}`}
                 >
                   Experience the app <Zap size={16} className="text-emerald-500 group-hover:rotate-12 transition-transform" />
                 </button>
              </div>
           </section>

           {/* [Sample Portfolio Column] */}
           <SamplePortfolioNode isDarkMode={isDarkMode} />
        </div>

        {/* [Tactical Protocol Node] - Absolute Uniformity Redesign */}
        <section className="py-12 lg:py-24 text-center relative overflow-hidden group transition-all duration-1000 animate-in fade-in slide-in-from-bottom-4 delay-300">
           <div className="relative z-10 space-y-10 max-w-3xl mx-auto">
              <div className="space-y-4">
                 <h2 className="text-4xl md:text-7xl font-black italic tracking-tighter uppercase leading-none italic decoration-emerald-500/20">Take Control.</h2>
                 <p className="text-lg text-gray-500 font-medium max-w-xl mx-auto leading-relaxed">
                   Join thousands of users who have engineered their debt-free future using the Zenith protocol.
                 </p>
              </div>

              <div className="flex flex-col items-center justify-center gap-8">
                 <button 
                    onClick={() => {
                       useStore.getState().loadMockData();
                       navigate('/dashboard');
                    }}
                    className="px-10 py-5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] hover:bg-emerald-500 hover:text-black hover:scale-105 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:border-emerald-500/50 active:scale-95 transition-all group/demo flex items-center gap-3 z-20"
                 >
                    Quick Demo Access <ArrowRight size={14} className="group-hover/demo:translate-x-1 transition-transform" />
                 </button>
                 <div className="flex items-center gap-6 opacity-40">
                    <div className="flex items-center gap-2 text-[8px] font-black uppercase"><Smartphone size={12} /> Local-First</div>
                    <div className="flex items-center gap-2 text-[8px] font-black uppercase"><Globe size={12} /> Open Nodes</div>
                    <div className="flex items-center gap-2 text-[8px] font-black uppercase"><Sparkles size={12} /> Safe</div>
                 </div>
              </div>
           </div>
        </section>

         <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((item, i) => (
              <div 
                key={i} 
                className={`p-8 rounded-3xl border transition-all duration-500 cursor-default group hover:-translate-y-2 hover:shadow-2xl hover:border-emerald-500/40 animate-in fade-in slide-in-from-bottom-4 ${isDarkMode ? 'bg-white/[0.03] border-white/5 hover:bg-emerald-500/[0.04]' : 'bg-white border-gray-200/50 hover:bg-emerald-50/[0.3]'}`}
                style={{ animationDelay: `${700 + (i * 150)}ms` }}
              >
                 <div className="absolute top-4 right-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                    <Sparkles size={14} />
                 </div>
                 <h3 className="text-lg font-black mb-3 tracking-tighter uppercase italic transition-colors group-hover:text-emerald-500">{item.title}</h3>
                 <p className="text-xs text-gray-500 font-medium leading-relaxed group-hover:text-gray-400 transition-colors">{item.desc}</p>
                 <div className="mt-6 w-full h-px bg-gray-100 dark:bg-white/5 overflow-hidden">
                    <div className="w-0 group-hover:w-full h-full bg-emerald-500 transition-all duration-1000" />
                 </div>
              </div>
            ))}
         </section>

      </main>

      <Footer />
    </div>
  );
};

export default Landing;
