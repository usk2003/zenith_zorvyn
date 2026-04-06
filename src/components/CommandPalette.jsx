import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, 
  X, 
  Terminal, 
  LayoutDashboard, 
  ArrowRightLeft, 
  BarChart3, 
  ShieldCheck, 
  ShieldAlert, 
  UserCircle, 
  ArrowUp, 
  ArrowDown,
  Download,
  Zap
} from 'lucide-react';
import useStore from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import useTransactionActions from '../hooks/useTransactionActions';

const CommandPalette = ({ isOpen, setIsOpen }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { transactions, role, setRole } = useStore();
  const { isAdmin } = useTransactionActions();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const actions = useMemo(() => [
    { id: 'nav-dash', title: 'Go to Dashboard', section: 'Navigation', icon: <LayoutDashboard size={18} />, shortcut: 'D', run: () => navigate('/') },
    { id: 'nav-trans', title: 'Go to Transactions', section: 'Navigation', icon: <ArrowRightLeft size={18} />, shortcut: 'T', run: () => navigate('/transactions') },
    { id: 'nav-insights', title: 'Go to Insights', section: 'Navigation', icon: <BarChart3 size={18} />, shortcut: 'I', run: () => navigate('/insights') },
    
    { id: 'role-admin', title: 'Switch to Admin Role', section: 'Security', icon: <ShieldCheck size={18} />, run: () => setRole('admin') },
    { id: 'role-viewer', title: 'Switch to Viewer Role', section: 'Security', icon: <UserCircle size={18} />, run: () => setRole('viewer') },
    
    { id: 'action-add', title: 'Add New Transaction', section: 'Actions', icon: <Plus size={18} />, run: () => navigate('/transactions?add=true'), hidden: !isAdmin },
  ].filter(a => !a.hidden), [navigate, setRole, isAdmin]);

  const results = useMemo(() => {
    if (!query) return actions;
    const lowerQuery = query.toLowerCase();
    
    // Search actions
    const filteredActions = actions.filter(a => 
      a.title.toLowerCase().includes(lowerQuery) || 
      a.section.toLowerCase().includes(lowerQuery)
    );

    // Search recent transactions (limit 3)
    const filteredTransactions = transactions
      .filter(t => t.description.toLowerCase().includes(lowerQuery))
      .slice(0, 3)
      .map(t => ({
        id: `t-${t.id}`,
        title: t.description,
        section: 'Transactions',
        icon: <ArrowRightLeft size={18} />,
        run: () => navigate('/transactions')
      }));

    return [...filteredActions, ...filteredTransactions];
  }, [query, actions, transactions, navigate]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      results[selectedIndex].run();
      setIsOpen(false);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[110] flex items-start justify-center p-4 sm:p-20 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300"
      onClick={() => setIsOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="command-palette-title"
    >
      <div 
        className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-3xl shadow-2xl shadow-black/40 overflow-hidden animate-in zoom-in-95 duration-200 border border-white/20"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative flex items-center border-b border-gray-100 dark:border-gray-800 p-4">
          <Search size={20} className="text-gray-400 ml-2" aria-hidden="true" />
          <h2 id="command-palette-title" className="sr-only">Command Palette</h2>
          <input
            ref={inputRef}
            autoFocus
            type="text"
            placeholder="Type a command or search transactions..."
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent border-none outline-none px-4 py-2 text-lg font-bold text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded="true"
            aria-controls="command-list"
            aria-activedescendant={results[selectedIndex] ? `command-item-${results[selectedIndex].id}` : undefined}
          />
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-widest border border-gray-100 dark:border-gray-700">
            Esc
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2" id="command-list" role="listbox">
          {results.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-sm font-bold text-gray-400">No results found for "{query}"</p>
            </div>
          ) : (
            results.map((item, idx) => (
              <button
                key={item.id}
                id={`command-item-${item.id}`}
                onClick={() => { item.run(); setIsOpen(false); }}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left outline-none ${
                   idx === selectedIndex 
                    ? 'bg-accent text-white shadow-xl shadow-accent/20 scale-[1.01]' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                role="option"
                aria-selected={idx === selectedIndex}
              >
                <div className={`p-2.5 rounded-xl ${
                  idx === selectedIndex ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                }`}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black truncate">{item.title}</p>
                  <p className={`text-[10px] uppercase font-bold tracking-tight opacity-70 ${
                    idx === selectedIndex ? 'text-white' : 'text-gray-400'
                  }`}>
                    {item.section}
                  </p>
                </div>
                {item.shortcut && (
                  <div className={`px-2 py-1 rounded-lg text-[9px] font-black border transition-colors ${
                    idx === selectedIndex ? 'border-white/40 text-white' : 'border-gray-100 dark:border-gray-700 text-gray-400'
                  }`}>
                    {item.shortcut}
                  </div>
                )}
              </button>
            ))
          )}
        </div>

        <div className="p-4 bg-gray-50/50 dark:bg-gray-950/50 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[10px] font-black text-gray-400 px-6 uppercase tracking-widest">
           <div className="flex items-center gap-4">
             <span className="flex items-center gap-1.5"><ArrowUp size={12} /> <ArrowDown size={12} /> Navigate</span>
             <span className="flex items-center gap-1.5"><X size={12} className="rotate-45" /> Select</span>
           </div>
           <p>Zenith Executive Panel</p>
        </div>
      </div>
    </div>
  );
};

const Plus = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M5 12h14"/><path d="M12 5v14"/>
  </svg>
);

export default CommandPalette;
