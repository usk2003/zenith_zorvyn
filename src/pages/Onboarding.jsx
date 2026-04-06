import React, { useState } from 'react';
import { 
  User, Landmark, Target, ArrowRight, Check,
  Shield, TrendingUp, AlertTriangle,
  LineChart, Coins
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import ThemeToggle from '../components/ThemeToggle';
import Footer from '../components/Footer';

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { setUserProfile, addAccount, addGoal, addInvestment, addCreditCard, addLoan, setRole, clearEverything, isDarkMode } = useStore();
  
  const [formData, setFormData] = useState({
    name: '',
    jobTitle: '',
    initialBalance: '',
    accountName: 'Primary Savings',
    monthlyIncome: '',
    primaryGoal: '',
    goalTarget: '',
    goalMonthly: '',
    sipAmount: '',
    creditCardLimit: '',
    loanName: '',
    loanPrincipal: '',
    loanInterest: '8.5',
    loanTenure: '120',
    mfName: 'Strategic Growth Fund',
    mfInvested: '',
    mfMarket: '',
    mfReturn: '12',
    mfHorizon: '10'
  });

// [Onboarding Finalization] Commit nodes to store and redirect to command center.
  const handleComplete = () => {
    setUserProfile({ name: formData.name, jobTitle: formData.jobTitle, avatarColor: '#10b981' });
    if (formData.initialBalance) {
      addAccount({ id: 'acc_main_' + Date.now(), name: formData.accountName || 'Primary Savings', type: 'Bank', balance: parseFloat(formData.initialBalance), color: '#10b981', icon: 'landmark' });
    }
    if (formData.primaryGoal && formData.goalTarget) {
      addGoal({ id: 'goal_' + Date.now(), title: formData.primaryGoal, target: parseFloat(formData.goalTarget), current: 0, sipContribution: parseFloat(formData.goalMonthly || 0), icon: 'target', color: '#14b8a6' });
    }
    if (formData.mfInvested) {
      addInvestment({ id: 'inv_' + Date.now(), name: formData.mfName, type: 'Mutual Fund', invested: parseFloat(formData.mfInvested), current: parseFloat(formData.mfMarket || formData.mfInvested), expectedReturn: parseFloat(formData.mfReturn || 12), horizon: parseInt(formData.mfHorizon || 10), sip: parseFloat(formData.sipAmount || 0) });
    }
    if (formData.creditCardLimit) {
      addCreditCard({ id: 'cc_' + Date.now(), name: 'Executive Card', limit: parseFloat(formData.creditCardLimit), balance: 0, dueDate: '15th', statementDate: '1st' });
    }
    if (formData.loanName && formData.loanPrincipal) {
      addLoan({ id: 'loan_' + Date.now(), name: formData.loanName, principal: parseFloat(formData.loanPrincipal), interestRate: parseFloat(formData.loanInterest) || 8.5, tenure: parseInt(formData.loanTenure) || 120, paidAmount: 0, startDate: new Date().toISOString().slice(0, 10) });
    }
    setRole('admin');
    navigate('/dashboard');
  };

  const inputStyles = `w-full border p-3 rounded-xl outline-none focus:border-emerald-500 font-bold text-sm transition-all shadow-sm ${isDarkMode ? 'bg-gray-950 border-gray-900 text-white placeholder:text-gray-800' : 'bg-white border-gray-100 text-gray-900 placeholder:text-gray-200'}`;
  const labelStyles = "text-[9px] font-black uppercase text-gray-400 tracking-widest block mb-1.5 ml-1";

  const steps = [
    {
      id: 1,
      title: "Identity",
      subtitle: "Setup your profile node.",
      icon: <User className="text-emerald-500" size={16} />,
      content: (
        <div className="space-y-4">
          <div>
            <label className={labelStyles}>Full Name</label>
            <input type="text" placeholder="e.g. John Doe" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={inputStyles} />
          </div>
          <div>
            <label className={labelStyles}>Occupation</label>
            <input type="text" placeholder="e.g. Software Engineer" value={formData.jobTitle} onChange={e => setFormData({...formData, jobTitle: e.target.value})} className={inputStyles} />
          </div>
          <div className="pt-4 mt-4 border-t border-gray-100 dark:border-white/5 opacity-80">
             <div className="flex items-center gap-3 p-3 bg-red-500/[0.03] rounded-xl border border-red-500/10">
                <div className="p-2 bg-red-500/10 rounded-lg text-red-500"><AlertTriangle size={12} /></div>
                <div className="flex-1">
                   <p className="text-[8px] font-black uppercase text-red-500">Reset Data?</p>
                   <p className="text-[10px] text-gray-500 font-medium">Clear all local storage.</p>
                </div>
                <button onClick={() => window.confirm("Clear all data?") && clearEverything()} className="px-3 py-1.5 bg-red-500 text-white text-[8px] font-black uppercase rounded-lg hover:bg-red-600 transition-colors">Clear</button>
             </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Bank Node",
      subtitle: "Initialize primary savings.",
      icon: <Landmark className="text-emerald-500" size={16} />,
      content: (
        <div className="space-y-4">
          <div>
            <label className={labelStyles}>Initial Balance</label>
            <div className="relative">
               <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-gray-400">₹</span>
               <input type="number" placeholder="0.00" value={formData.initialBalance} onChange={e => setFormData({...formData, initialBalance: e.target.value})} className={inputStyles + " pl-8 text-base text-emerald-500"} />
            </div>
          </div>
          <div>
            <label className={labelStyles}>Account Name</label>
            <input type="text" placeholder="HDFC, ICICI, etc." value={formData.accountName} onChange={e => setFormData({...formData, accountName: e.target.value})} className={inputStyles} />
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Debt Matrix",
      subtitle: "Log active liabilities.",
      icon: <Shield className="text-emerald-500" size={16} />,
      content: (
        <div className="space-y-4">
           <div>
            <label className={labelStyles}>Loan Designation</label>
            <input type="text" placeholder="Home Loan, Car Loan" value={formData.loanName} onChange={e => setFormData({...formData, loanName: e.target.value})} className={inputStyles} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelStyles}>Principal</label>
              <input type="number" placeholder="0" value={formData.loanPrincipal} onChange={e => setFormData({...formData, loanPrincipal: e.target.value})} className={inputStyles} />
            </div>
            <div>
              <label className={labelStyles}>Rate (%)</label>
              <input type="number" placeholder="8.5" value={formData.loanInterest} onChange={e => setFormData({...formData, loanInterest: e.target.value})} className={inputStyles} />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Objectives",
      subtitle: "Define financial targets.",
      icon: <Target className="text-emerald-500" size={16} />,
      content: (
        <div className="space-y-4">
           <div>
            <label className={labelStyles}>Goal Title</label>
            <input type="text" placeholder="House Deposit, Travel" value={formData.primaryGoal} onChange={e => setFormData({...formData, primaryGoal: e.target.value})} className={inputStyles} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
               <label className={labelStyles}>Target</label>
               <input type="number" value={formData.goalTarget} onChange={e => setFormData({...formData, goalTarget: e.target.value})} className={inputStyles} />
            </div>
            <div>
               <label className={labelStyles}>Monthly Save</label>
               <input type="number" value={formData.goalMonthly} onChange={e => setFormData({...formData, goalMonthly: e.target.value})} className={inputStyles} />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "Asset Nexus",
      subtitle: "Track mutual funds.",
      icon: <LineChart className="text-emerald-500" size={16} />,
      content: (
        <div className="space-y-4">
           <div>
            <label className={labelStyles}>Portfolio Name</label>
            <input type="text" value={formData.mfName} onChange={e => setFormData({...formData, mfName: e.target.value})} className={inputStyles} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
               <label className={labelStyles}>Invested</label>
               <input type="number" value={formData.mfInvested} onChange={e => setFormData({...formData, mfInvested: e.target.value})} className={inputStyles} />
            </div>
            <div>
               <label className={labelStyles}>Market Value</label>
               <input type="number" value={formData.mfMarket} onChange={e => setFormData({...formData, mfMarket: e.target.value})} className={inputStyles} />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: "Flow",
      subtitle: "Establish cashflow.",
      icon: <TrendingUp className="text-emerald-500" size={16} />,
      content: (
        <div className="space-y-4">
           <div>
            <label className={labelStyles}>Monthly Income</label>
            <input type="number" placeholder="0" value={formData.monthlyIncome} onChange={e => setFormData({...formData, monthlyIncome: e.target.value})} className={inputStyles} />
          </div>
          <div>
            <label className={labelStyles}>Card Limit</label>
            <input type="number" placeholder="0" value={formData.creditCardLimit} onChange={e => setFormData({...formData, creditCardLimit: e.target.value})} className={inputStyles} />
          </div>
        </div>
      )
    }
  ];

  const currStep = steps.find(s => s.id === step);

  return (
    <div className={`min-h-screen flex flex-col font-sans selection:bg-emerald-500/30 transition-colors ${isDarkMode ? 'bg-[#050505] text-white' : 'bg-gray-50 text-gray-900'}`}>
       
       <header className="fixed top-0 left-0 w-full z-[100] py-4 px-6 md:px-10 flex items-center justify-between backdrop-blur-md">
          <div onClick={() => navigate('/')} className="flex items-center gap-2 group cursor-pointer">
             <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:rotate-6 transition-transform">
                <img src="/logo.png" alt="Z" className="w-full h-full object-contain" />
             </div>
             <h1 className="text-sm font-black italic tracking-tighter uppercase">ZENITH</h1>
          </div>
          <ThemeToggle className="scale-75" />
       </header>

       <main className="flex-1 flex items-center justify-center p-4 relative z-10 pt-16 pb-24">
          <div className="w-full max-w-2xl grid grid-cols-1 lg:grid-cols-[140px_1fr] gap-6 items-start">
             
             {/* Progress Sidebar */}
             <div className="space-y-2 hidden lg:block sticky top-24">
                {steps.map(s => (
                  <div key={s.id} className="flex items-center gap-3">
                     <div className={`w-5 h-5 rounded-lg flex items-center justify-center text-[7px] font-black transition-all border ${
                       s.id === step ? 'bg-emerald-500 border-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 
                       s.id < step ? 'bg-emerald-100 dark:bg-emerald-500/20 border-transparent text-emerald-600' : 
                       (isDarkMode ? 'border-gray-800 text-gray-700' : 'border-gray-200 text-gray-300')
                     }`}>
                        {s.id < step ? <Check size={8} /> : s.id}
                     </div>
                     <p className={`text-[7px] font-black uppercase tracking-widest ${s.id === step ? (isDarkMode ? 'text-white' : 'text-gray-900') : 'text-gray-400'}`}>{s.title}</p>
                  </div>
                ))}
             </div>

             {/* Content Area (Integrated, not a modal) */}
             <div className="w-full space-y-4 animate-in fade-in slide-in-from-right-4 duration-700 delay-[300ms]">
                 <div className="space-y-4">
                    <div className="flex items-start justify-between border-b border-gray-100 dark:border-white/5 pb-3">
                       <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                             <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-500">
                                {React.cloneElement(currStep.icon, { size: 12 })}
                             </div>
                             <div>
                                <p className="text-[7px] font-black uppercase text-emerald-500 tracking-[0.3em] font-sans">Section 0{step}</p>
                                <h2 className="text-xl font-black italic tracking-tighter uppercase leading-none">{currStep.title}</h2>
                             </div>
                          </div>
                          <p className="text-gray-500 text-[9px] font-medium ml-1 mt-1">{currStep.subtitle}</p>
                       </div>
                    </div>

                    <div className="min-h-[140px] flex flex-col justify-center">
                       {currStep.content}
                    </div>

                    <div className="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-white/5">
                       {step > 1 && (
                          <button onClick={() => setStep(step - 1)} className={`py-2 px-4 rounded-xl text-[7px] font-black uppercase tracking-widest transition-all border ${isDarkMode ? 'bg-white/5 border-white/5 text-white hover:bg-white/10' : 'bg-gray-50 border-gray-100 text-gray-400 hover:bg-gray-100'}`}>Back</button>
                       )}
                       <button 
                          disabled={step === 1 && !formData.name}
                          onClick={() => step < steps.length ? setStep(step + 1) : handleComplete()}
                          className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-black text-[8px] font-black uppercase tracking-widest hover:scale-[1.01] active:scale-95 transition-all shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 disabled:opacity-30 disabled:hover:scale-100"
                       >
                          {step === steps.length ? 'Finalize Protocol' : 'Next Step'} <ArrowRight size={10} />
                       </button>
                    </div>
                 </div>
             </div>

          </div>
       </main>

       <Footer />
    </div>
  );
};

export default Onboarding;
