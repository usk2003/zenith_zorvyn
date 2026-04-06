import React from 'react';
import { 
  Rocket, 
  Cpu, 
  Globe, 
  Smartphone, 
  Users, 
  BarChart3, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  Zap 
} from 'lucide-react';
import useInitialLoading from '../hooks/useInitialLoading';
import Skeleton from '../components/Skeleton';

const Roadmap = () => {
  const isLoading = useInitialLoading(800);

  const roadmapPhases = [
    {
      id: 1,
      phase: "Phase 1: Foundation+",
      title: "Consolidated Intelligence Hub",
      status: "In Development",
      icon: <CheckCircle2 className="text-emerald-500" />,
      items: [
        "Advanced Transaction Ledger with Filter Persistence",
        "Strategic Wealth Visualizations (Heatmaps & Projections)",
        "Premium Executive Header & Dashboard Relocation",
        "Universal Currency Localization Protocol"
      ]
    },
    {
      id: 2,
      phase: "Phase 2: Global Reach",
      title: "Multi-Currency Financial Hub",
      status: "Upcoming - Q3 2026",
      icon: <Globe className="text-accent" />,
      items: [
        "Direct API Integration with International Bank Feeds",
        "Real-time Forex Accounting & Portfolio Valuation",
        "Cross-Border Personal Tax Optimization Engine",
        "Global Asset Class Aggregation (US Stocks, EU Bonds)"
      ]
    },
    {
      id: 3,
      phase: "Phase 3: AI Augmentation",
      title: "Zenith Neural Strategist",
      status: "Research Phase",
      icon: <Cpu className="text-purple-500" />,
      items: [
        "Generative AI Financial Counselor (Context-Aware)",
        "Autonomous Spending Anomaly Detection & Alerts",
        "AI-Driven Investment Goal Simulation (Monte Carlo)",
        "Secure Voice Command Interface for Quick Audits"
      ]
    },
    {
      id: 4,
      phase: "Phase 4: Ecosystem Expansion",
      title: "The Mobile Command Center",
      status: "Planned",
      icon: <Smartphone className="text-blue-500" />,
      items: [
        "Native iOS & Android Applications (High-FID)",
        "Biometric Authentication & Offline Vault Access",
        "Zenith Card Integration (Exclusive Premium Metal Cap)",
        "Live Push Notifications for Market Intelligence"
      ]
    },
    {
      id: 5,
      phase: "Phase 5: Collaborative Network",
      title: "Zenith Family Office Hub",
      status: "Dream State",
      icon: <Users className="text-orange-500" />,
      items: [
        "Shared Vaults & Collaborative Budgeting Tools",
        "Managed Portfolio Access for Financial Advisors",
        "Trust & Estate Planning Document Integration",
        "Heirloom Wealth Transfer Automations"
      ]
    }
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1 space-y-2">
          <div className="text-4xl font-black tracking-tight text-gray-900 dark:text-white uppercase italic">
            {isLoading ? <Skeleton className="h-10 w-96 rounded-2xl" /> : 'Zenith Strategic Roadmap'}
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {isLoading ? <Skeleton className="h-4 w-64 rounded-lg" /> : 'The architectural evolution of your executive financial dashboard.'}
          </p>
        </div>
        {!isLoading && (
          <div className="flex items-center gap-3 px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
            <Rocket className="text-emerald-500 animate-bounce" size={20} />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Accelerating Value</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {roadmapPhases.map((phase, idx) => (
          <div 
            key={phase.id} 
            className={`
              relative p-8 rounded-[2.5rem] border transition-all duration-700 hover:scale-[1.02] bg-white dark:bg-black group
              ${phase.status === "In Development" 
                ? 'border-emerald-500/30 shadow-2xl shadow-emerald-500/10 hover:shadow-emerald-500/20' 
                : 'border-emerald-500/10 dark:border-emerald-500/20'}
              ${phase.id === 2 ? 'hover:shadow-accent/20 hover:border-accent/40' : ''}
              ${phase.id === 3 ? 'hover:shadow-purple-500/20 hover:border-purple-500/40' : ''}
              ${phase.id === 4 ? 'hover:shadow-blue-500/20 hover:border-blue-500/40' : ''}
              ${phase.id === 5 ? 'hover:shadow-orange-500/20 hover:border-orange-500/40' : ''}
              animate-in fade-in slide-in-from-left-8 duration-1000
            `}
            style={{ animationDelay: `${idx * 150}ms` }}
          >
            {/* Status Badge */}
            <div className="absolute top-8 right-8 flex items-center gap-2 px-4 py-1.5 bg-gray-50 dark:bg-white/5 rounded-full border border-emerald-500/10 dark:border-emerald-500/20">
              <Clock size={12} className="text-gray-400" />
              <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">{phase.status}</span>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                  {React.cloneElement(phase.icon, { size: 28 })}
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">{phase.phase}</p>
                   <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter mt-1">{phase.title}</h3>
                </div>
              </div>

              <div className="space-y-3">
                {phase.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="flex items-center gap-3 group/item">
                    <ChevronRight size={14} className="text-gray-300 dark:text-gray-700 group-hover/item:text-accent transition-colors" />
                    <span className="text-sm font-bold text-gray-600 dark:text-gray-400 group-hover/item:text-gray-900 dark:group-hover/item:text-white transition-colors">{item}</span>
                  </div>
                ))}
              </div>

              {/* Progress Detail for active phases */}
              {phase.status === "In Development" && (
                 <div className="pt-4 border-t border-emerald-500/10">
                   <div className="flex justify-between items-center mb-2">
                     <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Engineering Progress</span>
                     <span className="text-[10px] font-black text-emerald-500">85%</span>
                   </div>
                   <div className="w-full h-1.5 bg-emerald-500/10 rounded-full overflow-hidden">
                     <div className="w-[85%] h-full bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                   </div>
                 </div>
              )}
            </div>
          </div>
        ))}

        {/* Suggestion Card */}
        <div className="p-8 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-emerald-500/20 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in duration-1000 delay-700 bg-gray-50/50 dark:bg-white/[0.01] transition-all hover:border-accent/40 hover:shadow-[0_0_40px_rgba(16,185,129,0.1)] duration-700">
            <div className="p-5 bg-white dark:bg-white/5 rounded-full shadow-lg">
              <Zap className="text-accent" size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase">Missing Something?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">Our roadmap is driven by executive feedback. Suggest a high-fidelity feature.</p>
            </div>
            <button className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-black rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-110 active:scale-95 transition-all shadow-xl shadow-gray-200 dark:shadow-none">
              Submit Intelligence Suggestion
            </button>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
