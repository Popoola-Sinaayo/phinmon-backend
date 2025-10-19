import NotificationThrottler from "../utils/notificationThrottler";

// Demo function to show throttling in action
async function demonstrateThrottling() {
  console.log("🚀 Notification Throttling Demo");
  console.log("=" .repeat(50));
  
  const throttler = NotificationThrottler.getInstance();
  
  // Update config for demo (shorter intervals for testing)
  throttler.updateConfig({
    minIntervalMinutes: 1, // 1 minute between notifications for demo
    maxNotificationsPerHour: 5, // Max 5 per hour for demo
    batchDelayMinutes: 0.5 // 30 seconds batch delay for demo
  });
  
  const testUserId = "demo_user_123";
  const testPushToken = "ExponentPushToken[test_token_123]";
  
  console.log("\n📱 Simulating rapid transaction notifications...");
  
  // Simulate multiple rapid transactions
  const transactions = [
    { amount: 1000, description: "Coffee ☕", type: "debit" },
    { amount: 2500, description: "Lunch 🍕", type: "debit" },
    { amount: 500, description: "Bus fare 🚌", type: "debit" },
    { amount: 15000, description: "Salary 💰", type: "credit" },
    { amount: 800, description: "Snacks 🍿", type: "debit" }
  ];
  
  // Queue all notifications rapidly
  for (let i = 0; i < transactions.length; i++) {
    const transaction = transactions[i];
    const title = transaction.type === "credit" ? "Money in! 💰" : "Spending alert! 💸";
    const body = `${transaction.type === "credit" ? "Received" : "Spent"} ${transaction.amount} for ${transaction.description}`;
    
    await throttler.queueNotification(
      testUserId,
      testPushToken,
      title,
      body,
      { transaction: transaction, timestamp: new Date().toISOString() },
      "transaction_alert",
      i === 0 ? "immediate" : "normal" // First one immediate, rest normal
    );
    
    console.log(`📋 Queued notification ${i + 1}: ${title}`);
    
    // Check queue status
    const status = throttler.getQueueStatus(testUserId);
    console.log(`   Queue status: ${status.queuedCount} queued, can send now: ${status.canSendNow}`);
  }
  
  console.log("\n⏰ Waiting for throttler to process queue...");
  console.log("(In real app, this would happen automatically every 30 seconds)");
  
  // Simulate processing by checking status every 10 seconds
  for (let i = 0; i < 6; i++) {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds for demo
    
    const status = throttler.getQueueStatus(testUserId);
    console.log(`\n📊 Status after ${(i + 1) * 2} seconds:`);
    console.log(`   Queued: ${status.queuedCount}`);
    console.log(`   Can send now: ${status.canSendNow}`);
    console.log(`   Hourly count: ${status.hourlyCount}`);
    
    if (status.nextNotificationTime) {
      console.log(`   Next notification: ${status.nextNotificationTime.toLocaleTimeString()}`);
    }
    
    if (status.queuedCount === 0) {
      console.log("✅ All notifications processed!");
      break;
    }
  }
  
  console.log("\n🎯 Throttling Demo Complete!");
  console.log("\nKey Features Demonstrated:");
  console.log("• ⏱️  Minimum interval between notifications");
  console.log("• 📊 Hourly notification limits");
  console.log("• 🎯 Priority-based queuing (immediate, normal, batch)");
  console.log("• 🔄 Automatic retry on failures");
  console.log("• 📋 Queue status monitoring");
}

// Run demo if called directly
if (require.main === module) {
  demonstrateThrottling().catch(console.error);
}

export { demonstrateThrottling };