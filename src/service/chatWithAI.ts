import { BaseError } from "../error";
import UserRepository from "../repository/user";
import TransactionRepository from "../repository/transaction";
import { chatWithAIEngine } from "../utils/aiAnalyzer";

class ChatWithAIService {
  private userRepository: UserRepository;
  private transactionRepository: TransactionRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.transactionRepository = new TransactionRepository();
  }

  async chatWithAI(userId: string, question: string) {
    try {
      const user = await this.userRepository.getUserById(userId);
      if (!user) {
        throw new BaseError("User not found", 404);
      }

      // Get user's transactions for context
      const transactions = await this.transactionRepository.getTransactionForUser(userId);
      
      if (!transactions || transactions.length === 0) {
        throw new BaseError("No transactions found. Please sync your transactions first.", 400);
      }

      // Format transactions for AI analysis
      const formattedTransactions = transactions.map(transaction => ({
        amount: transaction.amount,
        category: transaction.category,
        date: transaction.date
      }));

      // Get AI response
      const aiResponse = await chatWithAIEngine(formattedTransactions, question);
      
      return {
        question,
        answer: aiResponse,
        timestamp: new Date()
      };
    } catch (error) {
      console.error("Error in chatWithAI:", error);
      throw new BaseError("Failed to get AI response", 500);
    }
  }
}

export default ChatWithAIService;
