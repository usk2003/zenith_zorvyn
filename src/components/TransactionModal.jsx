import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, AlertCircle, Check, 
  Wallet, Landmark, Zap, TrendingUp, Bitcoin, 
  Plus, Minus, Delete, Calculator as CalcIcon,
  Calendar, Clock, FileText, ArrowRightLeft,
  ChevronDown, Settings
} from 'lucide-react';
import useStore from '../store/useStore';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../data/mockData';
import { formatCurrency } from '../utils/dashboardUtils';

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

const SectionHeader = ({ title, icon: Icon }) => (
  <div className="flex items-center gap-2 mb-4 mt-6 first:mt-0">
    <div className="p-1.5 bg-accent/10 text-accent rounded-lg"><Icon size={14} /></div>
    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">{title}</h3>
  </div>
);

const TransactionModal = ({ isOpen, onClose, onSave, initialData }) => {
  const { accounts } = useStore();
  const [showCalc, setShowCalc] = useState(false);
  const [formData, setFormData] = useState({
    type: 'expense',
    accountId: '',
    toAccountId: '', // for transfers
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    description: '',
    notes: ''
  });
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (initialData) {
      const [d, t] = initialData.date.split('T');
      setFormData({
        ...initialData,
        date: d || new Date().toISOString().split('T')[0],
        time: t ? t.slice(0, 5) : new Date().toTimeString().slice(0, 5)
      });
    } else {
      setFormData({
        type: 'expense',
        accountId: accounts[0]?.id || '',
        toAccountId: '',
        category: EXPENSE_CATEGORIES[0],
        amount: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 5),
        description: '',
        notes: ''
      });
    }
    setErrors([]);
  }, [initialData, isOpen, accounts]);

  const validate = () => {
    const newErrors = [];
    if (!formData.accountId) newErrors.push('Source account is required');
    if (formData.type === 'transfer' && !formData.toAccountId) newErrors.push('Destination account is required');
    if (formData.type === 'transfer' && formData.accountId === formData.toAccountId) newErrors.push('Cannot transfer to the same account');
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.push('Valid amount is required');
    if (!formData.category && formData.type !== 'transfer') newErrors.push('Category is required');
    if (!formData.description) newErrors.push('Description is required');
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      const finalData = {
        ...formData,
        amount: parseFloat(formData.amount),
        date: `${formData.date}T${formData.time}:00`
      };
      onSave(finalData);
      onClose();
    }
  };

  const handleCalcPress = (val) => {
    if (val === 'C') setFormData(prev => ({ ...prev, amount: '' }));
    else if (val === 'del') setFormData(prev => ({ ...prev, amount: prev.amount.toString().slice(0, -1) }));
    else if (val === '.' && formData.amount.toString().includes('.')) return;
    else setFormData(prev => ({ ...prev, amount: (prev.amount || '').toString() + val }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white dark:bg-gray-900 animate-in fade-in duration-300">
      <div className="w-full h-full flex flex-col relative animate-in slide-in-from-bottom-8 duration-500 max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="p-8 border-b border-gray-50 dark:border-gray-800/50 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              {initialData ? 'Update Intel' : 'Record Transaction'}
            </h2>
            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mt-2">Executive Entry Mode</p>
          </div>
          <button onClick={onClose} className="p-3 bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-2xl transition-all">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
          {errors.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl animate-in shake duration-300">
               {errors.map((err, i) => <p key={i} className="text-[10px] font-black uppercase text-red-500 tracking-widest flex items-center gap-2"><AlertCircle size={12} /> {err}</p>)}
            </div>
          )}

          {/* Type Toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl mb-8">
            {['expense', 'income', 'transfer'].map(t => (
              <button
                key={t}
                onClick={() => setFormData({ ...formData, type: t, category: t === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0] })}
                className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  formData.type === t ? 'bg-white dark:bg-gray-900 text-accent shadow-sm scale-[1.02]' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <SectionHeader title="Capital Intelligence" icon={Zap} />
          <div className="space-y-4">
             {/* Amount Input */}
             <div className="relative group">
                <input
                  type="number"
                  value={formData.amount}
                  onChange={e => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  className="w-full text-4xl font-black bg-gray-50 dark:bg-gray-800/50 p-6 rounded-[2rem] border-2 border-transparent focus:border-accent/30 outline-none text-center transition-all group-hover:bg-gray-100 dark:group-hover:bg-gray-800"
                />
                <button 
                  onClick={() => setShowCalc(!showCalc)}
                  className={`absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-2xl transition-all ${showCalc ? 'bg-accent text-white shadow-lg' : 'bg-white dark:bg-gray-700 text-gray-400 shadow-sm'}`}
                >
                  <CalcIcon size={20} />
                </button>
             </div>

             {showCalc && (
               <div className="grid grid-cols-4 gap-2 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-3xl animate-in zoom-in-95 duration-200">
                  {[1, 2, 3, 'C', 4, 5, 6, 'del', 7, 8, 9, '.', 0, '00'].map((btn, i) => (
                    <button
                      key={i}
                      onClick={() => handleCalcPress(btn.toString())}
                      className={`h-12 rounded-xl flex items-center justify-center text-sm font-black transition-all active:scale-95 ${
                        typeof btn === 'number' || btn === '00' || btn === '.'
                          ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white hover:bg-accent hover:text-white'
                          : btn === 'C' ? 'bg-red-50 dark:bg-red-900/10 text-red-500' : 'bg-accent/10 text-accent'
                      }`}
                    >
                      {btn === 'del' ? <Delete size={16} /> : btn}
                    </button>
                  ))}
               </div>
             )}

             {/* Account Selection */}
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                   <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 block ml-1">{formData.type === 'transfer' ? 'From Account' : 'Account'}</label>
                   <div className="relative">
                      <select 
                        value={formData.accountId}
                        onChange={e => setFormData({ ...formData, accountId: e.target.value })}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-accent/20 appearance-none text-xs font-black uppercase text-gray-700 dark:text-gray-200"
                      >
                        {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name} ({formatCurrency(acc.balance)})</option>)}
                      </select>
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-accent">
                        <AccountIcon type={accounts.find(a => a.id === formData.accountId)?.type} size={18} />
                      </div>
                      <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                   </div>
                </div>

                {formData.type === 'transfer' && (
                  <div className="animate-in slide-in-from-left-4 duration-300">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 block ml-1">To Account</label>
                    <div className="relative">
                        <select 
                          value={formData.toAccountId}
                          onChange={e => setFormData({ ...formData, toAccountId: e.target.value })}
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none text-xs font-black uppercase text-gray-700 dark:text-gray-200"
                        >
                          <option value="">Select Target</option>
                          {accounts.filter(a => a.id !== formData.accountId).map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                        </select>
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500">
                          <AccountIcon type={accounts.find(a => a.id === formData.toAccountId)?.type} size={18} />
                        </div>
                        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                )}
             </div>
          </div>

          {formData.type !== 'transfer' && (
            <>
              <SectionHeader title="Classification" icon={Settings} />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(formData.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFormData({ ...formData, category: cat })}
                    className={`px-4 py-3 rounded-xl border-2 text-[10px] font-black uppercase tracking-tight transition-all text-left truncate ${
                      formData.category === cat ? 'border-accent bg-accent text-white' : 'border-gray-50 dark:border-gray-800 hover:border-accent/20 text-gray-500'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </>
          )}

          <SectionHeader title="Temporal Schedule" icon={Calendar} />
          <div className="grid grid-cols-2 gap-4">
             <div className="relative">
                <input
                  type="date"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl outline-none focus:ring-2 focus:ring-accent/20 text-xs font-black"
                />
                <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" />
             </div>
             <div className="relative">
                <input
                  type="time"
                  value={formData.time}
                  onChange={e => setFormData({ ...formData, time: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl outline-none focus:ring-2 focus:ring-accent/20 text-xs font-black"
                />
                <Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" />
             </div>
          </div>

          <SectionHeader title="Record Details" icon={FileText} />
          <div className="space-y-4">
              <input
                type="text"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description (e.g. Salary, Rent, Netflix)"
                className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl outline-none focus:ring-2 focus:ring-accent/20 text-xs font-bold"
              />
              <textarea
                rows={3}
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional analytical notes..."
                className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl outline-none focus:ring-2 focus:ring-accent/20 text-xs font-medium resize-none shadow-inner"
              />
          </div>
        </div>

        {/* Footer */}
        <div className="p-10 border-t border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 flex gap-6">
          <button
            onClick={onClose}
            className="px-8 py-5 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all bg-gray-100 dark:bg-gray-800/50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 btn-primary shadow-xl shadow-accent/20 py-5 text-sm"
          >
            {initialData ? 'Update Intelligence' : 'Commit Entry'}
            <ArrowRightLeft size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;


