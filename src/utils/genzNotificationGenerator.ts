import { ITransaction } from "../model/transactions";

interface NotificationData {
  title: string;
  body: string;
  emoji: string;
}

export class GenZNotificationGenerator {
  private static getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private static getAmountEmoji(amount: number): string {
    if (amount >= 10000) return "💰";
    if (amount >= 5000) return "💸";
    if (amount >= 1000) return "💵";
    if (amount >= 500) return "💳";
    return "🪙";
  }

  private static getCategoryEmoji(category: string): string {
    const categoryEmojis: { [key: string]: string[] } = {
      food: ["🍕", "🍔", "🥗", "🍜", "☕", "🍰", "🍟", "🌮"],
      transport: ["🚗", "🚌", "🚇", "✈️", "🛵", "🚲", "⛽", "🚕"],
      shopping: ["🛍️", "👗", "👟", "💄", "🛒", "🎁", "📱", "💻"],
      bills: ["💡", "🏠", "📱", "💧", "🔥", "📺", "🌐", "📞"],
      entertainment: ["🎬", "🎮", "🎵", "🎭", "🎪", "🎨", "📚", "🎯"],
      savings: ["🏦", "💰", "💎", "📈", "🎯", "💪", "🔥", "✨"],
      health: ["🏥", "💊", "🏃", "💪", "🧘", "🥗", "💉", "🩺"],
      education: ["📚", "🎓", "✏️", "📝", "🎒", "💡", "🧠", "📖"],
      subscriptions: ["📱", "💻", "🎵", "🎬", "📺", "📚", "🎮", "💳"],
      gifting: ["🎁", "💝", "🎉", "🎊", "💐", "🦄", "✨", "💖"],
      home: ["🏠", "🛋️", "🛏️", "🍽️", "🧹", "🔧", "🌱", "🕯️"],
      income: ["💼", "💰", "📈", "🎯", "💪", "🔥", "✨", "🏆"],
      bank_charges: ["🏦", "💳", "📊", "⚡", "🔔", "📋", "💸", "📈"],
      donations: ["❤️", "🤝", "🌍", "💝", "✨", "🙏", "💖", "🌟"]
    };
    
    return this.getRandomElement(categoryEmojis[category] || ["💳"]);
  }

  private static getTransactionTypeEmoji(type: "credit" | "debit"): string {
    return type === "credit" ? "📈" : "📉";
  }

  private static getTimeBasedGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return "Morning";
    if (hour < 17) return "Afternoon";
    return "Evening";
  }

  private static getPersonalizedGreeting(userName?: string): string {
    const greetings = [
      "Hey bestie! 👋",
      "What's good? 😎",
      "Yo! 🚀",
      "Hey there! ✨",
      "What's popping? 🔥",
      "Hey legend! 👑",
      "What's the vibe? 🌟",
      "Hey superstar! ⭐"
    ];
    
    if (userName) {
      const nameGreetings = [
        `Hey ${userName}! 👋`,
        `What's good ${userName}? 😎`,
        `Yo ${userName}! 🚀`,
        `Hey ${userName}! ✨`,
        `What's popping ${userName}? 🔥`,
        `Hey ${userName}! 👑`,
        `What's the vibe ${userName}? 🌟`,
        `Hey ${userName}! ⭐`
      ];
      return this.getRandomElement(nameGreetings);
    }
    
    return this.getRandomElement(greetings);
  }

  static generateTransactionNotification(
    transaction: ITransaction,
    userName?: string,
    userBalance?: number
  ): NotificationData {
    const isCredit = transaction.type === "credit";
    const amount = Math.abs(transaction.amount);
    const categoryEmoji = this.getCategoryEmoji(transaction.category);
    const amountEmoji = this.getAmountEmoji(amount);
    const typeEmoji = this.getTransactionTypeEmoji(transaction.type);
    const greeting = this.getPersonalizedGreeting(userName);

    // Credit notifications (money coming in)
    if (isCredit) {
      const creditTitles = [
        "Money just hit! 💰",
        "Cha-ching! 💸",
        "Payday vibes! 🎉",
        "Money moves! 💪",
        "Stacking paper! 📈",
        "Bag secured! 🎯",
        "Bread came through! 🍞",
        "Funds loaded! ⚡"
      ];

      const creditBodies = [
        `Just saw ${amountEmoji} ${amount.toLocaleString()} hit your account from ${transaction.description}! Your balance is looking healthy! 💪`,
        `Yasss! ${amount.toLocaleString()} just landed in your account! ${categoryEmoji} ${transaction.description} came through! 🔥`,
        `Money alert! ${amount.toLocaleString()} just entered the chat! ${transaction.description} is keeping you fed! 💰`,
        `Your account just got a glow-up! ${amount.toLocaleString()} from ${transaction.description} is giving main character energy! ✨`,
        `Bank account said "we up!" ${amount.toLocaleString()} from ${transaction.description} is the energy we need! 🚀`,
        `Your balance is serving looks! ${amount.toLocaleString()} from ${transaction.description} is chef's kiss! 👌`,
        `Money moves detected! ${amount.toLocaleString()} from ${transaction.description} is absolutely sending it! 💯`,
        `Your account is in its bag! ${amount.toLocaleString()} from ${transaction.description} is pure serotonin! 🎊`
      ];

      return {
        title: this.getRandomElement(creditTitles),
        body: `${greeting} ${this.getRandomElement(creditBodies)}`,
        emoji: "💰"
      };
    }

    // Debit notifications (money going out)
    const debitTitles = [
      "Transaction spotted! 👀",
      "Money on the move! 🏃",
      "Spending detected! 🕵️",
      "Transaction alert! 🔔",
      "Money flow! 💨",
      "Spend alert! ⚠️",
      "Transaction vibes! 📊",
      "Money movement! 🎯"
    ];

    const spendingContexts = [
      `Just spotted ${amountEmoji} ${amount.toLocaleString()} leaving your account for ${transaction.description}! ${categoryEmoji} We're keeping an eye on your spending patterns! 👀`,
      `Transaction alert! ${amount.toLocaleString()} went out for ${transaction.description}! ${categoryEmoji} Your money moves are being tracked! 🕵️`,
      `Money movement detected! ${amount.toLocaleString()} spent on ${transaction.description}! ${categoryEmoji} We're watching your financial journey! 📈`,
      `Spending spotted! ${amount.toLocaleString()} for ${transaction.description}! ${categoryEmoji} Your transaction game is being monitored! 🎯`,
      `Transaction in progress! ${amount.toLocaleString()} going out for ${transaction.description}! ${categoryEmoji} We're here for your money management! 💪`,
      `Money flow alert! ${amount.toLocaleString()} spent on ${transaction.description}! ${categoryEmoji} Your spending habits are under surveillance! 🔍`,
      `Transaction detected! ${amount.toLocaleString()} for ${transaction.description}! ${categoryEmoji} We're tracking your financial moves! 📊`,
      `Spending alert! ${amount.toLocaleString()} going out for ${transaction.description}! ${categoryEmoji} Your money moves are being analyzed! 🧠`
    ];

    // Add balance context if available
    let balanceContext = "";
    if (userBalance !== undefined) {
      const balanceEmoji = userBalance > 10000 ? "💰" : userBalance > 5000 ? "💵" : "🪙";
      balanceContext = ` Your current balance: ${balanceEmoji} ${userBalance.toLocaleString()}`;
    }

    return {
      title: this.getRandomElement(debitTitles),
      body: `${greeting} ${this.getRandomElement(spendingContexts)}${balanceContext}`,
      emoji: "👀"
    };
  }

  static generateMultipleTransactionNotification(
    transactions: ITransaction[],
    userName?: string,
    userBalance?: number
  ): NotificationData {
    const greeting = this.getPersonalizedGreeting(userName);
    const totalAmount = transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const creditCount = transactions.filter(t => t.type === "credit").length;
    const debitCount = transactions.filter(t => t.type === "debit").length;
    
    const titles = [
      "Multiple transactions detected! 🎯",
      "Transaction spree! 🚀",
      "Money moves galore! 💫",
      "Transaction party! 🎉",
      "Multiple alerts! 🔔",
      "Transaction marathon! 🏃",
      "Money flow overload! ⚡",
      "Transaction bonanza! 🎊"
    ];

    let body = "";
    if (creditCount > 0 && debitCount > 0) {
      body = `We spotted ${transactions.length} transactions today! ${creditCount} money in, ${debitCount} money out. Total activity: ${totalAmount.toLocaleString()}! Your account is busy! 🔥`;
    } else if (creditCount > 0) {
      body = `Multiple money moves detected! ${creditCount} transactions bringing in ${totalAmount.toLocaleString()}! Your account is getting fed! 💰`;
    } else {
      body = `Spending spree alert! ${debitCount} transactions totaling ${totalAmount.toLocaleString()}! We're tracking your money moves! 👀`;
    }

    if (userBalance !== undefined) {
      const balanceEmoji = userBalance > 10000 ? "💰" : userBalance > 5000 ? "💵" : "🪙";
      body += ` Current balance: ${balanceEmoji} ${userBalance.toLocaleString()}`;
    }

    return {
      title: this.getRandomElement(titles),
      body: `${greeting} ${body}`,
      emoji: "🎯"
    };
  }

  static generateBalanceUpdateNotification(
    oldBalance: number,
    newBalance: number,
    userName?: string
  ): NotificationData {
    const greeting = this.getPersonalizedGreeting(userName);
    const difference = newBalance - oldBalance;
    const isIncrease = difference > 0;
    const percentChange = Math.abs((difference / oldBalance) * 100);

    const titles = [
      "Balance update! 📊",
      "Account status change! 🔄",
      "Balance shift! ⚡",
      "Money update! 💰",
      "Account glow-up! ✨",
      "Balance movement! 🎯",
      "Financial update! 📈",
      "Account vibes! 🌟"
    ];

    let body = "";
    if (isIncrease) {
      const increaseEmojis = ["📈", "🚀", "💪", "🔥", "✨", "🎉", "💰", "💎"];
      const increaseEmoji = this.getRandomElement(increaseEmojis);
      body = `Your balance just went up by ${increaseEmoji} ${Math.abs(difference).toLocaleString()}! That's a ${percentChange.toFixed(1)}% increase! Your money is growing! 🌱`;
    } else {
      const decreaseEmojis = ["📉", "💸", "🔄", "⚡", "🎯", "📊", "💳", "🔄"];
      const decreaseEmoji = this.getRandomElement(decreaseEmojis);
      body = `Balance update: ${Math.abs(difference).toLocaleString()} went out! ${decreaseEmoji} That's a ${percentChange.toFixed(1)}% change. We're keeping track! 👀`;
    }

    body += ` New balance: ${newBalance.toLocaleString()}`;

    return {
      title: this.getRandomElement(titles),
      body: `${greeting} ${body}`,
      emoji: isIncrease ? "📈" : "📉"
    };
  }
}
