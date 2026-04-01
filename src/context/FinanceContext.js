import { createContext, useState, useEffect } from "react";

export const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem("transactions");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse transactions", e);
      return [];
    }
  });

  const [budget, setBudget] = useState(() => {
    const saved = localStorage.getItem("budget");
    return saved ? Number(saved) : 0;
  });

  const [editTransaction, setEditTransaction] = useState(null);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("budget", budget);
  }, [budget]);

  const addTransaction = (transaction) => {
    setTransactions([
      ...transactions,
      { ...transaction, id: Date.now(), amount: Number(transaction.amount) },
    ]);
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const updateTransaction = (updatedTransaction) => {
    setTransactions(
      transactions.map((t) =>
        t.id === updatedTransaction.id ? { ...updatedTransaction, amount: Number(updatedTransaction.amount) } : t
      )
    );
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        addTransaction,
        deleteTransaction,
        updateTransaction,
        editTransaction,
        setEditTransaction,
        budget,
        setBudget,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};