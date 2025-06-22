import NotificationRepository from "../repository/notifications";
import UserRepository from "../repository/user";
import UserService from "./user";

const userService = new UserService();
class WebhookService {
    private userRepository: UserRepository;
    private notificationRepository: NotificationRepository
  constructor() {
      this.userRepository = new UserRepository();
      this.notificationRepository = new NotificationRepository();
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
              const currentBalance = user.balance || 0;
              const newBalance = eventData.account.balance || 0;
              const percent = (newBalance - currentBalance) / currentBalance;
              await this.userRepository.updateUser(user._id as string, {
                balance: eventData.account.balance,
                $inc: {
                  currentPercent: percent,
                } as any,
              });
              const transactions = await userService.getRealTimeTransactions(
                user._id as string
              );

              const todaysTransaction =
                await userService.getCurrentDayTransactions(user._id as string);

              const totalTransactionAmount = todaysTransaction.reduce(
                (acc, transaction) => acc + transaction.amount,
                0
              );

              if (user.preferences.notifications === "all") {
                // Send notification to user
                console.log(
                  `Notification sent to ${user.email}: Balance updated to ${eventData.account.balance}`
                );
              } else if (
                user.preferences.notifications === "over_set_amount" &&
                totalTransactionAmount > user.preferences.notificationSetAmount
              ) {
                // Send notification to user
                console.log(
                  `Notification sent to ${user.email}: Balance updated to ${eventData.account.balance} and transaction amount exceeded set limit`
                );
              } else if (
                user.preferences.notifications === "balance_below_amount" &&
                newBalance < user.preferences.notificationSetAmount
              ) {
                // Send notification to user
                console.log(
                  `Notification sent to ${user.email}: Balance below set amount of ${user.preferences.notificationSetAmount}`
                );
              }
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
