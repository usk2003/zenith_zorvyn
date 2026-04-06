/**
 * Computes all financial insights for the Zorvyn dashboard.
 * Pure functions only - depends purely on the transactions array.
 */

// Helper to group by month-year
const groupByMonth = (transactions) => {
  return transactions.reduce((acc, t) => {
    const date = new Date(t.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!acc[key]) acc[key] = { income: 0, expense: 0, total: 0 };
    if (t.type === 'income') acc[key].income += t.amount;
    else acc[key].expense += t.amount;
    acc[key].total += (t.type === 'income' ? t.amount : -t.amount);
    return acc;
  }, {});
};

export const getInsightCards = (transactions) => {
  if (!transactions.length) return { highestCategory: 'N/A', biggestExpense: 0, avgMonthlySpend: 0 };

  const expenses = transactions.filter(t => t.type === 'expense');
  
  // 1. Highest Spending Category
  const catTotals = expenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});
  const highestCategory = Object.keys(catTotals).reduce((a, b) => catTotals[a] > catTotals[b] ? a : b, 'Other');

  // 2. Biggest Single Expense
  const biggestExpense = expenses.length ? Math.max(...expenses.map(t => t.amount)) : 0;

  // 3. Avg Monthly Spend
  const monthlyData = groupByMonth(expenses);
  const months = Object.keys(monthlyData).length;
  const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);
  const avgMonthlySpend = months > 0 ? totalExpense / months : totalExpense;

  return { highestCategory, biggestExpense, avgMonthlySpend };
};

export const getMoMComparison = (transactions) => {
  const data = groupByMonth(transactions);
  return Object.keys(data).sort().map(month => ({
    name: month,
    income: data[month].income,
    expense: data[month].expense
  })).slice(-6); // Last 6 months
};

export const getTopCategories = (transactions) => {
  const expenses = transactions.filter(t => t.type === 'expense');
  const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);
  
  const catTotals = expenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  return Object.entries(catTotals)
    .map(([name, value]) => ({ name, value, percentage: (value / totalExpense) * 100 }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);
};

export const getSavingsTrend = (transactions) => {
  const data = groupByMonth(transactions);
  return Object.keys(data).sort().map(month => {
    const { income, expense } = data[month];
    const rate = income > 0 ? ((income - expense) / income) * 100 : 0;
    return { name: month, rate: Math.max(0, parseFloat(rate.toFixed(1))) };
  }).slice(-6);
};

export const getSmartInsight = (transactions, budgets = []) => {
  if (transactions.length < 5) return "Add more transactions to unlock AI-powered smart observations!";
  
  const monthlyData = groupByMonth(transactions);
  const months = Object.keys(monthlyData).sort();
  if (months.length < 1) return "Collecting more history for comparisons...";

  const currentMonth = months[months.length - 1];
  const currentExpenses = monthlyData[currentMonth].expense;
  
  // 1. Check Budgets
  const overBudgets = budgets.filter(b => {
    const spent = transactions
      .filter(t => t.type === 'expense' && t.category === b.category && t.date.startsWith(currentMonth))
      .reduce((sum, t) => sum + t.amount, 0);
    return spent > b.limit;
  });

  if (overBudgets.length > 0) {
    return `Alert: You've exceeded your budget in ${overBudgets.length} categories (${overBudgets[0].category} is the highest). Consider tightening up for the rest of the month.`;
  }

  // 2. MoM Comparison
  if (months.length >= 2) {
    const previous = months[months.length - 2];
    const diff = currentExpenses - monthlyData[previous].expense;
    const pct = monthlyData[previous].expense > 0 ? (diff / monthlyData[previous].expense) * 100 : 0;

    if (diff > 0 && pct > 15) {
      return `Warning: Your expenses increased by ${pct.toFixed(1)}% this month. Large outflows detected in your top categories.`;
    } else if (diff < 0) {
      return `Excellent work! You've reduced your spending by ${Math.abs(pct).toFixed(1)}% compared to last month. Keep up the discipline!`;
    }
  }

  // 3. General Positive
  return "Your cash flow is looking stable. Focus on your 'Emergency Fund' goal to increase your financial resilience.";
};

export const getAccountDistribution = (accounts) => {
  if (!accounts || !accounts.length) return [];
  return accounts.map(acc => ({
    name: acc.name,
    value: acc.balance,
    type: acc.type
  })).sort((a, b) => b.value - a.value);
};


export const exportTransactionsToCSV = (transactions) => {
  if (!transactions.length) return;

  const headers = ['ID', 'Date', 'Description', 'Category', 'Type', 'Amount'];
  const rows = transactions.map(t => [
    t.id, t.date, t.description, t.category, t.type, t.amount
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `zorvyn_export_${new Date().toISOString().split('T')[0]}.csv`);
  link.click();
};

export const exportTransactionsToJSON = (transactions, role) => {
  const data = { transactions, role, exportDate: new Date().toISOString() };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `zorvyn_backup_${new Date().toISOString().split('T')[0]}.json`);
  link.click();
};

export const importTransactionsFromJSON = (file, callback) => {
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const data = JSON.parse(event.target.result);
      if (data.transactions && data.role) {
        callback(data);
        alert('Portfolio restored successfully! Your financial roadmap has been updated.');
      } else {
        alert('Invalid backup format. Please select a valid Zorvyn JSON export.');
      }
    } catch (err) {
      alert('Failed to parse the backup file. It may be corrupted.');
    }
  };
  reader.readAsText(file);
};
// Compute Heatmap Data (spending intensity by day of month)
export const getHeatmapData = (transactions) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const dayCounts = {};
  transactions
    .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === currentMonth)
    .forEach(t => {
      const day = new Date(t.date).getDate();
      dayCounts[day] = (dayCounts[day] || 0) + t.amount;
    });

  const data = [];
  for (let i = 1; i <= daysInMonth; i++) {
    data.push({
      day: i,
      value: dayCounts[i] || 0
    });
  }
  return data;
};
