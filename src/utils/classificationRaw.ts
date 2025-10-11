type Transaction = {
  amount: number;
  date: string; // ISO date
  category: string;
  description: string;
  type: "credit" | "debit";
};

export function analyzeSpending(transactions: Transaction[]) {
const debitTxns = transactions.filter((txn) => txn.type === "debit");
const creditTxns = transactions.filter((txn) => txn.type === "credit");

const totalSpent = debitTxns.reduce((sum, txn) => sum + txn.amount, 0);
const totalReceived = creditTxns.reduce((sum, txn) => sum + txn.amount, 0);
const txnCount = debitTxns.length;
const averageSpend = txnCount > 0 ? totalSpent / txnCount : 0;

if (totalSpent === 0) {
  return {
    type: "Inactive Account 💤",
    desc: "No debit activity found — maybe saving hard or just taking a financial break.",
  };
}

// --- Aggregations by category ---
const categorySum = (categoryList: any[]) =>
  debitTxns
    .filter((txn) => categoryList.includes(txn.category))
    .reduce((sum, txn) => sum + txn.amount, 0);

const weekendSpending = debitTxns
  .filter((txn) => {
    const day = new Date(txn.date).getDay();
    return day === 6 || day === 0;
  })
  .reduce((sum, txn) => sum + txn.amount, 0);

const foodSpending = categorySum(["food"]);
const transportSpending = categorySum(["transport"]);
const shoppingSpending = categorySum(["shopping"]);
const billSpending = categorySum(["bills"]);
const entertainmentSpending = categorySum(["entertainment"]);
const savingsSpending = categorySum(["savings"]);
const healthSpending = categorySum(["health"]);
const educationSpending = categorySum(["education"]);
const subscriptionSpending = categorySum(["subscriptions"]);
const giftingSpending = categorySum(["gifting"]);
const homeSpending = categorySum(["home"]);
const donationSpending = categorySum(["donations"]);
const bankCharges = categorySum(["bank_charges"]);

// --- Ratios ---
const weekendRatio = weekendSpending / totalSpent;
const foodRatio = foodSpending / totalSpent;
const shoppingRatio = shoppingSpending / totalSpent;
const billRatio = billSpending / totalSpent;
const entertainmentRatio = entertainmentSpending / totalSpent;
const transportRatio = transportSpending / totalSpent;
const savingsRatio = savingsSpending / totalSpent;
const subscriptionRatio = subscriptionSpending / totalSpent;
const donationRatio = donationSpending / totalSpent;
const giftingRatio = giftingSpending / totalSpent;
const healthRatio = healthSpending / totalSpent;
const homeRatio = homeSpending / totalSpent;
const bankRatio = bankCharges / totalSpent;

// --- Personality classifications ---
if (weekendRatio > 0.5) {
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

  if (foodRatio > 0.4) {
    return {
      type: "Foodie Flex 🍔",
      desc: "Half your spending is basically a food tour — you’re eating good and often.",
    };
  }

  if (billRatio + transportRatio + homeRatio + healthRatio > 0.8) {
    return {
      type: "Zen Spender 🌿",
      desc: "Peaceful and balanced. You stick to essentials and avoid money stress.",
    };
  }

  if (averageSpend > 30000 && txnCount < 5) {
    return {
      type: "Cash Splash King/Queen 👑",
      desc: "Big moves only. You make fewer transactions, but when you do, it’s major.",
    };
  }

  if (shoppingRatio > 0.3 && averageSpend > 10000) {
    return {
      type: "Retail Royalty 🛒",
      desc: "You’ve mastered the art of treating yourself — shopping is your sport.",
    };
  }

  if (subscriptionRatio > 0.25) {
    return {
      type: "Subscripted Soul 📺",
      desc: "You’re streaming, subscribing, and auto-renewing your way through life.",
    };
  }

  if (savingsRatio > 0.3) {
    return {
      type: "Future Thinker 📈",
      desc: "Disciplined and goal-oriented — you save now so you can chill later.",
    };
  }

  if (donationRatio > 0.15) {
    return {
      type: "Kind Giver ❤️",
      desc: "Generosity drives you — you make space in your budget to help others.",
    };
  }

  if (entertainmentRatio > 0.3 && weekendRatio > 0.3) {
    return {
      type: "Social Butterfly 🕺",
      desc: "Concerts, bars, parties — you spend where the fun is.",
    };
  }

  if (educationSpending / totalSpent > 0.3) {
    return {
      type: "Student Hustler 🎓",
      desc: "Always learning, always investing in yourself — education tops your priorities.",
    };
  }

  if (healthRatio > 0.3) {
    return {
      type: "Health First 🩺",
      desc: "Your wellness comes first — health spending dominates your budget.",
    };
  }

  if (transportRatio > 0.3) {
    return {
      type: "Daily Commuter 🚇",
      desc: "On the move constantly — a lot of your money goes into getting around.",
    };
  }

  if (giftingRatio > 0.2) {
    return {
      type: "Gift Guru 🎁",
      desc: "You love making others happy — gifts and surprises are your love language.",
    };
  }

  if (homeRatio > 0.4) {
    return {
      type: "Home Guardian 🏡",
      desc: "Home is your haven — most of your spending keeps your space comfortable.",
    };
  }

  if (bankRatio > 0.1) {
    return {
      type: "Fee Fighter ⚠️",
      desc: "Banks love you a little too much — watch those fees and charges.",
    };
  }

  if (txnCount > 20 && averageSpend < 2000) {
    return {
      type: "Budget Boss 📊",
      desc: "You’ve got receipts, limits, and control. Nothing leaves your wallet unchecked.",
    };
  }

  if (averageSpend < 1000 && txnCount > 10) {
    return {
      type: "Micro Manager 🪙",
      desc: "You keep things tight — small, frequent transactions and total awareness.",
    };
  }

  if (averageSpend > 100000) {
    return {
      type: "High Roller 💼",
      desc: "Big spender energy — you move like a boss and think in bulk.",
    };
  }

  if (shoppingRatio + entertainmentRatio > 0.6) {
    return {
      type: "Lifestyle Lover 💃",
      desc: "You’re all about experiences and enjoyment — money’s there to make life fun.",
    };
  }

  if (billRatio < 0.1 && savingsRatio < 0.1 && foodRatio < 0.1) {
    return {
      type: "Mystery Mover 🕵️",
      desc: "Your spending is unpredictable — hard to pin down, always surprising.",
    };
  }

  // fallback
  return {
    type: "Steady Eddy 🧘",
    desc: "Predictable and consistent — you’ve got your rhythm and stick with it.",
  };

}
