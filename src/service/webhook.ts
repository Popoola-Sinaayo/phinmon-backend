import UserRepository from "../repository/user";
import UserService from "./user";

const userService = new UserService();
class WebhookService {
  private userRepository: UserRepository;
  constructor() {
    this.userRepository = new UserRepository();
  }

  async handleMonoWebhook(data: any) {
    try {
      const { event, data: eventData } = data;

      if (event === "mono.events.account_updated") {
        if (eventData?.account?.accountNumber) {
          const user = await this.userRepository.getUserByMonoAccountId(
            eventData.account._id
          );
          if (user) {
            await this.userRepository.updateUser(user._id as string, {
              balance: eventData.account.balance,
            });
            const transactions = await userService.getRealTimeTransactions(
              user._id as string
            );
            console.log(transactions.newTransactions);
          }
        }
      }
    } catch (error) {
      console.error("Error in handleMonoWebhook:", error);
      throw new Error("Failed to handle Mono webhook");
    }
  }
}

export default WebhookService;
