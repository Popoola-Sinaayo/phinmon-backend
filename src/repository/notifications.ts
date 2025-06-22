import Notification, { INotification } from "../model/notifications";

class NotificationRepository {
  async createNotification(notificationData: Partial<INotification>) {
    const notification = await Notification.create(notificationData);
    return notification;
  }

  async getNotificationsByUserId(userId: string) {
    const notifications = await Notification.find({ userId }).sort({
      createdAt: -1,
    });
    return notifications;
  }
  async markNotificationAsRead(notificationId: string) {
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );
    return notification;
  }
}

export default NotificationRepository;
