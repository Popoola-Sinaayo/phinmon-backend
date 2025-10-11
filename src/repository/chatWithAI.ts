import ChatWithAI, { IChatWithAI } from "../model/chatWithAI";

class ChatWithAIRepository {
  async createChat(chatData: Partial<IChatWithAI>) {
    const chat = await ChatWithAI.create(chatData);
    return chat;
  }

  async getChatsByUserId(userId: string, limit?: number) {
    const query = ChatWithAI.find({ userId }).sort({ timestamp: -1 });
    if (limit) {
      query.limit(limit);
    }
    const chats = await query.exec();
    return chats;
  }

  async getChatById(chatId: string) {
    const chat = await ChatWithAI.findById(chatId);
    return chat;
  }

  async deleteChatById(chatId: string) {
    const chat = await ChatWithAI.findByIdAndDelete(chatId);
    return chat;
  }

  async deleteChatsByUserId(userId: string) {
    const result = await ChatWithAI.deleteMany({ userId });
    return result;
  }
}

export default ChatWithAIRepository;
