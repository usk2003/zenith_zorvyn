import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mail, MessageSquare, Shield, X, 
  Twitter, Linkedin, Github, ExternalLink, 
  Zap, Compass, User
} from 'lucide-react';

const CreatorModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 md:p-12 animate-in fade-in duration-300">
       <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />
       
       <div className="relative w-full max-w-4xl bg-[#050505] border border-white/5 rounded-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 slide-in-from-bottom-12 duration-500">
          
          {/* Creator Profile Section */}
          <div className="w-full md:w-[40%] bg-white/[0.02] border-r border-white/5 p-12 flex flex-col items-center justify-between text-center">
             <div className="space-y-8 flex flex-col items-center">
                <div className="w-32 h-32 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-emerald-500/20 group relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
                   <User size={64} className="text-black relative z-10" />
                </div>
                <div className="space-y-2">
                   <p className="text-[10px] font-black uppercase text-emerald-500 tracking-[0.4em] italic leading-none">Architect & Founder</p>
                   <h3 className="text-2xl font-black italic tracking-tighter uppercase leading-none text-white whitespace-nowrap">Urlana Suresh Kumar</h3>
                </div>
                <div className="flex items-center gap-6">
                   <a href="#" className="p-3 bg-white/5 rounded-2xl text-gray-500 hover:text-emerald-500 hover:bg-emerald-500/10 transition-all"><Linkedin size={18} /></a>
                   <a href="#" className="p-3 bg-white/5 rounded-2xl text-gray-400 hover:text-emerald-500 hover:bg-emerald-500/10 transition-all"><Twitter size={18} /></a>
                   <a href="#" className="p-3 bg-white/5 rounded-2xl text-gray-400 hover:text-emerald-500 hover:bg-emerald-500/10 transition-all"><Github size={18} /></a>
                </div>
             </div>
             <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest leading-loose">
                Data Sovereignty // Wealth Engineering // Modular Logistics
             </p>
          </div>

          {/* Vision/Story Section */}
          <div className="flex-1 p-12 space-y-12">
             <div className="space-y-6">
                <div className="flex items-center gap-3 text-emerald-500">
                   <Compass size={20} />
                   <h4 className="text-[10px] font-black uppercase tracking-[0.4em]">The Strategic Model</h4>
                </div>
                <p className="text-lg md:text-xl text-gray-400 font-medium italic leading-[1.6]">
                   "My philosophy is rooted in <span className="text-white">Data Sovereignty</span>. Zenith isn't just an app; it's a professional-grade terminal built on the principle that your financial intelligence should never leave your local node."
                </p>
             </div>

             <div className="space-y-6">
                <div className="flex items-center gap-3 text-emerald-500">
                   <Zap size={20} />
                   <h4 className="text-[10px] font-black uppercase tracking-[0.4em]">The Genesis (Why)</h4>
                </div>
                <p className="text-sm md:text-base text-gray-500 font-medium leading-relaxed italic pr-6 pb-4 border-b border-white/5">
                   Zenith was built to dismantle the compromise between <span className="text-emerald-500">Sophisticated Tracking</span> and <span className="text-emerald-500">Absolute Privacy</span>. Most tools harvest your data as you manage your wealth; I started this to ensure the engineer remains the sole master of their data.
                </p>
                <div className="flex items-center gap-6 pt-4">
                   <div className="flex items-center gap-2 text-[9px] font-black uppercase text-gray-500 tracking-widest"><Shield size={14} className="text-emerald-500" /> AES-256 Validated</div>
                   <div className="flex items-center gap-2 text-[9px] font-black uppercase text-gray-500 tracking-widest underline decoration-emerald-500/20 underline-offset-4 decoration-2 italic cursor-pointer hover:text-emerald-500 transition-colors" onClick={() => window.location.href = 'mailto:hello@zorvyn.com'}><Mail size={14} /> Contact Node</div>
                </div>
             </div>
          </div>

          {/* Close Trigger */}
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 p-3 bg-white/5 text-gray-500 hover:text-white rounded-2xl transition-all hover:rotate-90 active:scale-95"
          >
             <X size={20} />
          </button>

       </div>
    </div>
  );
};

const Footer = () => {
  const navigate = useNavigate();
  const [showCreatorModal, setShowCreatorModal] = useState(false);

  return (
    <>
      <CreatorModal isOpen={showCreatorModal} onClose={() => setShowCreatorModal(false)} />
      <footer className="py-16 px-6 lg:px-12 bg-white dark:bg-black border-t border-gray-100 dark:border-white/5 transition-colors relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 overflow-hidden rounded-xl">
                 <img src="/logo.png" alt="Zenith Logo" className="w-full h-full object-contain" />
              </div>
              <h3 className="text-xl font-black italic tracking-tighter text-gray-900 dark:text-white uppercase">ZENITH</h3>
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-loose">
              Strategic Executive Terminal for High-Density Financial Analysis and Wealth Engineering.
            </p>
          </div>

          {/* Strategic Nodes */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase text-emerald-500 tracking-[0.4em]">Strategic Nodes</h4>
            <ul className="space-y-3">
              {['Dashboard', 'Transactions', 'Intelligence', 'Insights'].map(item => (
                 <li key={item}>
                    <button 
                      onClick={() => navigate(`/${item.toLowerCase() === 'dashboard' ? 'dashboard' : item.toLowerCase()}`)}
                      className="text-xs font-bold text-gray-500 hover:text-emerald-500 transition-colors uppercase tracking-widest flex items-center gap-2 group"
                    >
                       <span className="w-1 h-1 bg-gray-300 rounded-full group-hover:w-3 group-hover:bg-emerald-500 transition-all" />
                       {item}
                    </button>
                 </li>
              ))}
            </ul>
          </div>

          {/* Tactical Support */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase text-emerald-500 tracking-[0.4em]">Tactical Support</h4>
            <ul className="space-y-4">
              <li>
                 <a href="mailto:support@zenith.executive" className="flex items-center gap-3 group">
                    <div className="p-2 bg-gray-100 dark:bg-white/5 rounded-lg text-gray-400 group-hover:text-emerald-500 transition-colors"><Mail size={14} /></div>
                    <div>
                       <p className="text-[10px] font-black uppercase text-gray-400">Direct Uplink</p>
                       <p className="text-xs font-bold dark:text-white leading-none mt-1">support@zenith.executive</p>
                    </div>
                 </a>
              </li>
              <li>
                 <button onClick={() => window.open('https://zenith.executive/feedback')} className="flex items-center gap-3 group text-left">
                    <div className="p-2 bg-gray-100 dark:bg-white/5 rounded-lg text-gray-400 group-hover:text-emerald-500 transition-colors"><MessageSquare size={14} /></div>
                    <div>
                       <p className="text-[10px] font-black uppercase text-gray-400">Intelligence Feedback</p>
                       <p className="text-xs font-bold dark:text-white leading-none mt-1">Report Anomalies</p>
                    </div>
                 </button>
              </li>
            </ul>
          </div>

          {/* Identification Column */}
          <div className="space-y-6">
             <h4 className="text-[10px] font-black uppercase text-emerald-500 tracking-[0.4em]">Visionary Protocol</h4>
             <div className="flex flex-col gap-4">
                <button 
                  onClick={() => setShowCreatorModal(true)}
                  className="group flex flex-col items-start gap-1 p-5 rounded-[2rem] border border-gray-100 dark:border-white/5 hover:border-emerald-500/20 transition-all hover:bg-emerald-500/[0.02]"
                >
                   <p className="text-[9px] font-black uppercase text-gray-400 tracking-[0.3em] group-hover:text-emerald-500 transition-colors">Project Architect</p>
                   <p className="text-sm font-black italic uppercase tracking-tighter text-gray-900 dark:text-white group-hover:underline underline-offset-4 decoration-emerald-500/30 decoration-2">Urlana Suresh Kumar</p>
                </button>
                <div className="flex items-center gap-6 px-4">
                   <a href="#" className="p-2 bg-gray-50 dark:bg-white/5 rounded-xl text-gray-400 hover:text-emerald-500 transition-all"><Linkedin size={14} /></a>
                   <a href="#" className="p-2 bg-gray-50 dark:bg-white/5 rounded-xl text-gray-400 hover:text-emerald-500 transition-all"><Twitter size={14} /></a>
                   <a href="#" className="p-2 bg-gray-50 dark:bg-white/5 rounded-xl text-gray-400 hover:text-emerald-500 transition-all"><Github size={14} /></a>
                </div>
             </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto mt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em]">
            &copy; 2026 ZENITH FINANCIAL - By Urlana Suresh Kumar
          </p>
          <div className="flex items-center gap-8 text-[9px] font-black text-gray-400 uppercase tracking-widest">
             <button onClick={() => navigate('/privacy')} className="hover:text-emerald-500 transition-colors">Privacy Protocol</button>
             <button onClick={() => navigate('/terms')} className="hover:text-emerald-500 transition-colors">Terms of Engagement</button>
             <button className="hover:text-emerald-500 transition-colors flex items-center gap-2 italic">Status: <span className="text-emerald-500">Operational</span></button>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
