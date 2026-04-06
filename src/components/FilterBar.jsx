import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import useStore from '../store/useStore';

const FilterBar = () => {
  const { filters, setFilters, resetFilters } = useStore();

  return (
    <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-accent transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search descriptions or categories..."
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-transparent focus:bg-white dark:focus:bg-gray-900 focus:border-accent/30 rounded-2xl outline-none focus:ring-4 focus:ring-accent/5 transition-all text-sm font-medium"
            aria-label="Search transactions"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Type Selector */}
          <select
            value={filters.type}
            onChange={(e) => setFilters({ type: e.target.value })}
            className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-transparent focus:bg-white dark:focus:bg-gray-900 focus:border-accent/30 rounded-2xl outline-none focus:ring-4 focus:ring-accent/5 transition-all text-sm font-bold cursor-pointer min-w-[120px]"
            aria-label="Filter by transaction type"
          >
            <option value="All">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          {/* Date Range Group */}
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 border border-transparent p-1.5 rounded-2xl">
            <input
              type="date"
              value={filters.dateRange.from}
              onChange={(e) => setFilters({ dateRange: { ...filters.dateRange, from: e.target.value } })}
              className="bg-transparent border-none outline-none text-xs font-black px-2 py-1 text-gray-700 dark:text-gray-300 focus:ring-0 cursor-pointer"
              aria-label="Filter from date"
            />
            <span className="text-gray-300 dark:text-gray-600 font-bold" aria-hidden="true">—</span>
            <input
              type="date"
              value={filters.dateRange.to}
              onChange={(e) => setFilters({ dateRange: { ...filters.dateRange, to: e.target.value } })}
              className="bg-transparent border-none outline-none text-xs font-black px-2 py-1 text-gray-700 dark:text-gray-300 focus:ring-0 cursor-pointer"
              aria-label="Filter to date"
            />
          </div>

          {/* Reset Button */}
          <button 
            onClick={resetFilters}
            className="btn-primary text-[10px] uppercase tracking-widest px-4 py-2"
            aria-label="Reset all search filters"
          >
            <RotateCcw size={14} aria-hidden="true" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
