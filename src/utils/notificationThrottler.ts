interface QueuedNotification {
  userId: string;
  pushToken: string;
  title: string;
  body: string;
  data: any;
  type: string;
  scheduledTime: Date;
  retryCount: number;
}

interface ThrottleConfig {
  minIntervalMinutes: number;
  maxNotificationsPerHour: number;
  batchDelayMinutes: number;
}

class NotificationThrottler {
  private static instance: NotificationThrottler;
  private notificationQueue: Map<string, QueuedNotification[]> = new Map();
  private lastNotificationTime: Map<string, Date> = new Map();
  private notificationCounts: Map<string, { count: number; resetTime: Date }> = new Map();
  private processingInterval: NodeJS.Timeout | null = null;
  
  private config: ThrottleConfig = {
    minIntervalMinutes: 3, // Minimum 3 minutes between notifications
    maxNotificationsPerHour: 10, // Max 10 notifications per hour per user
    batchDelayMinutes: 2, // Wait 2 minutes before sending batched notifications
  };

  private constructor() {
    this.startProcessingQueue();
  }

  static getInstance(): NotificationThrottler {
    if (!NotificationThrottler.instance) {
      NotificationThrottler.instance = new NotificationThrottler();
    }
    return NotificationThrottler.instance;
  }

  private startProcessingQueue() {
    // Process the queue every 30 seconds
    this.processingInterval = setInterval(() => {
      this.processQueue();
    }, 30000);
  }

  private async processQueue() {
    const now = new Date();
    
    for (const [userId, notifications] of this.notificationQueue.entries()) {
      const readyNotifications = notifications.filter(
        notification => notification.scheduledTime <= now
      );

      if (readyNotifications.length > 0) {
        // Check if we can send notifications to this user
        if (this.canSendNotification(userId)) {
          // Send the oldest ready notification
          const notificationToSend = readyNotifications[0];
          
          try {
            await this.sendNotification(notificationToSend);
            this.updateLastNotificationTime(userId);
            this.incrementNotificationCount(userId);
            
            // Remove the sent notification from queue
            const updatedNotifications = notifications.filter(
              n => n !== notificationToSend
            );
            
            if (updatedNotifications.length === 0) {
              this.notificationQueue.delete(userId);
            } else {
              this.notificationQueue.set(userId, updatedNotifications);
            }
            
            console.log(`📱 Throttled notification sent to user ${userId}: ${notificationToSend.title}`);
          } catch (error) {
            console.error(`Error sending throttled notification to user ${userId}:`, error);
            this.handleNotificationError(notificationToSend);
          }
        }
      }
    }
  }

  private canSendNotification(userId: string): boolean {
    const now = new Date();
    
    // Check minimum interval
    const lastTime = this.lastNotificationTime.get(userId);
    if (lastTime) {
      const timeDiff = now.getTime() - lastTime.getTime();
      const minutesDiff = timeDiff / (1000 * 60);
      
      if (minutesDiff < this.config.minIntervalMinutes) {
        return false;
      }
    }

    // Check hourly limit
    const countData = this.notificationCounts.get(userId);
    if (countData) {
      // Reset count if hour has passed
      if (now >= countData.resetTime) {
        this.notificationCounts.delete(userId);
      } else if (countData.count >= this.config.maxNotificationsPerHour) {
        return false;
      }
    }

    return true;
  }

  private updateLastNotificationTime(userId: string) {
    this.lastNotificationTime.set(userId, new Date());
  }

  private incrementNotificationCount(userId: string) {
    const now = new Date();
    const countData = this.notificationCounts.get(userId);
    
    if (!countData) {
      // First notification this hour
      this.notificationCounts.set(userId, {
        count: 1,
        resetTime: new Date(now.getTime() + 60 * 60 * 1000) // Reset in 1 hour
      });
    } else {
      countData.count++;
    }
  }

  private async sendNotification(notification: QueuedNotification) {
    // Import here to avoid circular dependencies
    const sendPushNotification = (await import("./sendPushNotificatio")).default;
    const NotificationRepository = (await import("../repository/notifications")).default;
    
    const notificationRepo = new NotificationRepository();
    
    // Send push notification
    await sendPushNotification(
      notification.pushToken,
      notification.title,
      notification.body,
      notification.body,
      notification.data
    );

    // Store in database
    await notificationRepo.createNotification({
      userId: notification.userId,
      title: notification.title,
      message: notification.body,
      type: notification.type as any,
      data: notification.data
    });
  }

  private handleNotificationError(notification: QueuedNotification) {
    notification.retryCount++;
    
    if (notification.retryCount < 3) {
      // Retry after 5 minutes
      notification.scheduledTime = new Date(Date.now() + 5 * 60 * 1000);
      console.log(`🔄 Retrying notification for user ${notification.userId} in 5 minutes (attempt ${notification.retryCount})`);
    } else {
      // Remove from queue after 3 failed attempts
      const userNotifications = this.notificationQueue.get(notification.userId) || [];
      const updatedNotifications = userNotifications.filter(n => n !== notification);
      
      if (updatedNotifications.length === 0) {
        this.notificationQueue.delete(notification.userId);
      } else {
        this.notificationQueue.set(notification.userId, updatedNotifications);
      }
      
      console.error(`❌ Failed to send notification to user ${notification.userId} after 3 attempts`);
    }
  }

  public async queueNotification(
    userId: string,
    pushToken: string,
    title: string,
    body: string,
    data: any,
    type: string,
    priority: 'immediate' | 'normal' | 'batch' = 'normal'
  ): Promise<void> {
    const now = new Date();
    let scheduledTime: Date;

    switch (priority) {
      case 'immediate':
        // Send immediately if possible, otherwise queue with minimal delay
        if (this.canSendNotification(userId)) {
          scheduledTime = now;
        } else {
          scheduledTime = new Date(now.getTime() + 1 * 60 * 1000); // 1 minute delay
        }
        break;
      
      case 'batch':
        // Wait for batch delay before sending
        scheduledTime = new Date(now.getTime() + this.config.batchDelayMinutes * 60 * 1000);
        break;
      
      case 'normal':
      default:
        // Check if we can send now, otherwise queue with interval delay
        if (this.canSendNotification(userId)) {
          scheduledTime = now;
        } else {
          const lastTime = this.lastNotificationTime.get(userId);
          if (lastTime) {
            scheduledTime = new Date(lastTime.getTime() + this.config.minIntervalMinutes * 60 * 1000);
          } else {
            scheduledTime = new Date(now.getTime() + 1 * 60 * 1000);
          }
        }
        break;
    }

    const queuedNotification: QueuedNotification = {
      userId,
      pushToken,
      title,
      body,
      data,
      type,
      scheduledTime,
      retryCount: 0
    };

    // Add to queue
    const existingNotifications = this.notificationQueue.get(userId) || [];
    existingNotifications.push(queuedNotification);
    this.notificationQueue.set(userId, existingNotifications);

    console.log(`📋 Notification queued for user ${userId}, scheduled for ${scheduledTime.toISOString()}`);
  }

  public getQueueStatus(userId: string): {
    queuedCount: number;
    nextNotificationTime: Date | null;
    canSendNow: boolean;
    hourlyCount: number;
  } {
    const queuedNotifications = this.notificationQueue.get(userId) || [];
    const nextNotification = queuedNotifications.length > 0 
      ? queuedNotifications.reduce((earliest, current) => 
          current.scheduledTime < earliest.scheduledTime ? current : earliest
        )
      : null;
    
    const countData = this.notificationCounts.get(userId);
    
    return {
      queuedCount: queuedNotifications.length,
      nextNotificationTime: nextNotification?.scheduledTime || null,
      canSendNow: this.canSendNotification(userId),
      hourlyCount: countData?.count || 0
    };
  }

  public clearUserQueue(userId: string): void {
    this.notificationQueue.delete(userId);
    this.lastNotificationTime.delete(userId);
    this.notificationCounts.delete(userId);
    console.log(`🧹 Cleared notification queue for user ${userId}`);
  }

  public updateConfig(newConfig: Partial<ThrottleConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log(`⚙️ Updated throttling config:`, this.config);
  }

  public destroy(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
  }
}

export default NotificationThrottler;