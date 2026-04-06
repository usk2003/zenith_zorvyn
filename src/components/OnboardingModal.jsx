import React, { useState } from 'react';
import { 
  User, Briefcase, Landmark, Target, ArrowRight, Check,
  Zap, Wallet, Shield, PieChart, Sparkles, TrendingUp
} from 'lucide-react';
import useStore from '../store/useStore';

const OnboardingModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const { setUserProfile, addAccount, addGoal, addInvestment, addCreditCard, addLoan, setRole } = useStore();
  
  const [formData, setFormData] = useState({
    name: '',
    jobTitle: '',
    initialBalance: '',
    accountName: 'Primary Savings',
    monthlyIncome: '',
    primaryGoal: '',
    goalTarget: '',
    sipAmount: '',
    creditCardLimit: '',
    loanName: '',
    loanPrincipal: '',
    loanInterest: '8.5',
    loanTenure: '120',
  });

  if (!isOpen) return null;

  const handleComplete = () => {
    // Save Profile
    setUserProfile({ 
      name: formData.name, 
      jobTitle: formData.jobTitle,
      avatarColor: '#10b981'
    });

    // Save Initial Account
    if (formData.initialBalance) {
      addAccount({
        id: 'acc_main_' + Date.now(),
        name: formData.accountName || 'Primary Savings',
        type: 'Bank',
        balance: parseFloat(formData.initialBalance),
        color: '#10b981',
        icon: 'landmark'
      });
    }

    // Save Primary Goal
    if (formData.primaryGoal && formData.goalTarget) {
      addGoal({
        id: 'goal_' + Date.now(),
        title: formData.primaryGoal,
        target: parseFloat(formData.goalTarget),
        current: 0,
        icon: 'target',
        color: '#14b8a6'
      });
    }

    // Save Investment (SIP)
    if (formData.sipAmount) {
      addInvestment({
        id: 'inv_' + Date.now(),
        name: 'Growth Mutual Fund',
        type: 'Mutual Fund',
        invested: 0,
        current: 0,
        sip: parseFloat(formData.sipAmount)
      });
    }

    // Save Credit Card
    if (formData.creditCardLimit) {
      addCreditCard({
        id: 'cc_' + Date.now(),
        name: 'Executive Card',
        limit: parseFloat(formData.creditCardLimit),
        balance: 0,
        dueDate: '15th',
        statementDate: '1st'
      });
    }

    // Save Loan
    if (formData.loanName && formData.loanPrincipal) {
      addLoan({
        id: 'loan_' + Date.now(),
        name: formData.loanName,
        principal: parseFloat(formData.loanPrincipal),
        interestRate: parseFloat(formData.loanInterest) || 8.5,
        tenure: parseInt(formData.loanTenure) || 120,
        paidAmount: 0,
        startDate: new Date().toISOString().slice(0, 10)
      });
    }

    setRole('admin');
    onClose();
  };

  const steps = [
    {
      id: 1,
      title: "Tactical Identity",
      subtitle: "Initialize your executive profile.",
      icon: <User className="text-accent" size={24} />,
      content: (
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em]">Personnel Name</label>
            <input 
              type="text" 
              placeholder="e.g. Commander Shepard" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:ring-2 focus:ring-accent/40 font-bold transition-all"
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em]">Strategic Designation</label>
            <input 
              type="text" 
              placeholder="e.g. Chief Executive Officer" 
              value={formData.jobTitle} 
              onChange={e => setFormData({...formData, jobTitle: e.target.value})}
              className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:ring-2 focus:ring-accent/40 font-bold transition-all"
            />
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Capital Reservoir",
      subtitle: "Establish your primary asset node.",
      icon: <Landmark className="text-accent" size={24} />,
      content: (
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em]">Current Liquid Reserve</label>
            <input 
              type="number" 
              placeholder="0.00" 
              value={formData.initialBalance} 
              onChange={e => setFormData({...formData, initialBalance: e.target.value})}
              className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:ring-2 focus:ring-accent/40 font-black text-2xl text-accent transition-all"
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em]">Primary Account Label</label>
            <input 
              type="text" 
              placeholder="HDFC Priority, etc." 
              value={formData.accountName} 
              onChange={e => setFormData({...formData, accountName: e.target.value})}
              className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:ring-2 focus:ring-accent/40 font-bold transition-all"
            />
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Debt Architecture",
      subtitle: "Configure existing liabilities and interest rates.",
      icon: <Shield className="text-accent" size={24} />,
      content: (
        <div className="space-y-6">
           <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em]">Primary Loan Name</label>
            <input 
              type="text" 
              placeholder="e.g. Home Mortgage" 
              value={formData.loanName} 
              onChange={e => setFormData({...formData, loanName: e.target.value})}
              className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:ring-2 focus:ring-accent/40 font-bold transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em]">Principal Amount</label>
              <input 
                type="number" 
                placeholder="0" 
                value={formData.loanPrincipal} 
                onChange={e => setFormData({...formData, loanPrincipal: e.target.value})}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:ring-2 focus:ring-accent/40 font-bold transition-all"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.4em]">APR %</label>
              <input 
                type="number" 
                placeholder="8.5" 
                value={formData.loanInterest} 
                onChange={e => setFormData({...formData, loanInterest: e.target.value})}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:ring-2 focus:ring-accent/40 font-bold transition-all"
              />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Strategic Objectives",
      subtitle: "Define your primary financial target.",
      icon: <Target className="text-accent" size={24} />,
      content: (
        <div className="space-y-6">
           <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em]">Objective Title</label>
            <input 
              type="text" 
              placeholder="e.g. Retirement Fund" 
              value={formData.primaryGoal} 
              onChange={e => setFormData({...formData, primaryGoal: e.target.value})}
              className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:ring-2 focus:ring-accent/40 font-bold transition-all"
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em]">Target Accumulation</label>
            <input 
              type="number" 
              placeholder="10,000,000" 
              value={formData.goalTarget} 
              onChange={e => setFormData({...formData, goalTarget: e.target.value})}
              className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:ring-2 focus:ring-accent/40 font-black text-2xl text-accent transition-all"
            />
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "Financial Velocity",
      subtitle: "Configure recurring cashflows.",
      icon: <TrendingUp className="text-accent" size={24} />,
      content: (
        <div className="space-y-6">
           <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em]">Est. Monthly Inflow</label>
            <input 
              type="number" 
              placeholder="0.00" 
              value={formData.monthlyIncome} 
              onChange={e => setFormData({...formData, monthlyIncome: e.target.value})}
              className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:ring-2 focus:ring-accent/40 font-bold transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em]">Monthly SIP</label>
              <input 
                type="number" 
                placeholder="0" 
                value={formData.sipAmount} 
                onChange={e => setFormData({...formData, sipAmount: e.target.value})}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:ring-2 focus:ring-accent/40 font-bold transition-all"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em]">Credit Card Limit</label>
              <input 
                type="number" 
                placeholder="0" 
                value={formData.creditCardLimit} 
                onChange={e => setFormData({...formData, creditCardLimit: e.target.value})}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:ring-2 focus:ring-accent/40 font-bold transition-all"
              />
            </div>
          </div>
        </div>
      )
    }
  ];

  const currStep = steps.find(s => s.id === step);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-2xl bg-black/80 animate-in fade-in duration-500">
      <div className="w-full max-w-xl bg-[#0a0a0a] border border-white/10 rounded-[3rem] shadow-[0_0_100px_rgba(16,185,129,0.1)] overflow-hidden relative">
         {/* Top Progress Bar */}
         <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
            <div 
              className="h-full bg-accent transition-all duration-700" 
              style={{ width: `${(step / steps.length) * 100}%` }}
            />
         </div>

         <div className="p-12 space-y-10">
            <div className="flex items-start justify-between">
               <div className="space-y-2">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-accent/10 rounded-lg">{currStep.icon}</div>
                     <span className="text-[10px] font-black uppercase text-accent tracking-[0.4em]">Protocol 0{step} / 0{steps.length}</span>
                  </div>
                  <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">{currStep.title}</h2>
                  <p className="text-gray-500 text-sm font-medium">{currStep.subtitle}</p>
               </div>
               <div className="bg-white/5 p-4 rounded-[2rem] border border-white/5 hidden sm:block">
                  <Sparkles size={24} className="text-accent animate-pulse" />
               </div>
            </div>

            <div className="animate-in slide-in-from-right-4 duration-500 min-h-[120px]">
               {currStep.content}
            </div>

            <div className="flex items-center gap-4 pt-4">
               {step > 1 && (
                  <button 
                    onClick={() => setStep(step - 1)}
                    className="flex-1 py-5 rounded-2xl bg-white/5 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5"
                  >
                    Previous Schema
                  </button>
               )}
               <button 
                  disabled={step === 1 && !formData.name}
                  onClick={() => step < steps.length ? setStep(step + 1) : handleComplete()}
                  className="flex-[2] py-5 rounded-2xl bg-accent text-black text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-accent/20 flex items-center justify-center gap-3 disabled:opacity-30 disabled:hover:scale-100"
               >
                  {step === steps.length ? (
                    <>Establish Parameters <Check size={16} /></>
                  ) : (
                    <>Navigate Next <ArrowRight size={16} /></>
                  )}
               </button>
            </div>
         </div>

         <div className="px-12 py-6 bg-white/[0.02] border-t border-white/5 flex items-center justify-center gap-6">
            <div className="flex gap-1.5">
               {steps.map(s => (
                  <div key={s.id} className={`w-8 h-1 rounded-full transition-all duration-500 ${s.id === step ? 'bg-accent' : s.id < step ? 'bg-accent/40' : 'bg-white/10'}`} />
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default OnboardingModal;
