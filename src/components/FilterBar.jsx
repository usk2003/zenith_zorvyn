import React from 'react';
import { Search, RotateCcw, Plus } from 'lucide-react';
import useStore from '../store/useStore';

const FilterBar = () => {
  const { filters, setFilters, resetFilters } = useStore();

  return (
    <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-emerald-500/10 dark:bg-black dark:border-emerald-500/20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Search Bar */}
          <div className="relative flex-1 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-accent transition-all duration-300" size={20} />
            <input
              type="text"
              placeholder="Search descriptions or categories..."
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
              className="w-full pl-16 pr-8 py-5 bg-gray-50 dark:bg-white/[0.03] border border-transparent focus:bg-white dark:focus:bg-black focus:border-accent/30 rounded-full outline-none focus:ring-4 focus:ring-accent/5 transition-all text-sm font-bold text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-inner"
              aria-label="Search transactions"
            />
          </div>

          {/* Filters & Actions Group */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Type Selector */}
            <div className="relative group/select">
              <select
                value={filters.type}
                onChange={(e) => setFilters({ type: e.target.value })}
                className="appearance-none px-8 py-5 bg-gray-50 dark:bg-white/[0.03] border border-transparent focus:bg-white dark:focus:bg-black focus:border-accent/30 rounded-full outline-none focus:ring-4 focus:ring-accent/5 transition-all text-sm font-black cursor-pointer min-w-[160px] text-gray-900 dark:text-white pr-12"
                aria-label="Filter by transaction type"
              >
                <option value="All" className="dark:bg-black">All Types</option>
                <option value="income" className="dark:bg-black">Income</option>
                <option value="expense" className="dark:bg-black">Expense</option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover/select:text-accent transition-colors">
                <Plus size={14} className="rotate-45" />
              </div>
            </div>

            {/* Date Range Group */}
            <div className="flex items-center gap-4 bg-gray-50 dark:bg-white/[0.03] border border-transparent px-6 py-2 rounded-full">
              <input
                type="date"
                value={filters.dateRange.from}
                onChange={(e) => setFilters({ dateRange: { ...filters.dateRange, from: e.target.value } })}
                className="bg-transparent border-none outline-none text-xs font-black py-2 text-gray-900 dark:text-white focus:ring-0 cursor-pointer"
                aria-label="Filter from date"
              />
              <span className="text-gray-300 dark:text-gray-600 font-bold" aria-hidden="true">—</span>
              <input
                type="date"
                value={filters.dateRange.to}
                onChange={(e) => setFilters({ dateRange: { ...filters.dateRange, to: e.target.value } })}
                className="bg-transparent border-none outline-none text-xs font-black py-2 text-gray-900 dark:text-white focus:ring-0 cursor-pointer"
                aria-label="Filter to date"
              />
            </div>

            <div className="flex items-center gap-3">
               {/* Apply/Search Button */}
               <button 
                 className="px-8 py-5 bg-accent text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:scale-105 hover:shadow-lg hover:shadow-accent/30 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl shadow-accent/10"
                 aria-label="Apply search filters"
               >
                 <Search size={14} aria-hidden="true" />
                 Search
               </button>
               
               {/* Reset Button */}
               <button 
                 onClick={resetFilters}
                 className="p-5 bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-red-500 rounded-full transition-all active:scale-95 border border-transparent"
                 aria-label="Reset all search filters"
                 title="Reset Filters"
               >
                 <RotateCcw size={16} aria-hidden="true" />
               </button>
            </div>
          </div>
        </div>

        {/* Quick Category Tags */}
        <div className="space-y-4 pt-4 border-t border-emerald-500/10 dark:border-emerald-500/20">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-black uppercase text-income tracking-widest mr-2">Income:</span>
            {['Salary', 'Freelance', 'Investment', 'Dividends'].map(cat => (
              <button
                key={cat}
                onClick={() => {
                  const newCats = filters.categories.includes(cat)
                    ? filters.categories.filter(c => c !== cat)
                    : [...filters.categories, cat];
                  setFilters({ categories: newCats });
                }}
                className={`px-4 py-2 rounded-full text-[10px] font-bold transition-all active:scale-95 ${
                  filters.categories.includes(cat)
                    ? 'bg-income text-black shadow-lg shadow-income/20'
                    : 'bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-black uppercase text-expense tracking-widest mr-2">Expense:</span>
            {['Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping', 'Healthcare', 'Rent'].map(cat => (
              <button
                key={cat}
                onClick={() => {
                  const newCats = filters.categories.includes(cat)
                    ? filters.categories.filter(c => c !== cat)
                    : [...filters.categories, cat];
                  setFilters({ categories: newCats });
                }}
                className={`px-4 py-2 rounded-full text-[10px] font-bold transition-all active:scale-95 ${
                  filters.categories.includes(cat)
                    ? 'bg-expense text-white shadow-lg shadow-expense/20'
                    : 'bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
