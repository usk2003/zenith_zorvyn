import useStore from '../store/useStore';

/**
 * Custom hook to centralize all transaction mutations with RBAC guards.
 * Returns actions for adding, updating, and deleting transactions.
 */
const useTransactionActions = () => {
  const { role, addTransaction, updateTransaction, deleteTransaction } = useStore();

  const isAdmin = role === 'admin';

  const add = (transaction) => {
    if (!isAdmin) {
      console.error('Permission Denied: Only admins can add transactions.');
      return false;
    }
    const newTransaction = {
      ...transaction,
      id: Date.now(), // Simple ID generation for frontend demo
    };
    addTransaction(newTransaction);
    return true;
  };

  const update = (transaction) => {
    if (!isAdmin) {
      console.error('Permission Denied: Only admins can edit transactions.');
      return false;
    }
    updateTransaction(transaction);
    return true;
  };

  const remove = (id) => {
    if (!isAdmin) {
      console.error('Permission Denied: Only admins can delete transactions.');
      return false;
    }
    deleteTransaction(id);
    return true;
  };

  return {
    add,
    update,
    remove,
    isAdmin,
  };
};

export default useTransactionActions;
