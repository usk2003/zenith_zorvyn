import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../data/mockData';
import { generateMockPrototypes } from '../utils/dataGenerator';

const useStore = create(
  persist(
    (set, get) => ({
      // Accounts Slice
      accounts: [],
      addAccount: (account) => set((state) => ({ accounts: [...state.accounts, account] })),
      updateAccount: (updated) => set((state) => ({ 
        accounts: state.accounts.map(a => a.id === updated.id ? updated : a) 
      })),
      deleteAccount: (id) => set((state) => ({ 
        accounts: state.accounts.filter(a => a.id !== id) 
      })),

      // Categories Slice
      incomeCategories: INCOME_CATEGORIES,
      expenseCategories: EXPENSE_CATEGORIES,
      addCategory: (type, name) => set((state) => ({ 
        [type === 'income' ? 'incomeCategories' : 'expenseCategories']: [...state[type === 'income' ? 'incomeCategories' : 'expenseCategories'], name] 
      })),
      removeCategory: (type, name) => set((state) => ({ 
        [type === 'income' ? 'incomeCategories' : 'expenseCategories']: state[type === 'income' ? 'incomeCategories' : 'expenseCategories'].filter(c => c !== name) 
      })),

      // Budgets Slice
      budgets: [],
      setBudget: (budget) => set((state) => {
        const exists = state.budgets.find(b => b.category === budget.category);
        if (exists) {
          return { budgets: state.budgets.map(b => b.category === budget.category ? budget : b) };
        }
        return { budgets: [...state.budgets, budget] };
      }),

      // Transactions Slice
      transactions: [],
      addTransaction: (transaction) => {
        const { accounts } = get();
        let updatedAccounts = [...accounts];

        if (transaction.type === 'transfer') {
          const amount = parseFloat(transaction.amount);
          updatedAccounts = updatedAccounts.map(acc => {
            if (acc.id === transaction.fromAccount) return { ...acc, balance: acc.balance - amount };
            if (acc.id === transaction.toAccount) return { ...acc, balance: acc.balance + amount };
            return acc;
          });
        } else {
          updatedAccounts = updatedAccounts.map(acc => {
            if (acc.id === transaction.accountId) {
              const amount = parseFloat(transaction.amount);
              return { ...acc, balance: transaction.type === 'income' ? acc.balance + amount : acc.balance - amount };
            }
            return acc;
          });
        }

        set((state) => ({
          transactions: [transaction, ...state.transactions],
          accounts: updatedAccounts
        }));
      },
      updateTransaction: (updated) => 
        set((state) => ({ 
          transactions: state.transactions.map(t => t.id === updated.id ? updated : t) 
        })),
      deleteTransaction: (id) => 
        set((state) => ({ transactions: state.transactions.filter(t => t.id !== id) })),
      
      restoreData: (data) => 
        set({ 
          transactions: data.transactions || [], 
          role: data.role || 'viewer',
          accounts: data.accounts || [],
          budgets: data.budgets || [],
          goals: data.goals || [],
          loans: data.loans || [],
          investments: data.investments || [],
          creditCards: data.creditCards || [],
          userProfile: data.userProfile || {
            name: '',
            jobTitle: 'Financial Executive',
            dob: '',
            email: '',
            phone: '',
            avatarColor: '#10b981',
          }
        }),

      loadMockData: () => {
        const proto = generateMockPrototypes();
        set({
          accounts: proto.accounts,
          transactions: proto.transactions,
          budgets: proto.budgets,
          goals: proto.goals,
          loans: proto.loans,
          investments: proto.investments,
          creditCards: proto.creditCards,
          userProfile: proto.userProfile,
          role: 'admin'
        });
      },

      clearEverything: () => {
        localStorage.removeItem('zorvyn-storage');
        window.location.href = "/";
      },

      logout: () => {
        set((state) => ({ 
          role: 'viewer', 
          userProfile: { ...state.userProfile, name: '' } 
        }));
      },

      resetStore: () => {
        set({
           accounts: [],
           transactions: [],
           budgets: [],
           goals: [],
           loans: [],
           investments: [],
           creditCards: [],
           userProfile: {
             name: '',
             jobTitle: 'Financial Executive',
             dob: '',
             email: '',
             phone: '',
             avatarColor: '#10b981',
           },
           role: 'viewer'
        });
        localStorage.removeItem('zorvyn-storage');
      },

      // User Profile Slice
      userProfile: {
        name: '',
        jobTitle: '',
        dob: '',
        email: '',
        phone: '',
        avatarColor: '#10b981',
      },
      setUserProfile: (profile) =>
        set((state) => ({ userProfile: { ...state.userProfile, ...profile } })),

      security: {
        pin: '1357',
        question: '',
        answer: ''
      },
      setSecurity: (sec) => set((state) => ({ security: { ...state.security, ...sec } })),

      // Filters & Sorting Slice
      filters: {
        search: '',
        categories: [], // Empty means all selected
        type: 'All', // All, income, expense
        dateRange: { from: '', to: '' },
        sortBy: 'date',
        sortOrder: 'desc',
      },
      setFilters: (newFilters) => 
        set((state) => ({ filters: { ...state.filters, ...newFilters } })),
      resetFilters: () => set({ 
        filters: { 
          search: '', 
          categories: [], 
          type: 'All', 
          dateRange: { from: '', to: '' },
          sortBy: 'date',
          sortOrder: 'desc'
        } 
      }),

      // Financial Goals Slice
      goals: [],
      addGoal: (goal) => set((state) => ({ goals: [...state.goals, goal] })),
      updateGoal: (updated) => set((state) => ({ 
        goals: state.goals.map(g => g.id === updated.id ? updated : g) 
      })),
      deleteGoal: (id) => set((state) => ({ 
        goals: state.goals.filter(g => g.id !== id) 
      })),

      // Loans Slice
      loans: [],
      addLoan: (loan) => set((state) => ({ loans: [...state.loans, loan] })),
      updateLoan: (updated) => set((state) => ({ 
        loans: state.loans.map(l => l.id === updated.id ? updated : l) 
      })),
      deleteLoan: (id) => set((state) => ({ loans: state.loans.filter(l => l.id !== id) })),

      // Investments Slice
      investments: [],
      addInvestment: (inv) => set((state) => ({ investments: [...state.investments, inv] })),
      updateInvestment: (updated) => set((state) => ({ 
        investments: state.investments.map(i => i.id === updated.id ? updated : i) 
      })),
      deleteInvestment: (id) => set((state) => ({ investments: state.investments.filter(i => i.id !== id) })),

      // Credit Cards Slice
      creditCards: [],
      addCreditCard: (card) => set((state) => ({ creditCards: [...state.creditCards, card] })),
      deleteCreditCard: (id) => set((state) => ({ creditCards: state.creditCards.filter(c => c.id !== id) })),

      // Currency Slice
      currency: 'INR',
      setCurrency: (currency) => set({ currency }),

      // Role Slice
      role: 'viewer',
      setRole: (role) => set({ role }),

      // Theme Preference
      isDarkMode: document.documentElement.classList.contains('dark'),
      toggleDarkMode: () => {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.theme = isDark ? 'dark' : 'light';
        set({ isDarkMode: isDark });
      }
    }),
    {
      name: 'zorvyn-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        transactions: state.transactions, 
        role: state.role,
        goals: state.goals,
        userProfile: state.userProfile,
        accounts: state.accounts,
        budgets: state.budgets,
        incomeCategories: state.incomeCategories,
        expenseCategories: state.expenseCategories,
        security: state.security,
        loans: state.loans,
        investments: state.investments,
        creditCards: state.creditCards,
        currency: state.currency
    }), 
    version: 3,
    migrate: (persistedState, version) => {
        if (version < 3) {
            // Force reset for old versions to ensure "Zero Data" start
            return {}; 
        }
        return persistedState;
    }
  }
)
);

export default useStore;
