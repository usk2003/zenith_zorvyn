import React from 'react';
import { ShieldAlert, RotateCcw } from 'lucide-react';

/**
 * A global Error Boundary to catch UI runtime errors and prevent total application failure.
 * Provides a friendly, branded fallback screen.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Zorvyn Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={`flex flex-col items-center justify-center min-h-screen p-12 text-center bg-[#050505] text-white selection:bg-emerald-500/20`}>
          <div className="absolute inset-0 bg-emerald-500/5 blur-[120px] -z-10" />
          
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <div className="flex flex-col items-center gap-6">
                <div className="w-20 h-20 bg-emerald-500 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-emerald-500/20">
                   <img src="/logo.png" alt="Zenith" className="w-12 h-12 object-contain" />
                </div>
                <div className="space-y-2">
                   <p className="text-[10px] font-black uppercase text-emerald-500 tracking-[0.4em] italic mb-2">Protocol Anomaly // 500</p>
                   <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none">Command Interrupted.</h1>
                </div>
             </div>

             <div className="p-8 rounded-[3rem] border border-white/5 bg-white/[0.02] max-w-md mx-auto space-y-6">
                <div className="flex items-center justify-center gap-2 text-red-500">
                   <ShieldAlert size={20} />
                   <span className="text-[10px] font-black uppercase tracking-widest leading-none mt-1">Interference Detected</span>
                </div>
                <p className="text-gray-500 font-medium italic leading-relaxed">
                   An unexpected runtime exception has desynchronized the interface. Our tactical team has been logged, and <span className="text-emerald-500">we will get back to you</span> with a resolution shortly.
                </p>
             </div>

             <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  onClick={() => window.location.reload()}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-500/10 hover:scale-105 active:scale-95 transition-all"
                >
                  <RotateCcw size={16} />
                  Retry Sequence
                </button>
                <button 
                  onClick={() => window.location.href = '/'}
                  className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 active:scale-95 transition-all"
                >
                  Return to Home
                </button>
             </div>

             <p className="text-[8px] font-black text-gray-700 uppercase tracking-[0.3em]">Zenith v3.1 // Strategic Safeguard Active</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
