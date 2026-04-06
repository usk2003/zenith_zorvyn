/**
 * Utility functions for Dashboard data processing.
 */

// Format currency
export const formatCurrency = (value, currencyCode = 'INR') => {
  const locale = currencyCode === 'INR' ? 'en-IN' : 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 0, // Clean executive look
  }).format(value);
};

// Compute summary metrics
export const getSummaryMetrics = (transactions) => {
  if (!transactions.length) {
    return { balance: 0, income: 0, expenses: 0, savingsRate: 0 };
  }

  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expenses;
  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;

  return { balance, income, expenses, savingsRate };
};

// Compute monthly trend for the AreaChart (last 6 months)
export const getMonthlyTrend = (transactions) => {
  if (!transactions.length) return [];

  // Group by month
  const monthlyData = transactions.reduce((acc, t) => {
    const month = t.date.substring(0, 7); // YYYY-MM
    if (!acc[month]) {
      acc[month] = { month, income: 0, expenses: 0 };
    }
    acc[month][t.type === 'income' ? 'income' : 'expenses'] += t.amount;
    return acc;
  }, {});

  // Convert to array and sort by month
  const sortedMonths = Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));

  // Compute running balance
  let runningBalance = 0;
  return sortedMonths.map(data => {
    runningBalance += (data.income - data.expenses);
    const [year, month] = data.month.split('-');
    const date = new Date(year, month - 1);
    const monthName = date.toLocaleString('default', { month: 'short' });
    
    return {
      name: `${monthName} ${year}`,
      balance: Math.round(runningBalance * 100) / 100,
      income: data.income,
      expenses: data.expenses
    };
  });
};

// Compute category breakdown for the PieChart
export const getCategoryData = (transactions) => {
  if (!transactions.length) return [];

  const expenses = transactions.filter(t => t.type === 'expense');
  const categoryTotals = expenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  return Object.entries(categoryTotals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};

// Get last N transactions sorted by date
export const getRecentTransactions = (transactions, limit = 5) => {
  return [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);
};

// Compute projection data (next 3 months) based on current month's performance
export const getProjectionData = (historicalData) => {
  if (historicalData.length < 2) return [];

  const lastPoint = historicalData[historicalData.length - 1];
  const prevPoint = historicalData[historicalData.length - 2];
  
  // Calculate average monthly delta (net change)
  const delta = lastPoint.balance - prevPoint.balance;
  
  const projections = [];
  let currentBalance = lastPoint.balance;

  for (let i = 1; i <= 3; i++) {
    currentBalance += delta;
    projections.push({
      name: `Proj ${i}`,
      projection: Math.round(currentBalance * 100) / 100,
      isProjection: true
    });
  }

  return [...historicalData, ...projections];
};

// Compute Goal Metrics
export const getGoalMetrics = (goals) => {
  if (!goals) return [];
  return goals.map(goal => ({
    ...goal,
    percentage: Math.min(100, (goal.current / goal.target) * 100),
    remaining: Math.max(0, goal.target - goal.current)
  }));
};

// Compute Account Metrics
export const getAccountMetrics = (accounts) => {
  if (!accounts || accounts.length === 0) return { totalBalance: 0, byType: {} };
  
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const byType = accounts.reduce((acc, curr) => {
    acc[curr.type] = (acc[curr.type] || 0) + curr.balance;
    return acc;
  }, {});

  return { totalBalance, byType };
};

// Compute Budget Metrics
export const getBudgetMetrics = (budgets, transactions) => {
  if (!budgets || budgets.length === 0) return [];

  // Filter transactions for current month
  const now = new Date();
  const currentMonth = now.toISOString().substring(0, 7); // YYYY-MM
  const currentMonthTransactions = transactions.filter(t => t.date.startsWith(currentMonth));

  return budgets.map(budget => {
    const spent = currentMonthTransactions
      .filter(t => t.category === budget.category && t.type === budget.type)
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      ...budget,
      spent,
      remaining: Math.max(0, budget.limit - spent),
      percentage: Math.min(100, (spent / budget.limit) * 100),
      isOverBudget: spent > budget.limit
    };
  });
};

// Help to format large numbers
export const formatCompactNumber = (number) => {
  return Intl.NumberFormat('en-IN', {
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(number);
};

