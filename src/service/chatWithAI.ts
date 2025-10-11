import { BaseError } from "../error";
import UserRepository from "../repository/user";
import TransactionRepository from "../repository/transaction";
import ChatWithAIRepository from "../repository/chatWithAI";
import { chatWithAIEngine } from "../utils/aiAnalyzer";

class ChatWithAIService {
  private userRepository: UserRepository;
  private transactionRepository: TransactionRepository;
  private chatWithAIRepository: ChatWithAIRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.transactionRepository = new TransactionRepository();
    this.chatWithAIRepository = new ChatWithAIRepository();
  }

  async chatWithAI(userId: string, question: string) {
    try {
      const user = await this.userRepository.getUserById(userId);
      if (!user) {
        throw new BaseError("User not found", 404);
      }

      // Get user's transactions for context
      const transactions =
        await this.transactionRepository.getTransactionForUser(userId);

      if (!transactions || transactions.length === 0) {
        throw new BaseError(
          "No transactions found. Please sync your transactions first.",
          400
        );
      }

      // Format transactions for AI analysis
      const formattedTransactions = transactions.map((transaction) => ({
        amount: transaction.amount,
        category: transaction.category,
        date: transaction.date,
      }));

      // Get AI response
      const aiResponse = await chatWithAIEngine(
        formattedTransactions,
        question
      );

      // Save the chat conversation to database
      const savedChat = await this.chatWithAIRepository.createChat({
        userId,
        question,
        answer: aiResponse,
        timestamp: new Date(),
      });

      return {
        id: savedChat._id,
        question,
        answer: aiResponse,
        timestamp: savedChat.timestamp,
      };
    } catch (error) {
      console.error("Error in chatWithAI:", error);
      throw new BaseError("Failed to get AI response", 500);
    }
  }

  async getChatHistory(userId: string, limit?: number) {
    try {
      const user = await this.userRepository.getUserById(userId);
      if (!user) {
        throw new BaseError("User not found", 404);
      }

      const chatHistory = await this.chatWithAIRepository.getChatsByUserId(
        userId,
        limit
      );
      return chatHistory;
    } catch (error) {
      console.error("Error in getChatHistory:", error);
      throw new BaseError("Failed to get chat history", 500);
    }
  }

  async deleteChat(userId: string, chatId: string) {
    try {
      const user = await this.userRepository.getUserById(userId);
      if (!user) {
        throw new BaseError("User not found", 404);
      }

      const chat = await this.chatWithAIRepository.getChatById(chatId);
      if (!chat) {
        throw new BaseError("Chat not found", 404);
      }

      if (chat.userId !== userId) {
        throw new BaseError("Unauthorized to delete this chat", 403);
      }

      const deletedChat = await this.chatWithAIRepository.deleteChatById(
        chatId
      );
      return deletedChat;
    } catch (error) {
      console.error("Error in deleteChat:", error);
      throw new BaseError("Failed to delete chat", 500);
    }
  }
}

export default ChatWithAIService;
