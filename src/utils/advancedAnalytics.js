// [Analytical Engine] Handles complex financial modeling for loans, SIPs, and outlier detection.

// [Loan Analysis] Calculates loan metrics including EMI, total interest, and remaining tenure.
export const calculateLoanMetrics = (loan) => {
  const { principal, interestRate, tenure, paidAmount } = loan;
  const monthlyRate = (interestRate / 100) / 12;
  
  // EMI Formula: [P x R x (1+R)^N]/[(1+R)^N-1]
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1);
  const totalPayable = emi * tenure;
  const totalInterest = totalPayable - principal;
  
  const remainingPrincipal = principal - (paidAmount * 0.8); // Simplification: 80% of paid amount goes to principal
  const remainingMonths = Math.ceil(remainingPrincipal / (emi * 0.7)); // Simplification for estimate
  
  return {
    emi,
    totalInterest,
    interestPaid: totalInterest * (paidAmount / totalPayable), 
    remainingPrincipal,
    remainingMonths: Math.max(0, remainingMonths),
    progress: (paidAmount / totalPayable) * 100
  };
};

/**
 * Predicts future value of SIP investments.
 */
export const calculateSIPFutureValue = (monthlyInvestment, rate, years) => {
  const months = years * 12;
  const monthlyRate = (rate / 100) / 12;
  
  // FV = P × [({(1 + r)^n} - 1) / r] × (1 + r)
  const futureValue = monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
  return futureValue;
};

/**
 * Audits transactions for outliers and top contributors.
 */
export const getFinancialAudit = (transactions) => {
  if (!transactions.length) return null;

  const sorted = [...transactions].sort((a, b) => b.amount - a.amount);
  const largest = sorted[0];
  
  const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  
  return {
    largestTransaction: largest,
    incomeExpenseRatio: income / (expense || 1),
    monthlyBurnRate: expense / 6, // Assuming 6 months of data
    surplus: income - expense
  };
};

/**
 * Estimates the "Loan Freedom Date"
 * Based on current debt vs (Investments + Future SIP returns + Monthly Surplus)
 */
export const calculateLoanFreedomDate = (loans, investments, monthlySurplus) => {
  const totalDebt = loans.reduce((s, l) => s + (l.principal - l.paidAmount), 0);
  const liquidAssets = investments.reduce((s, i) => s + i.current, 0);
  const monthlySip = investments.reduce((s, i) => s + (i.sip || 0), 0);
  
  const netMonthlyContribution = monthlySurplus + monthlySip;
  if (netMonthlyContribution <= 0) return 'Infinite (Negative Surplus)';
  
  const monthsToFreedom = (totalDebt - liquidAssets) / netMonthlyContribution;
  
  if (monthsToFreedom <= 0) return 'Immediate (Assets > Debt)';
  
  const date = new Date();
  date.setMonth(date.getMonth() + Math.ceil(monthsToFreedom));
  
  return {
    date: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    months: Math.ceil(monthsToFreedom)
  };
};
