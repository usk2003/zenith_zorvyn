import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  X, AlertCircle, Check, 
  Wallet, Landmark, Zap, TrendingUp, Bitcoin, 
  Plus, Minus, Delete, Calculator as CalcIcon,
  Calendar, Clock, FileText, ArrowRightLeft,
  ChevronDown, Settings, ArrowLeft, ArrowRight,
  Utensils, Car, Film, ShoppingBag, HeartPulse, Home, GraduationCap, Repeat, Gift, Briefcase, MinusCircle, PlusCircle, ChevronRight, Hash, Database
} from 'lucide-react';
import useStore from '../store/useStore';
import { formatCurrency } from '../utils/dashboardUtils';
import useTransactionActions from '../hooks/useTransactionActions';

const AccountIcon = ({ type, ...props }) => {
  switch (type) {
    case 'Bank': return <Landmark {...props} />;
    case 'UPI': return <Zap {...props} />;
    case 'Demat': return <TrendingUp {...props} />;
    case 'Coins': return <Bitcoin {...props} />;
    case 'Cash':
    default: return <Wallet {...props} />;
  }
};

const getCategoryIcon = (category) => {
  const mapping = {
    'Salary': Wallet, 'Freelance': Briefcase, 'Investment': TrendingUp,
    'Gift': Gift, 'Gifts': Gift, 'Other': PlusCircle,
    'Food': Utensils, 'Transport': Car, 'Utilities': Zap,
    'Entertainment': Film, 'Shopping': ShoppingBag, 'Healthcare': HeartPulse,
    'Rent': Home, 'Education': GraduationCap, 'Subscriptions': Repeat
  };
  const Icon = mapping[category] || MinusCircle;
  return <Icon size={18} />;
};

const NewTransaction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accounts, transactions, incomeCategories, expenseCategories, addCategory, removeCategory, currency } = useStore();
  const { add, update } = useTransactionActions();
  
  const [showCalc, setShowCalc] = useState(false);
  const [formData, setFormData] = useState({
    type: 'expense', accountId: '', toAccountId: '',
    category: '', amount: '', date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5), description: '', notes: ''
  });
  
  const [calcDisplay, setCalcDisplay] = useState('');
  const [errors, setErrors] = useState([]);

  const categories = useMemo(() => {
    return formData.type === 'income' ? incomeCategories : expenseCategories;
  }, [formData.type, incomeCategories, expenseCategories]);

  useEffect(() => {
    if (id) {
      const existing = transactions.find(t => t.id === id);
      if (existing) {
        const [d, t] = existing.date.split('T');
        setFormData({
          ...existing,
          date: d || new Date().toISOString().split('T')[0],
          time: t ? t.slice(0, 5) : new Date().toTimeString().slice(0, 5)
        });
        setCalcDisplay(existing.amount.toString());
      }
    } else {
      const defaultAcc = accounts[0]?.id || '';
      setFormData(f => ({ ...f, accountId: defaultAcc, category: expenseCategories[0] || 'Other' }));
    }
  }, [id, accounts, transactions, expenseCategories]);

  const handleAddCategory = () => {
    const name = window.prompt(`Enter new ${formData.type} category name:`);
    if (name && name.trim()) {
      addCategory(formData.type, name.trim());
      setFormData(f => ({ ...f, category: name.trim() }));
    }
  };

  const handleRemoveCategory = (e, cat) => {
    e.stopPropagation();
    if (window.confirm(`Prune category "${cat}"?`)) {
      removeCategory(formData.type, cat);
      if (formData.category === cat) setFormData(f => ({ ...f, category: categories[0] || 'Other' }));
    }
  };

  const validate = () => {
    const newErrors = [];
    if (!formData.accountId) newErrors.push('Account Required');
    if (formData.type === 'transfer' && !formData.toAccountId) newErrors.push('Target Account Required');
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.push('Capital Value Required');
    if (!formData.category && formData.type !== 'transfer') newErrors.push('Classification Required');
    if (!formData.description) newErrors.push('Audit Context Required');
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      const finalData = { 
        ...formData, 
        amount: parseFloat(formData.amount), 
        date: `${formData.date}T${formData.time}:00`,
        // Mapping for store-side transfer logic
        fromAccount: formData.type === 'transfer' ? formData.accountId : undefined,
        toAccount: formData.type === 'transfer' ? formData.toAccountId : undefined
      };
      if (id) update({ ...finalData, id }); else add(finalData);
      navigate(-1);
    }
  };

  const handleCalcPress = (val) => {
    if (val === 'C') { setCalcDisplay(''); setFormData(f => ({ ...f, amount: '' })); }
    else if (val === 'del') {
      const newD = calcDisplay.slice(0, -1); setCalcDisplay(newD);
      try { if (newD && !isNaN(eval(newD))) setFormData(f => ({ ...f, amount: eval(newD).toString() })); } catch(e) {}
    } else if (val === '=') {
      try { const r = eval(calcDisplay); setCalcDisplay(r.toString()); setFormData(f => ({ ...f, amount: r.toString() })); } catch(e) { setErrors(['Calc Error']); }
    } else {
      const nD = calcDisplay + val; setCalcDisplay(nD);
      try { const r = eval(nD); if (!isNaN(r) && isFinite(r)) setFormData(f => ({ ...f, amount: r.toString() })); } catch(e) {}
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950/20 text-gray-900 dark:text-gray-100 font-sans selection:bg-accent/30 selection:text-accent pb-24">
       <div className="max-w-6xl mx-auto px-6 py-8 space-y-6 animate-in fade-in duration-700">

          <header className="flex items-center justify-between bg-white dark:bg-gray-900 p-4 px-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
             <div className="flex items-center gap-6">
                <button onClick={() => navigate(-1)} className="p-2 text-gray-400 hover:text-red-500 transition-all"><ArrowLeft size={20} /></button>
                <div>
                   <span className="text-[8px] font-black text-accent uppercase tracking-[0.3em] block leading-tight">Executive Control</span>
                   <h1 className="text-xl font-black tracking-tight opacity-90 leading-tight">{id ? 'Refine Intelligence' : 'Commit Record'}</h1>
                </div>
             </div>
             <div className="flex bg-gray-50 dark:bg-gray-800/50 p-1 rounded-xl border border-gray-100 dark:border-gray-700">
                {['expense', 'income', 'transfer'].map(t => (
                  <button
                    key={t}
                    onClick={() => setFormData(f => ({ ...f, type: t, category: t === 'income' ? incomeCategories[0] : expenseCategories[0] }))}
                    className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                      formData.type === t ? 'bg-accent text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {t}
                  </button>
                ))}
             </div>
          </header>

          <section className="bg-white dark:bg-gray-900 p-1 pr-6 rounded-full border border-gray-100 dark:border-gray-800 shadow-[0_20px_60px_rgba(0,0,0,0.04)] flex items-center gap-6 group focus-within:ring-2 focus-within:ring-accent/10 transition-all">
             <div className="flex items-center gap-3 bg-accent/5 dark:bg-accent/10 p-3 px-8 rounded-full">
                <span className="text-2xl font-black text-accent">{currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£'}</span>
                <input 
                  type="text"
                  inputMode="decimal"
                  value={calcDisplay}
                  placeholder="0"
                  onChange={(e) => {
                     const val = e.target.value;
                     if (/^[0-9+\-*/().\s]*$/.test(val)) {
                        setCalcDisplay(val);
                        try {
                           const r = eval(val.replace(/\s/g, ''));
                           if (!isNaN(r)) setFormData(f => ({ ...f, amount: r.toString() }));
                        } catch(e) {}
                     }
                  }}
                  className="bg-transparent text-2xl font-black outline-none w-48 text-gray-900 dark:text-white placeholder-gray-100 dark:placeholder-gray-800"
                />
             </div>
             <div className="flex-1 text-[10px] font-black uppercase tracking-widest text-gray-300 dark:text-gray-600">
                Live Asset Evaluation: <span className="text-accent underline decoration-accent/20 underline-offset-4">{formatCurrency(formData.amount || 0, currency)}</span>
             </div>
             <button 
               onClick={() => setShowCalc(!showCalc)}
               className={`p-3 rounded-full transition-all ${showCalc ? 'bg-accent text-white shadow-xl' : 'text-gray-400 hover:text-accent'}`}
             >
               <CalcIcon size={20} />
             </button>
          </section>

          {showCalc && (
             <div className="grid grid-cols-10 gap-2 p-4 bg-white/40 dark:bg-gray-950/40 backdrop-blur-2xl rounded-[1.5rem] border border-white/20 dark:border-gray-800 shadow-2xl animate-in zoom-in-95 duration-300">
                {[1, 2, 3, '+', 4, 5, 6, '-', 7, 8, 9, '*', 'C', 0, '.', '/', 'del', '(', ')', '='].map(b => (
                  <button
                    key={b}
                    onClick={() => handleCalcPress(b.toString())}
                    className={`h-12 rounded-lg flex items-center justify-center text-xs font-black transition-all active:scale-95 ${
                      typeof b === 'number' || b === '.' ? 'bg-white dark:bg-gray-800' : 'bg-accent/10 text-accent'
                    } ${b === '=' ? 'bg-accent text-white shadow-lg' : ''}`}
                  >
                    {b === 'del' ? <Delete size={14} /> : b}
                  </button>
                ))}
             </div>
          )}

          {/* Executive Selection Stack */}
          <div className="space-y-6">
             
             {/* Capital Reserve: Horizontal Scrolling Strip */}
             <section className="bg-white dark:bg-gray-900 rounded-[2rem] p-4 px-6 border border-gray-100 dark:border-gray-800 shadow-sm animate-in fade-in slide-in-from-left-8 duration-700 delay-200">
                <div className="flex items-center justify-between mb-4 px-2">
                   <div className="flex items-center gap-4">
                      <div className="p-1.5 bg-accent/10 text-accent rounded-md"><Database size={14} /></div>
                      <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                         {formData.type === 'transfer' ? 'From Account (Source)' : 'Capital Reserve'}
                      </h2>
                   </div>
                   <span className="text-[8px] font-black px-3 py-1 bg-accent/5 text-accent rounded-full ring-1 ring-accent/10 uppercase tracking-widest">Reserve Library</span>
                </div>

                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                   {accounts.map(acc => (
                     <button
                       key={acc.id}
                       onClick={() => setFormData(f => ({ ...f, accountId: acc.id }))}
                       className={`flex-none w-48 flex items-center gap-4 p-3 px-4 rounded-xl border transition-all relative ${
                         formData.accountId === acc.id 
                          ? 'border-accent bg-accent/5 shadow-sm' 
                          : 'border-gray-50 dark:border-gray-800 hover:border-accent/40 bg-white/50 dark:bg-gray-800/30'
                       }`}
                     >
                        <div className={`p-2 rounded-lg transition-all ${formData.accountId === acc.id ? 'bg-accent text-white shadow-md' : 'bg-gray-50 dark:bg-gray-800 text-accent'}`}>
                           <AccountIcon type={acc.type} size={14} />
                        </div>
                        <div className="text-left flex-1 min-w-0">
                           <p className="text-[10px] font-black text-gray-900 dark:text-white truncate leading-tight">{acc.name}</p>
                           <p className="text-[8px] font-bold text-accent">{formatCurrency(acc.balance, currency)}</p>
                        </div>
                        {formData.accountId === acc.id && <div className="absolute top-2 right-2 text-accent animate-in zoom-in-50"><Check size={12} strokeWidth={4} /></div>}
                     </button>
                   ))}
                </div>
             </section>

             {/* Classification & Context Column */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr] gap-6 items-start">
               {/* Classification Matrix */}
               <section className="bg-white dark:bg-gray-900 rounded-[2rem] p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4 animate-in fade-in slide-in-from-right-8 duration-700 delay-300">
                  {formData.type === 'transfer' ? (
                     <>
                        <div className="flex items-center gap-4 mb-2">
                           <div className="p-1.5 bg-blue-500/10 text-blue-500 rounded-md"><ArrowRightLeft size={14} /></div>
                           <h2 className="text-[10px] font-black uppercase tracking-widest text-blue-500 opacity-60">To Account (Destination)</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                           {accounts.filter(a => a.id !== formData.accountId).map(acc => (
                              <button
                                key={acc.id}
                                onClick={() => setFormData(f => ({ ...f, toAccountId: acc.id }))}
                                className={`flex items-center gap-4 p-3 px-4 rounded-xl border transition-all ${
                                  formData.toAccountId === acc.id ? 'border-blue-500 bg-blue-500/5 shadow-sm' : 'border-gray-50 dark:border-gray-800 hover:border-blue-500/40 bg-white/50 dark:bg-gray-800/30'
                                }`}
                              >
                                 <div className={`p-2 rounded-lg ${formData.toAccountId === acc.id ? 'bg-blue-500 text-white' : 'bg-gray-50 dark:bg-gray-800 text-blue-500'}`}>
                                    <AccountIcon type={acc.type} size={14} />
                                 </div>
                                 <div className="text-left flex-1 min-w-0">
                                    <p className="text-[10px] font-black text-gray-900 dark:text-white truncate">{acc.name}</p>
                                    <p className="text-[9px] font-bold text-blue-500 opacity-70">{formatCurrency(acc.balance, currency)}</p>
                                 </div>
                                 {formData.toAccountId === acc.id && <Check size={14} className="text-blue-500" />}
                              </button>
                           ))}
                        </div>
                     </>
                  ) : (
                     <>
                        <div className="flex items-center justify-between mb-2">
                           <div className="flex items-center gap-4">
                              <div className="p-1.5 bg-accent/10 text-accent rounded-md"><Settings size={14} /></div>
                              <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Classification Matrix</h2>
                           </div>
                           <button onClick={handleAddCategory} className="text-[8px] font-black uppercase tracking-widest text-accent hover:underline flex items-center gap-2">
                              <PlusCircle size={12} /> New
                           </button>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                           {categories.map(cat => (
                              <button
                                key={cat}
                                onClick={() => setFormData(f => ({ ...f, category: cat }))}
                                className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all relative group h-16 ${
                                  formData.category === cat 
                                   ? 'bg-accent text-white shadow-md scale-[1.03]' 
                                   : 'bg-gray-50/50 dark:bg-gray-800/30 text-gray-400 hover:bg-white dark:hover:bg-gray-900 border border-transparent hover:border-accent/20'
                                }`}
                              >
                                 <div className={`transition-all mb-1 ${formData.category === cat ? 'scale-110' : 'group-hover:rotate-12'}`}>
                                    {getCategoryIcon(cat)}
                                 </div>
                                 <span className="text-[7px] font-bold uppercase tracking-tighter truncate w-full text-center px-1 leading-none">{cat}</span>
                                 <button onClick={(e) => handleRemoveCategory(e,cat)} className="absolute -top-1 -right-1 p-0.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <X size={8} />
                                 </button>
                              </button>
                           ))}
                        </div>
                     </>
                  )}
               </section>
               
               {/* Metadata Integrated Sidebar */}
               <div className="space-y-6">
                  <section className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
                     <div className="flex items-center gap-4">
                        <FileText size={14} className="text-accent" />
                        <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Contextual Node</h2>
                     </div>
                     <div className="space-y-4">
                        <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-2xl border border-gray-100 dark:border-gray-800 focus-within:ring-2 focus-within:ring-accent/10 transition-all">
                           <Calendar size={14} className="text-accent opacity-60" />
                           <input type="date" value={formData.date} onChange={e => setFormData(f => ({ ...f, date: e.target.value }))} className="bg-transparent border-none outline-none text-[10px] font-black uppercase flex-1" />
                        </div>
                        <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-2xl border border-gray-100 dark:border-gray-800 focus-within:ring-2 focus-within:ring-accent/10 transition-all">
                           <Clock size={14} className="text-accent opacity-60" />
                           <input type="time" value={formData.time} onChange={e => setFormData(f => ({ ...f, time: e.target.value }))} className="bg-transparent border-none outline-none text-[10px] font-black flex-1" />
                        </div>
                        <div className="flex items-center gap-4 bg-white dark:bg-gray-900 p-3 rounded-2xl border-2 border-gray-100 dark:border-gray-800 focus-within:border-accent transition-all">
                           <Hash size={14} className="text-accent" />
                           <input 
                             type="text" 
                             value={formData.description} 
                             onChange={e => setFormData(f => ({ ...f, description: e.target.value }))} 
                             placeholder="Audit Context..." 
                             className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-widest w-full placeholder-gray-300"
                           />
                        </div>
                     </div>
                  </section>
               </div>
             </div>
          </div>


          <div className="flex items-center justify-between p-4 px-8 bg-gray-900 dark:bg-accent rounded-full text-white shadow-2xl animate-in slide-in-from-bottom-6 duration-700 delay-300">
             <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest opacity-60">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                Validation Synchronized
             </div>
             <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-3 px-6 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 rounded-xl transition-all">Discard Changes</button>
                <button 
                  onClick={handleSave} 
                  className="bg-white text-gray-900 group flex items-center gap-4 p-4 px-10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
                >
                  Commit Capital Record <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
             </div>
          </div>

       </div>
    </div>
  );
};

export default NewTransaction;
