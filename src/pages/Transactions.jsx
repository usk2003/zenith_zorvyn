import React, { useMemo, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  ChevronUp, 
  ChevronDown, 
  ArrowUpDown, 
  Tag, 
  Info,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Plus,
  Pencil,
  Trash2,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import useStore from '../store/useStore';
import FilterBar from '../components/FilterBar';
import { formatCurrency } from '../utils/dashboardUtils';
import useTransactionActions from '../hooks/useTransactionActions';
import useConfetti from '../hooks/useConfetti';
import { useNavigate } from 'react-router-dom';

import Skeleton from '../components/Skeleton';
import useInitialLoading from '../hooks/useInitialLoading';

const Transactions = () => {
  const { transactions, filters, setFilters, resetFilters, role, currency } = useStore();
  const isAdmin = role === 'admin';
  const { remove } = useTransactionActions();
  const { fire } = useConfetti();
  const navigate = useNavigate();
  const isLoading = useInitialLoading(800);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [jumpPage, setJumpPage] = useState('');
  const itemsPerPage = 10;

  // 1. Filtering & Sorting Logic
  const filteredAndSortedTransactions = useMemo(() => {
    let results = [...transactions];

    if (filters.search) {
      const query = filters.search.toLowerCase();
      results = results.filter(t => 
        t.description.toLowerCase().includes(query) || 
        t.category.toLowerCase().includes(query)
      );
    }

    if (filters.type !== 'All') {
      results = results.filter(t => t.type === filters.type);
    }

    if (filters.categories.length > 0) {
      results = results.filter(t => filters.categories.includes(t.category));
    }

    if (filters.dateRange.from) {
      results = results.filter(t => new Date(t.date) >= new Date(filters.dateRange.from));
    }
    if (filters.dateRange.to) {
      results = results.filter(t => new Date(t.date) <= new Date(filters.dateRange.to));
    }

    const { sortBy, sortOrder } = filters;
    results.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (sortBy === 'date') {
        valA = new Date(a.date).getTime();
        valB = new Date(b.date).getTime();
      }

      const modifier = sortOrder === 'asc' ? 1 : -1;
      if (valA < valB) return -1 * modifier;
      if (valA > valB) return 1 * modifier;
      return 0;
    });

    return results;
  }, [transactions, filters]);

  // 2. Pagination Logic
  const totalPages = Math.ceil(filteredAndSortedTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredAndSortedTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getPaginationRange = () => {
    const delta = 1;
    const range = [];
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range.unshift("...");
    }
    if (currentPage + delta < totalPages - 1) {
      range.push("...");
    }

    range.unshift(1);
    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  };

  const handleSort = (field) => {
    const isSameField = filters.sortBy === field;
    const newOrder = isSameField && filters.sortOrder === 'desc' ? 'asc' : 'desc';
    setFilters({ sortBy: field, sortOrder: newOrder });
  };

  const SortIcon = ({ field }) => {
    if (filters.sortBy !== field) return <ArrowUpDown size={12} className="ml-1 opacity-20" />;
    return filters.sortOrder === 'desc' ? <ChevronDown size={12} className="ml-1 text-white" /> : <ChevronUp size={12} className="ml-1 text-white" />;
  };

  const handleJumpPage = (e) => {
    e.preventDefault();
    const pageNum = parseInt(jumpPage);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      setJumpPage('');
    } else if (pageNum > totalPages) {
      setCurrentPage(totalPages);
      setJumpPage('');
    } else if (pageNum < 1) {
      setCurrentPage(1);
      setJumpPage('');
    }
  };
  
  const handleAdd = () => {
    navigate('/transactions/new');
  };

  const handleEdit = (t) => {
    navigate(`/transactions/edit/${t.id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      remove(id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            {isLoading ? <Skeleton className="h-9 w-64 rounded-xl" /> : 'Transaction History'}
          </div>
          <div className="text-gray-500 dark:text-gray-400 mt-1">
            {isLoading ? <Skeleton className="h-4 w-48 mt-2 rounded-lg" /> : 'View and manage your transaction history.'}
          </div>
        </div>
        {isAdmin && !isLoading && (
          <button 
            onClick={handleAdd}
            className="btn-primary"
            aria-label="Add new transaction"
          >
            <Plus size={20} />
            Add Transaction
          </button>
        )}
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
        <FilterBar />
      </div>

      {/* Transactions Container */}
      <div className="bg-white dark:bg-black rounded-[2.5rem] border border-emerald-500/10 dark:border-emerald-500/20 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-2xl" />
            ))}
          </div>
        ) : paginatedTransactions.length === 0 ? (
          <div className="p-20 text-center space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-full inline-block">
              <Info size={32} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">No matches found</h3>
            <p className="text-gray-500 max-w-xs mx-auto text-sm">Try adjusting your filters or search terms to find what you're looking for.</p>
            <button 
              onClick={resetFilters}
              className="text-accent font-bold text-sm hover:underline focus:outline-none"
              aria-label="Clear all filters"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left" role="grid" aria-label="Transactions Table">
                <thead>
                  <tr className="border-b border-emerald-500/10 dark:border-emerald-500/20 bg-gray-50/50 dark:bg-white/[0.02]">
                    <th 
                      className="p-5 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] cursor-pointer hover:text-accent transition-colors"
                      onClick={() => handleSort('date')}
                      aria-sort={filters.sortBy === 'date' ? (filters.sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
                    >
                      <div className="flex items-center">Date <SortIcon field="date" /></div>
                    </th>
                    <th className="p-5 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Description</th>
                    <th 
                      className="p-5 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] cursor-pointer hover:text-accent transition-colors"
                      onClick={() => handleSort('category')}
                      aria-sort={filters.sortBy === 'category' ? (filters.sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
                    >
                      <div className="flex items-center">Category <SortIcon field="category" /></div>
                    </th>
                    <th className="p-5 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Type</th>
                    <th 
                      className="p-5 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] cursor-pointer hover:text-accent transition-colors text-right"
                      onClick={() => handleSort('amount')}
                      aria-sort={filters.sortBy === 'amount' ? (filters.sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
                    >
                      <div className="flex items-center justify-end">Amount <SortIcon field="amount" /></div>
                    </th>
                    {isAdmin && <th className="p-5 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody role="rowgroup">
                  {paginatedTransactions.map((t, idx) => (
                    <tr 
                      key={t.id} 
                      className="border-b border-emerald-500/10 dark:border-emerald-500/20 hover:bg-gray-50/50 dark:hover:bg-white/[0.03] transition-all group animate-in fade-in slide-in-from-left-4 duration-700"
                      style={{ animationDelay: `${idx * 100}ms` }}
                      role="row"
                    >
                      <td className="p-5 text-xs text-gray-400 dark:text-gray-500 font-bold italic tracking-tighter" role="gridcell">{t.date?.split('T')[0]}</td>
                      <td className="p-5" role="gridcell">
                        <p className="text-sm font-black text-gray-900 dark:text-white uppercase italic tracking-tighter group-hover:text-accent transition-colors">{t.description}</p>
                      </td>
                      <td className="p-5" role="gridcell">
                        <span className="flex items-center gap-2 text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                          <Tag size={12} className="text-accent" aria-hidden="true" />
                          {t.category}
                        </span>
                      </td>
                      <td className="p-5" role="gridcell">
                        <span className={`text-[9px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-lg font-black inline-flex items-center gap-1.5 transition-all ${
                          t.type === 'income' ? 'bg-income/10 text-income' : 'bg-expense/10 text-expense'
                        }`}>
                          {t.type === 'income' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                          {t.type}
                        </span>
                      </td>
                      <td className={`p-4 text-sm font-black text-right ${t.type === 'income' ? 'text-income' : 'text-gray-900 dark:text-white'}`} role="gridcell">
                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount, currency)}
                      </td>
                      {isAdmin && (
                        <td className="p-4 text-right" role="gridcell">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleEdit(t)}
                              className="p-2 text-gray-400 hover:text-accent hover:bg-accent/5 rounded-xl transition-all"
                              aria-label={`Edit ${t.description}`}
                            >
                              <Pencil size={18} />
                            </button>
                            <button 
                              onClick={() => handleDelete(t.id)}
                              className="p-2 text-gray-400 hover:text-expense hover:bg-expense/5 rounded-xl transition-all"
                              aria-label={`Delete ${t.description}`}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="sm:hidden divide-y divide-emerald-500/10 dark:divide-emerald-500/20">
              {paginatedTransactions.map((t, idx) => (
                <div 
                  key={t.id} 
                  className="p-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 group hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors"
                  style={{ animationDelay: `${idx * 100}ms` }}
                  role="article"
                  aria-label={`Transaction: ${t.description}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-sm font-black text-gray-900 dark:text-white uppercase italic tracking-tighter group-hover:text-accent transition-colors">{t.description}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">{t.date?.split('T')[0]} • {t.category}</p>
                    </div>
                    <p className={`text-base font-black italic tracking-tighter ${t.type === 'income' ? 'text-income' : 'text-gray-900 dark:text-white'}`}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount, currency)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-lg font-black inline-flex items-center gap-1.5 ${
                      t.type === 'income' ? 'bg-income/10 text-income' : 'bg-expense/10 text-expense'
                    }`}>
                      {t.type === 'income' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                      {t.type}
                    </span>
                    {isAdmin && (
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(t)} className="p-2.5 bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-accent rounded-xl transition-all" aria-label={`Edit ${t.description}`}><Pencil size={18}/></button>
                        <button onClick={() => handleDelete(t.id)} className="p-2.5 bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-expense rounded-xl transition-all" aria-label={`Delete ${t.description}`}><Trash2 size={18}/></button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pb-10 animate-in fade-in duration-1000 delay-300">
          <p className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-widest">
            Audit Range: <span className="text-gray-900 dark:text-white">{(currentPage - 1) * itemsPerPage + 1}—{Math.min(currentPage * itemsPerPage, filteredAndSortedTransactions.length)}</span> of <span className="text-gray-900 dark:text-white">{filteredAndSortedTransactions.length}</span>
          </p>
          <div className="flex items-center gap-3">
            {/* Jump to Page */}
            <form onSubmit={handleJumpPage} className="relative group">
              <input
                type="text"
                placeholder="Jump..."
                value={jumpPage}
                onChange={(e) => setJumpPage(e.target.value)}
                className="w-16 h-10 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl px-2 text-[10px] font-black text-center focus:ring-2 focus:ring-accent outline-none transition-all placeholder:text-gray-400 dark:text-white"
                aria-label="Jump to page number"
              />
            </form>

            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-3 rounded-xl border border-gray-100 dark:border-white/5 bg-white dark:bg-white/5 text-gray-400 hover:text-accent disabled:opacity-30 disabled:hover:text-gray-400 transition-all active:scale-95 shadow-sm"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-2">
              {getPaginationRange().map((page, i) => (
                <button
                  key={i}
                  disabled={page === "..."}
                  onClick={() => typeof page === 'number' && setCurrentPage(page)}
                  className={`w-10 h-10 rounded-xl text-[10px] font-black tracking-widest transition-all active:scale-95 ${
                    currentPage === page 
                      ? 'bg-accent text-white shadow-lg shadow-accent/20' 
                      : page === "..." 
                        ? 'text-gray-400 cursor-default uppercase'
                        : 'bg-white dark:bg-white/5 text-gray-400 hover:text-gray-900 dark:hover:text-white border border-emerald-500/10 dark:border-emerald-500/20'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-3 rounded-xl border border-gray-100 dark:border-white/5 bg-white dark:bg-white/5 text-gray-400 hover:text-accent disabled:opacity-30 disabled:hover:text-gray-400 transition-all active:scale-95 shadow-sm"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
