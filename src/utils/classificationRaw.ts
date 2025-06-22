type Transaction = {
  amount: number;
  date: string; // ISO date
  category: string;
  type: "credit" | "debit";
};

function classifyUser(transactions: Transaction[]) {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 7);

  const debitTxns = transactions.filter((txn) => txn.type === "debit");
  const creditTxns = transactions.filter((txn) => txn.type === "credit");

  const totalSpent = debitTxns.reduce((sum, txn) => sum + txn.amount, 0);
  const totalReceived = creditTxns.reduce((sum, txn) => sum + txn.amount, 0);
  const averageSpend = totalSpent / (debitTxns.length || 1);

  const weekendSpending = debitTxns
    .filter((txn) => {
      const day = new Date(txn.date).getDay();
      return day === 5 || day === 6 || day === 0; // Fri, Sat, Sun
    })
    .reduce((sum, txn) => sum + txn.amount, 0);

  const foodSpending = debitTxns
    .filter((txn) => txn.category.toLowerCase().includes("food"))
    .reduce((sum, txn) => sum + txn.amount, 0);

  const fashionSpending = debitTxns
    .filter((txn) => txn.category.toLowerCase().includes("fashion"))
    .reduce((sum, txn) => sum + txn.amount, 0);

  const essentialSpending = debitTxns
    .filter((txn) =>
      ["utilities", "transport", "bills"].includes(txn.category.toLowerCase())
    )
    .reduce((sum, txn) => sum + txn.amount, 0);

  const recentTxns = debitTxns.filter((txn) => new Date(txn.date) > weekStart);
  const txnCount = recentTxns.length;

  // Rules
  if (weekendSpending / totalSpent > 0.5) {
    return "Weekend Warrior 🎉";
  }
  if (txnCount > 15 && averageSpend < 5000) {
    return "Impulse Pro Max 🛍️";
  }
  if (totalSpent < totalReceived * 0.4) {
    return "Silent Saver 💰";
  }
  if (foodSpending / totalSpent > 0.4) {
    return "Soft Life Seeker 🧖🏾‍♀️";
  }
  if (essentialSpending / totalSpent > 0.8) {
    return "Zen Spender 🌿";
  }
  if (averageSpend > 30000 && debitTxns.length < 5) {
    return "Cash Splash King/Queen 👑";
  }

  return "Steady Eddy 🧘";
}
