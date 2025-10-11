import Transaction, { ITransaction } from "../model/transactions";

class TransactionRepository {
  async createTransaction(transactions: Partial<ITransaction>) {
    const transaction = await Transaction.create(transactions);
    return transaction;
  }

  async getTransactionByTransactionId(transactionId: string) {
    const transaction = await Transaction.findOne({ transactionId });
    return transaction;
  }

  async updateTransactionByTransactionId(
    transactionId: string,
    updateData: Partial<ITransaction>
  ) {
    const transaction = await Transaction.findOneAndUpdate(
      { transactionId },
      updateData,
      { new: true }
    );
    return transaction;
  }
  async getTransactionForUser(userId: string) {
    const transactions = await Transaction.find({ userId }).sort({ date: -1 });
    return transactions;
  }

  async getTransactionByDateRange(
    userId: string,
    startDate: string,
    endDate: string
  ) {
    const startOfDay = new Date(startDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);

    const transactions = await Transaction.find({
      userId,
      date: { $gte: startOfDay, $lte: endOfDay },
    }).sort({ date: -1 });
    
    return transactions;
  }
}

export default TransactionRepository;
