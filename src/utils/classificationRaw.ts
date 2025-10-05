type Transaction = {
  amount: number;
  date: string; // ISO date
  category: string;
  description: string;
  type: "credit" | "debit";
};

export function analyzeSpending(transactions: Transaction[]) {
  const totalSpent = transactions
    .filter((txn) => txn.type === "debit")
    .reduce((sum, txn) => sum + txn.amount, 0);

  const totalReceived = transactions
    .filter((txn) => txn.type === "credit")
    .reduce((sum, txn) => sum + txn.amount, 0);

  const debitTxns = transactions.filter((txn) => txn.type === "debit");
  const txnCount = debitTxns.length;
  const averageSpend = txnCount > 0 ? totalSpent / txnCount : 0;

  const weekendSpending = debitTxns
    .filter((txn) => {
      const day = new Date(txn.date).getDay();
      return day === 6 || day === 0; // Sat or Sun
    })
    .reduce((sum, txn) => sum + txn.amount, 0);

  const foodSpending = debitTxns
    .filter((txn) => /food|restaurant|eat|snack|drink/i.test(txn.description))
    .reduce((sum, txn) => sum + txn.amount, 0);

  const essentialSpending = debitTxns
    .filter((txn) =>
      /rent|bill|electric|water|transport|gas|school|health/i.test(
        txn.description
      )
    )
    .reduce((sum, txn) => sum + txn.amount, 0);

  const gadgetSpending = debitTxns
    .filter((txn) =>
      /phone|laptop|gadget|tech|electronics/i.test(txn.description)
    )
    .reduce((sum, txn) => sum + txn.amount, 0);

  const luxurySpending = debitTxns
    .filter((txn) =>
      /luxury|jewelry|designer|fashion|gold|premium/i.test(txn.description)
    )
    .reduce((sum, txn) => sum + txn.amount, 0);

  // --- Categories ---
  if (weekendSpending / totalSpent > 0.5) {
    return {
      type: "Weekend Warrior 🎉",
      desc: "You live for the vibes! Most of your cash goes down when the weekend turns up.",
    };
  }
  if (txnCount > 15 && averageSpend < 5000) {
    return {
      type: "Impulse Pro Max 🛍️",
      desc: "Quick on the trigger — if it catches your eye, it’s already in your cart.",
    };
  }
  if (totalSpent < totalReceived * 0.4) {
    return {
      type: "Silent Saver 💰",
      desc: "Lowkey stacking. You spend way less than you earn, letting your balance grow quietly.",
    };
  }
  if (foodSpending / totalSpent > 0.4) {
    return {
      type: "Foodie Flex 🍔",
      desc: "Half your spending is basically a food tour — you’re eating good and often.",
    };
  }
  if (essentialSpending / totalSpent > 0.8) {
    return {
      type: "Zen Spender 🌿",
      desc: "Peaceful and balanced. You stick to essentials and avoid money stress.",
    };
  }
  if (averageSpend > 30000 && debitTxns.length < 5) {
    return {
      type: "Cash Splash King/Queen 👑",
      desc: "Big moves only. You make fewer transactions, but when you do, it’s major.",
    };
  }
  if (gadgetSpending / totalSpent > 0.3) {
    return {
      type: "Gadget Guru 📱",
      desc: "New tech drops? Say less. Your money follows the latest devices and upgrades.",
    };
  }
  if (luxurySpending / totalSpent > 0.3) {
    return {
      type: "Luxury Lover 💎",
      desc: "Only the finer things. You’d rather spend more for premium everything.",
    };
  }
  if (txnCount > 20 && averageSpend < 2000) {
    return {
      type: "Budget Boss 📊",
      desc: "You’ve got receipts, limits, and control. Nothing leaves your wallet unchecked.",
    };
  }

  // fallback
  return {
    type: "Steady Eddy 🧘",
    desc: "Predictable and consistent — you’ve got your rhythm and stick with it.",
  };
}
