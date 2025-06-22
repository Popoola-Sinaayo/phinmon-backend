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
    const transactions = await Transaction.find({ userId });
    return transactions;
  }

  async getTransactionByDateRange(
    userId: string,
    startDate: string,
    endDate: string
  ) {
    const transactions = await Transaction.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    });
    return transactions;
  }
}

export default TransactionRepository;
