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

  const handleSort = (field) => {
    const isSameField = filters.sortBy === field;
    const newOrder = isSameField && filters.sortOrder === 'desc' ? 'asc' : 'desc';
    setFilters({ sortBy: field, sortOrder: newOrder });
  };

  const SortIcon = ({ field }) => {
    if (filters.sortBy !== field) return <ArrowUpDown size={12} className="ml-1 opacity-20" />;
    return filters.sortOrder === 'desc' ? <ChevronDown size={12} className="ml-1" /> : <ChevronUp size={12} className="ml-1" />;
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
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/50 dark:border-gray-800 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
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
                  <tr className="border-b border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                    <th 
                      className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest cursor-pointer hover:text-accent transition-colors"
                      onClick={() => handleSort('date')}
                      aria-sort={filters.sortBy === 'date' ? (filters.sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
                    >
                      <div className="flex items-center">Date <SortIcon field="date" /></div>
                    </th>
                    <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest">Description</th>
                    <th 
                      className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest cursor-pointer hover:text-accent transition-colors"
                      onClick={() => handleSort('category')}
                      aria-sort={filters.sortBy === 'category' ? (filters.sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
                    >
                      <div className="flex items-center">Category <SortIcon field="category" /></div>
                    </th>
                    <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest">Type</th>
                    <th 
                      className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest cursor-pointer hover:text-accent transition-colors text-right"
                      onClick={() => handleSort('amount')}
                      aria-sort={filters.sortBy === 'amount' ? (filters.sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
                    >
                      <div className="flex items-center justify-end">Amount <SortIcon field="amount" /></div>
                    </th>
                    {isAdmin && <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody role="rowgroup">
                  {paginatedTransactions.map((t, idx) => (
                    <tr 
                      key={t.id} 
                      className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors animate-in fade-in slide-in-from-left-4 duration-500"
                      style={{ animationDelay: `${idx * 50}ms` }}
                      role="row"
                    >
                      <td className="p-4 text-sm text-gray-500 dark:text-gray-400 font-medium" role="gridcell">{t.date}</td>
                      <td className="p-4" role="gridcell">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{t.description}</p>
                      </td>
                      <td className="p-4" role="gridcell">
                        <span className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-400">
                          <Tag size={14} className="text-accent" aria-hidden="true" />
                          {t.category}
                        </span>
                      </td>
                      <td className="p-4" role="gridcell">
                        <span className={`text-[10px] uppercase tracking-tighter px-2 py-1 rounded-lg font-black inline-flex items-center gap-1 ${
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
            <div className="sm:hidden divide-y divide-gray-50 dark:divide-gray-800">
              {paginatedTransactions.map((t, idx) => (
                <div 
                  key={t.id} 
                  className="p-5 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500"
                  style={{ animationDelay: `${idx * 50}ms` }}
                  role="article"
                  aria-label={`Transaction: ${t.description}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-base font-bold text-gray-900 dark:text-white">{t.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{t.date} • {t.category}</p>
                    </div>
                    <p className={`text-base font-black ${t.type === 'income' ? 'text-income' : 'text-gray-900 dark:text-white'}`}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount, currency)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded-lg font-black ${
                      t.type === 'income' ? 'bg-income/10 text-income' : 'bg-expense/10 text-expense'
                    }`}>
                      {t.type}
                    </span>
                    {isAdmin && (
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(t)} className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl" aria-label={`Edit ${t.description}`}><Pencil size={18}/></button>
                        <button onClick={() => handleDelete(t.id)} className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-expense" aria-label={`Delete ${t.description}`}><Trash2 size={18}/></button>
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
        <div className="flex items-center justify-between pb-10 animate-in fade-in duration-1000">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Showing <span className="font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold">{Math.min(currentPage * itemsPerPage, filteredAndSortedTransactions.length)}</span> of <span className="font-bold">{filteredAndSortedTransactions.length}</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-800 dark:hover:bg-gray-800 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                    currentPage === i + 1 
                      ? 'bg-accent text-white' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-800 dark:hover:bg-gray-800 transition-colors"
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
