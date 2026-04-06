import React from 'react';
import { Shield, Lock, FileText, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import ThemeToggle from '../components/ThemeToggle';
import Footer from '../components/Footer';

const Legal = ({ type }) => {
  const navigate = useNavigate();
  const { isDarkMode } = useStore();
  
  const isPrivacy = type === 'privacy';
  const title = isPrivacy ? "Privacy Protocol" : "Terms of Engagement";
  const subtitle = isPrivacy ? "Data Stewardship & Encryption Standards" : "Operational Framework & Tactical Usage";

  const content = isPrivacy ? [
    {
      title: "1. Data Sovereignty",
      body: "All financial data processed by Zenith remains strictly localized within your browser's persistent store. Zenith does not transmit sensitive ledger data to external servers."
    },
    {
      title: "2. Encryption Layer",
      body: "Local data is protected by the AES-256 standard. Your executive PIN and security answers are hashed locally to ensure zero-knowledge authentication."
    },
    {
      title: "3. Third-Party Integration",
      body: "Zenith may use external APIs for live market data and currency conversion. No personally identifiable information (PII) is shared during these tactical uplinks."
    }
  ] : [
    {
      title: "1. Authorized Usage",
      body: "The Zenith Terminal is designed for personal wealth engineering and high-density financial analysis. Commercial redistribution of the terminal logic is strictly prohibited."
    },
    {
      title: "2. Liability Matrix",
      body: "Financial projections provided by Zenith are mathematical simulations. Zenith is not responsible for real-world capital loss or strategic miscalculations."
    },
    {
      title: "3. Termination Protocol",
      body: "The user has absolute authority to wipe the local store at any time. Zenith reserves the right to deprecate legacy nodes as system architecture evolves."
    }
  ];

  return (
    <div className={`min-h-screen selection:bg-emerald-500/30 transition-colors flex flex-col font-sans ${isDarkMode ? 'bg-[#050505] text-white' : 'bg-gray-50 text-gray-900'}`}>
       
       <header className="fixed top-0 left-0 w-full z-[100] py-6 px-10 flex items-center justify-between backdrop-blur-md">
          <div onClick={() => navigate('/')} className="flex items-center gap-2 group cursor-pointer">
             <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:rotate-6 transition-transform">
                <img src="/logo.png" alt="Z" className="w-full h-full object-contain" />
             </div>
             <h1 className="text-sm font-black italic tracking-tighter uppercase">ZENITH</h1>
          </div>
          <ThemeToggle className="scale-75" />
       </header>

       <main className="flex-1 flex flex-col items-center p-6 relative z-10 max-w-4xl mx-auto w-full pt-32 pb-24">
          <div className="absolute inset-x-0 top-1/4 h-1/2 bg-emerald-500/5 blur-[120px] -z-10" />
          
          <div className="w-full space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <header className="space-y-6 text-center lg:text-left">
                <div className="flex flex-col lg:flex-row items-center lg:items-end gap-4 lg:gap-6">
                   <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-emerald-500/10 text-emerald-500' : 'bg-emerald-500/5 text-emerald-500'}`}>
                      {isPrivacy ? <Lock size={32} /> : <FileText size={32} />}
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-emerald-500 tracking-[0.4em] italic leading-none">Protocol v3.1 // Active</p>
                      <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">{title}</h2>
                   </div>
                </div>
                <p className="text-lg md:text-xl text-gray-500 font-medium italic">{subtitle}</p>
             </header>

             <div className="space-y-8">
               {content.map((section, idx) => (
                 <section key={idx} className={`p-8 md:p-12 rounded-[3.5rem] border transition-all hover:scale-[1.01] ${isDarkMode ? 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]' : 'bg-white border-gray-100/50 hover:shadow-2xl'}`}>
                   <div className="flex items-center gap-6 mb-6">
                      <span className="text-3xl font-black italic text-emerald-500 opacity-30">0{idx + 1}</span>
                      <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight">{section.title}</h3>
                   </div>
                   <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 font-medium leading-relaxed italic">
                     {section.body}
                   </p>
                 </section>
               ))}

               <div className={`p-10 rounded-[3.5rem] border border-emerald-500/20 flex flex-col md:flex-row items-center justify-between gap-8 ${isDarkMode ? 'bg-emerald-500/5' : 'bg-emerald-500/[0.02]'}`}>
                  <div className="flex items-center gap-6">
                     <div className="p-3 bg-emerald-500 text-black rounded-xl shadow-lg shadow-emerald-500/20"><Shield size={24} /></div>
                     <p className="text-sm font-black uppercase tracking-widest leading-tight">
                        Zenith Integrity Framework<br/>
                        <span className="text-[10px] text-emerald-500">Status: Active & Validated</span>
                     </p>
                  </div>
                  <button 
                    onClick={() => navigate(-1)}
                    className="w-full md:w-auto px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 group transition-transform active:scale-95"
                  >
                     Return To Nexus <ChevronRight size={16} className="group-hover:translate-x-2 transition-transform" />
                  </button>
               </div>
             </div>
          </div>
       </main>

       <Footer />
    </div>
  );
};

export default Legal;
