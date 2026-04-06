import React, { useState } from 'react';
import { 
  Shield, Upload, ArrowRight, AlertCircle, 
  Lock, CheckCircle2, ChevronRight, FileJson, Award,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import ThemeToggle from '../components/ThemeToggle';
import Footer from '../components/Footer';

const Login = () => {
  const navigate = useNavigate();
  const { security, restoreData, isDarkMode } = useStore();
  
  const [personnelName, setPersonnelName] = useState('');
  const [answer, setAnswer] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError('');
    }
  };

// [Restoration Node] Processes tactical JSON backup files for session recovery.
  const handleLogin = () => {
    if (!personnelName) return setError("Personnel Identification Required.");
    if (!selectedFile) return setError("Tactical Backup File Required.");
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.security && data.security.answer && data.security.answer.toLowerCase() !== answer.toLowerCase()) {
          throw new Error("Security Access Denied: Answer Mismatch.");
        }
        restoreData(data);
        setSuccess(true);
        setTimeout(() => navigate('/dashboard'), 1500);
      } catch (err) {
        setError(err.message || "Invalid Backup Schema Detected.");
      }
    };
    reader.readAsText(selectedFile);
  };

  return (
    <div className={`min-h-screen selection:bg-emerald-500/30 transition-colors flex flex-col font-sans ${isDarkMode ? 'bg-[#050505] text-white' : 'bg-gray-50 text-gray-900'}`}>
       
       <header className="fixed top-0 left-0 w-full z-[100] py-6 px-10 flex items-center justify-between">
          <div onClick={() => navigate('/')} className="flex items-center gap-2 group cursor-pointer">
             <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:rotate-6 transition-transform">
                <img src="/logo.png" alt="Z" className="w-full h-full object-contain" />
             </div>
             <h1 className="text-sm font-black italic tracking-tighter uppercase">ZENITH</h1>
          </div>
          <ThemeToggle className="scale-75" />
       </header>

       <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 max-w-xl mx-auto w-full pt-20 pb-32">
          <div className="absolute inset-x-0 top-1/4 h-1/2 bg-emerald-500/5 blur-[120px] -z-10" />
          
          <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <div className="text-center space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="inline-flex p-2 bg-emerald-500/10 rounded-lg text-emerald-500 mb-2">
                   <Lock size={20} />
                </div>
                <h2 className="text-2xl font-black italic tracking-tighter uppercase">Personnel Portal</h2>
                <p className="text-[8px] font-black uppercase text-gray-500 tracking-[0.3em]">Restoration Sequence Active</p>
             </div>

             {error && (
               <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-xl flex items-center gap-3 animate-in shake-in duration-500">
                  <AlertCircle size={14} className="text-red-500" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-red-500">{error}</span>
               </div>
             )}

             {success && (
               <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-center gap-3 animate-pulse">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500">Access Granted. Synchronizing Ledger...</span>
               </div>
             )}

             <div className="space-y-5">
                <div className="space-y-1.5">
                   <label className="text-[8px] font-black uppercase text-gray-400 tracking-widest ml-1">Identity Tag</label>
                   <input 
                     type="text" 
                     placeholder="e.g. COMMANDER_DOE" 
                     value={personnelName}
                     onChange={(e) => setPersonnelName(e.target.value)}
                     className={`w-full p-3 rounded-xl border-2 outline-none focus:border-emerald-500 font-bold text-xs transition-all shadow-sm ${isDarkMode ? 'bg-gray-950 border-gray-900 text-white placeholder:text-gray-800' : 'bg-white border-gray-100 placeholder:text-gray-200'}`}
                   />
                </div>

                <div className="space-y-1.5">
                   <label className="text-[8px] font-black uppercase text-gray-400 tracking-widest ml-1">Restoration Key (.JSON)</label>
                   <div className="relative group/file">
                      <input 
                        type="file" 
                        accept=".json"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className={`w-full p-4 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all ${selectedFile ? 'border-emerald-500 bg-emerald-500/5' : (isDarkMode ? 'border-gray-900 bg-gray-950 hover:border-gray-800' : 'border-gray-200 bg-gray-50 hover:border-gray-300')}`}>
                         {selectedFile ? (
                           <div className="flex items-center gap-3">
                              <FileJson className="text-emerald-500" size={16} />
                              <div className="text-left">
                                 <p className="text-[9px] font-black text-emerald-500 truncate max-w-[150px] uppercase tracking-tighter">{selectedFile.name}</p>
                                 <p className="text-[7px] text-gray-400 font-black">SCHEMA DETECTED</p>
                              </div>
                           </div>
                         ) : (
                           <>
                              <Upload className="text-gray-400 group-hover/file:text-emerald-500 transition-colors" size={20} />
                              <p className="text-[8px] font-black text-gray-400 group-hover/file:text-emerald-500 uppercase tracking-widest">Deploy Backup File</p>
                           </>
                         )}
                      </div>
                   </div>
                </div>

                {security.question && (
                   <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-500">
                      <label className="text-[8px] font-black uppercase text-gray-400 tracking-widest ml-1">Tactical Challenge: {security.question}</label>
                      <input 
                        type="password" 
                        placeholder="Security Answer Required" 
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        className={`w-full p-3 rounded-xl border-2 outline-none focus:border-emerald-500 font-bold text-xs transition-all shadow-sm ${isDarkMode ? 'bg-gray-950 border-gray-900 text-white placeholder:text-gray-800' : 'bg-white border-gray-100 placeholder:text-gray-200'}`}
                      />
                   </div>
                )}

                <button 
                  onClick={handleLogin}
                  disabled={!selectedFile || !personnelName}
                  className="w-full py-3.5 rounded-xl bg-emerald-500 text-black text-[9px] font-black uppercase tracking-widest hover:scale-[1.01] active:scale-95 transition-all shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 disabled:opacity-30"
                >
                  Verify Identity & Restore Access <ChevronRight size={14} />
                </button>
             </div>

             <div className="pt-6 border-t border-gray-100 dark:border-white/5 opacity-80 flex flex-col items-center gap-4">
                <p 
                  onClick={() => navigate('/onboarding')}
                  className={`w-full p-3 rounded-xl border flex items-center justify-center gap-3 cursor-pointer transition-all hover:scale-[1.01] active:scale-95 ${isDarkMode ? 'bg-emerald-500/5 border-emerald-500/10 hover:bg-emerald-500/10' : 'bg-emerald-50 border-emerald-100 hover:bg-emerald-100'}`}
                >
                   <Sparkles size={12} className="text-emerald-500 animate-pulse" />
                   <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest leading-none">
                      Need to initialize a new node? <span className="text-emerald-500 ml-1 underline decoration-emerald-500/30 underline-offset-4">Begin Onboarding</span>
                   </span>
                </p>
                <div className="flex items-center gap-4 opacity-40">
                   <div className="text-[7px] font-black uppercase text-gray-400 tracking-[0.3em] flex items-center gap-1.5"><Shield size={10} className="text-emerald-500" /> AES-256 Verifier</div>
                   <div className="text-[7px] font-black uppercase text-gray-400 tracking-[0.3em] flex items-center gap-1.5"><Award size={10} className="text-emerald-500" /> Self-Custody Access</div>
                </div>
             </div>
          </div>
       </main>

       <Footer />
    </div>
  );
};

export default Login;
