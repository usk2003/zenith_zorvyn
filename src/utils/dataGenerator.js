/**
 * Utility to generate realistic mock data for the Zorvyn prototype.
 * Generates 300+ transactions across different categories, accounts, and timeframes.
 */

export const generateMockPrototypes = () => {
  const accounts = [
    { id: 'acc_1', name: 'HDFC Priority Savings', type: 'Bank', balance: 842500.00, color: '#10b981', icon: 'landmark' },
    { id: 'acc_2', name: 'Jupiter Infinite', type: 'UPI', balance: 42450.50, color: '#14b8a6', icon: 'zap' },
    { id: 'acc_3', name: 'Vault Cash', type: 'Cash', balance: 15500.00, color: '#059669', icon: 'wallet' },
    { id: 'acc_4', name: 'Zerodha Portfolio', type: 'Demat', balance: 4250000.00, color: '#0d9488', icon: 'trending-up' },
    { id: 'acc_5', name: 'Ledger Cold Wallet', type: 'Coins', balance: 1250000.00, color: '#22c55e', icon: 'bitcoin' },
  ];

  const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Dividends', 'Advisory', 'Gift', 'Other'];
  const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping', 'Healthcare', 'Rent', 'Education', 'Subscriptions', 'Gifts', 'Insurance', 'Other'];

  const transactions = [];
  let currentId = 1000;
  
  // Set timeframe for 300 entries: last 6 months
  const now = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(now.getMonth() - 6);

  // Generate salary for each month
  for (let i = 0; i < 6; i++) {
    const salaryDate = new Date(sixMonthsAgo);
    salaryDate.setMonth(sixMonthsAgo.getMonth() + i);
    salaryDate.setDate(1);
    transactions.push({
      id: currentId++,
      date: salaryDate.toISOString(),
      amount: 450000.00,
      category: 'Salary',
      type: 'income',
      description: 'Executive Compensation Payout',
      accountId: 'acc_1',
      notes: 'Monthly regular pay'
    });
  }

  // Generate 300 random transactions
  for (let i = 0; i < 300; i++) {
    const randomDate = new Date(sixMonthsAgo.getTime() + Math.random() * (now.getTime() - sixMonthsAgo.getTime()));
    const type = Math.random() > 0.8 ? 'income' : 'expense';
    const category = type === 'income' 
      ? INCOME_CATEGORIES[Math.floor(Math.random() * INCOME_CATEGORIES.length)]
      : EXPENSE_CATEGORIES[Math.floor(Math.random() * EXPENSE_CATEGORIES.length)];
    
    // Weighted amounts
    let amount;
    if (type === 'income') {
      amount = Math.random() > 0.9 ? 50000 + Math.random() * 200000 : 5000 + Math.random() * 45000;
    } else {
      amount = Math.random() > 0.95 ? 10000 + Math.random() * 50000 : 500 + Math.random() * 5000;
    }

    const account = accounts[Math.floor(Math.random() * (accounts.length - 2))].id; // Mostly from first 3 accounts

    transactions.push({
      id: currentId++,
      date: randomDate.toISOString(),
      amount: parseFloat(amount.toFixed(2)),
      category,
      type,
      description: `${category} ${type === 'income' ? 'Inflow' : 'Outflow'} #${i}`,
      accountId: account,
      notes: ''
    });
  }

  // Sort by date descending
  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

  const budgets = [
    { category: 'Food', limit: 45000, type: 'expense' },
    { category: 'Transport', limit: 15000, type: 'expense' },
    { category: 'Shopping', limit: 80000, type: 'expense' },
    { category: 'Entertainment', limit: 25000, type: 'expense' },
    { category: 'Healthcare', limit: 20000, type: 'expense' },
    { category: 'Utilities', limit: 12000, type: 'expense' },
  ];

  const goals = [
    { id: '1', title: 'Emergency Fund', target: 1000000, current: 450000, icon: 'shield', color: '#10b981' },
    { id: '2', title: 'Real Estate Acquisition', target: 15000000, current: 2500000, icon: 'landmark', color: '#059669' },
    { id: '3', title: 'Global Venture Fund', target: 5000000, current: 850000, icon: 'zap', color: '#14b8a6' },
  ];

  const loans = [
    { id: 'l1', name: 'Strategic Property Loan', principal: 8500000, interestRate: 8.25, tenure: 180, paidAmount: 1245000, startDate: '2023-01-15' },
    { id: 'l2', name: 'Corporate Asset Finance', principal: 1500000, interestRate: 9.5, tenure: 48, paidAmount: 640000, startDate: '2023-11-20' },
  ];

  const investments = [
    { id: 'i1', name: 'Alpha Growth Portfolio', type: 'Portfolio', invested: 1850000, current: 2420000, sip: 50000 },
    { id: 'i2', name: 'BlueChip Dynamic MF', type: 'Mutual Fund', invested: 1200000, current: 1345000, sip: 25000 },
    { id: 'i3', name: 'Nasdaq tech ETF', type: 'ETF', invested: 800000, current: 950000, sip: 15000 },
  ];

  const creditCards = [
    { id: 'c1', name: 'Amex Centurion Clone', limit: 1000000, balance: 145000, dueDate: '22nd', statementDate: '5th' },
    { id: 'c2', name: 'Sapphire Preferred', limit: 500000, balance: 42000, dueDate: '15th', statementDate: '28th' },
  ];

  return {
    accounts,
    transactions,
    budgets,
    goals,
    loans,
    investments,
    creditCards,
    userProfile: {
      name: 'Prototype Executive',
      jobTitle: 'Investment Strategist',
      dob: '1990-01-01',
      email: 'executive@zorvyn.ai',
      phone: '+91 98765 43210',
      avatarColor: '#10b981',
    }
  };
};
