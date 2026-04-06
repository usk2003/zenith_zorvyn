import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, ShieldCheck, PieChart, Zap, 
  Lock, Globe, Smartphone, Sparkles
} from 'lucide-react';
import useStore from '../store/useStore';
import ThemeToggle from '../components/ThemeToggle';
import Footer from '../components/Footer';

const Landing = () => {
  const navigate = useNavigate();
  const { isDarkMode, currency } = useStore();
  
  const symbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£';

  const features = [
    {
      title: "Bank-Grade Security",
      desc: "Your financial data is encrypted and stored locally. We never see your balances or transactions.",
      icon: <ShieldCheck className="text-emerald-500" size={24} />,
    },
    {
      title: "Smart Analytics",
      desc: "Understand your spending patterns with intuitive charts and AI-driven growth projections.",
      icon: <PieChart className="text-blue-500" size={24} />,
    },
    {
      title: "Privacy First",
      desc: "A completely private financial experience. No cloud tracking, no hidden data harvesting.",
      icon: <Lock className="text-purple-500" size={24} />,
    }
  ];

  return (
    <div className={`min-h-screen selection:bg-emerald-500/30 selection:text-emerald-900 overflow-x-hidden ${isDarkMode ? 'bg-[#050505] text-white' : 'bg-gray-50 text-gray-900'}`}>
      
      {/* Premium Minimal Header */}
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

      {/* Hero Section: Centered & Impactful */}
      <main className="relative z-10 pt-32 lg:pt-48 pb-24 px-6 max-w-7xl mx-auto">
        
        {/* Visual Glimmer Effects */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-3xl aspect-square pointer-events-none opacity-20">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[60%] bg-emerald-500/20 rounded-full blur-[120px] animate-pulse" />
        </div>

        <section className="text-center space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
           <div className="space-y-6">
              <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-[0.9] italic">
                COMPLETE <br/>
                <span className="text-emerald-500">VISIBILITY.</span>
              </h1>
              <p className="text-lg md:text-2xl font-medium text-gray-500 max-w-2xl mx-auto leading-relaxed">
                A simple, elegant way to track your expenses, manage your debt, and secure your financial future in total privacy.
              </p>
           </div>

           <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => navigate('/onboarding')}
                className="group w-full sm:w-auto px-10 py-5 bg-emerald-500 text-black rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/20"
              >
                Get Started <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button 
                onClick={() => navigate('/login')}
                className={`w-full sm:w-auto px-10 py-5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border ${isDarkMode ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-100'}`}
              >
                Login to Portal
              </button>
           </div>

           <div className="pt-8 flex flex-wrap items-center justify-center gap-8 opacity-40">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase"><Smartphone size={14} /> Local-Only</div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase"><Globe size={14} /> Open Source</div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase"><Sparkles size={14} /> No Data Harvesting</div>
           </div>
        </section>

        {/* Feature Grid: Simplified Benefits */}
        <section className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-8">
           {features.map((item, i) => (
             <div key={i} className={`p-10 rounded-3xl border transition-all hover:-translate-y-2 ${isDarkMode ? 'bg-white/[0.03] border-white/5 hover:bg-white/[0.05]' : 'bg-white border-gray-200/50 hover:shadow-2xl'}`}>
                <div className="w-12 h-12 bg-gray-100 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-8">
                   {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 tracking-tight">{item.title}</h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">{item.desc}</p>
             </div>
           ))}
        </section>

        {/* Final Soft CTA */}
        <section className="mt-40 p-12 lg:p-24 rounded-[3.5rem] border text-center relative overflow-hidden group transition-all duration-700 ${isDarkMode ? 'bg-white/[0.02] border-white/5' : 'bg-white border-gray-100 shadow-xl'}">
           <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
           <div className="relative z-10 space-y-10">
              <div className="space-y-4">
                 <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase">Take Control.</h2>
                 <p className="text-lg text-gray-500 font-medium max-w-xl mx-auto leading-relaxed">
                   Join thousands of users who have engineered their debt-free future using the Zenith protocol.
                 </p>
              </div>
              <button 
                onClick={() => {
                   useStore.getState().loadMockData();
                   navigate('/dashboard');
                 }}
                className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 hover:text-emerald-500 transition-all shimmer-text underline decoration-emerald-500/20 underline-offset-8"
              >
                Quick Demo Access →
              </button>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Landing;
