import NotificationRepository from "../repository/notifications";
import UserRepository from "../repository/user";
import UserService from "./user";
import { GenZNotificationGenerator } from "../utils/genzNotificationGenerator";
import sendPushNotification from "../utils/sendPushNotificatio";
import NotificationThrottler from "../utils/notificationThrottler";

const userService = new UserService();
class WebhookService {
  private userRepository: UserRepository;
  private notificationRepository: NotificationRepository;
  private notificationThrottler: NotificationThrottler;
  constructor() {
    this.userRepository = new UserRepository();
    this.notificationRepository = new NotificationRepository();
    this.notificationThrottler = NotificationThrottler.getInstance();
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

            console.log(transactions.newTransactions);

            const todaysTransaction =
              await userService.getCurrentDayTransactions(user._id as string);

            const totalTransactionAmount = todaysTransaction.reduce(
              (acc, transaction) => acc + transaction.amount,
              0
            );

            // Send personalized Gen Z notifications for new transactions
            if (
              transactions.newTransactions &&
              transactions.newTransactions.length > 0
            ) {
              await this.sendPersonalizedNotifications(
                user,
                transactions.newTransactions,
                newBalance,
                currentBalance
              );
            }

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

  private async sendPersonalizedNotifications(
    user: any,
    newTransactions: any[],
    newBalance: number,
    oldBalance: number
  ) {
    try {
      // Skip if user has notifications disabled
      if (user.preferences.notifications === "none") {
        return;
      }

      // Skip if user doesn't have a push token
      if (!user.pushToken) {
        console.log(
          `No push token for user ${user.email}, skipping notification`
        );
        return;
      }

      // Get queue status for this user
      const queueStatus = this.notificationThrottler.getQueueStatus(user._id);
      console.log(
        `📊 Notification queue status for ${user.email}:`,
        queueStatus
      );

      // If there are multiple transactions, prioritize summary notification
      if (newTransactions.length > 1) {
        const summaryNotification =
          GenZNotificationGenerator.generateMultipleTransactionNotification(
            newTransactions,
            user.fullName,
            newBalance
          );

        // Queue summary notification with batch priority
        await this.notificationThrottler.queueNotification(
          user._id,
          user.pushToken,
          summaryNotification.title,
          summaryNotification.body,
          {
            transactionCount: newTransactions.length,
            totalAmount: newTransactions.reduce(
              (sum, t) => sum + Math.abs(t.amount),
              0
            ),
            timestamp: new Date().toISOString(),
          },
          "transaction_summary",
          "batch"
        );

        console.log(
          `📋 Summary notification queued for ${user.email}: ${summaryNotification.title}`
        );
      } else {
        // Send individual notification for single transaction
        const transaction = newTransactions[0];
        const notification =
          GenZNotificationGenerator.generateTransactionNotification(
            transaction,
            user.fullName,
            newBalance
          );

        // Queue individual notification with normal priority
        await this.notificationThrottler.queueNotification(
          user._id,
          user.pushToken,
          notification.title,
          notification.body,
          {
            transactionId: transaction.transactionId,
            amount: transaction.amount,
            type: transaction.type,
            category: transaction.category,
            timestamp: new Date().toISOString(),
          },
          "transaction_alert",
          "normal"
        );

        console.log(
          `📋 Transaction notification queued for ${user.email}: ${notification.title}`
        );
      }

      // Send balance update notification if there's a significant change
      const balanceChange = Math.abs(newBalance - oldBalance);
      const balanceChangePercent = Math.abs((balanceChange / oldBalance) * 100);

      if (balanceChangePercent > 5) {
        // Only notify for changes > 5%
        const balanceNotification =
          GenZNotificationGenerator.generateBalanceUpdateNotification(
            oldBalance,
            newBalance,
            user.fullName
          );

        // Queue balance notification with normal priority
        await this.notificationThrottler.queueNotification(
          user._id,
          user.pushToken,
          balanceNotification.title,
          balanceNotification.body,
          {
            oldBalance,
            newBalance,
            change: newBalance - oldBalance,
            timestamp: new Date().toISOString(),
          },
          "balance_update",
          "normal"
        );

        console.log(
          `📋 Balance notification queued for ${user.email}: ${balanceNotification.title}`
        );
      }
    } catch (error) {
      console.error("Error queuing personalized notifications:", error);
      // Don't throw error to avoid breaking the webhook flow
    }
  }
}

export default WebhookService;
