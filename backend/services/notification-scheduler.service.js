import cron from 'node-cron';
import { NotificationService } from './notifications.service.js';
import ItemService from './items.service.js';
import { isDateInPast, isDateWithinDays, getDaysUntilExpiry } from '../utils/date.util.js';

export class NotificationSchedulerService {
  constructor() {
    this.notificationService = new NotificationService();
    this.itemService = new ItemService();
    this.isRunning = false;
  }

  /**
   * Start the notification scheduler
   */
  start() {
    if (this.isRunning) {
      console.log('Notification scheduler is already running');
      return;
    }

    // Schedule daily check at 9:00 AM
    cron.schedule('0 9 * * *', async () => {
      console.log('Running daily notification check...');
      await this.checkAllNotifications();
    });

    this.isRunning = true;
    console.log('Notification scheduler started');
  }

  /**
   * Stop the notification scheduler
   */
  stop() {
    cron.destroy();
    this.isRunning = false;
    console.log('Notification scheduler stopped');
  }

  /**
   * Manually trigger notification check (for demos)
   */
  async triggerNotificationCheck() {
    console.log('Manually triggering notification check...');
    return await this.checkAllNotifications();
  }

  /**
   * Check all items and create appropriate notifications (optimized)
   */
  async checkAllNotifications() {
    try {
      // Single call to get all items with recalculated expiry dates
      const allItems = await this.itemService.getItems();
      
      // Get all existing notifications in one call
      const allNotifications = await this.notificationService.getNotifications();
      
      // Create lookup maps for existing notifications
      const existingWarnings = new Set(
        allNotifications
          .filter(n => n.type === 'item_expiry_warning')
          .map(n => n.itemId)
      );
      
      const existingExpired = new Set(
        allNotifications
          .filter(n => n.type === 'item_expired')
          .map(n => n.itemId)
      );

      const results = {
        expiringWarnings: 0,
        expiredItems: 0,
        errors: []
      };

      // Process all items in one pass
      const notificationsToCreate = [];

      for (const item of allItems) {
        try {
          const isExpired = isDateInPast(item.expiryDate);
          const isExpiring = !isExpired && isDateWithinDays(item.expiryDate, 3);

          // Create expiry warning notification
          if (isExpiring && !existingWarnings.has(item.id)) {
            const daysUntilExpiry = getDaysUntilExpiry(item.expiryDate);
            notificationsToCreate.push({
              type: 'item_expiry_warning',
              message: `${item.name} expires in ${daysUntilExpiry} day${daysUntilExpiry !== 1 ? 's' : ''}`,
              itemId: item.id
            });
            results.expiringWarnings++;
          }

          // Create expired notification
          if (isExpired && !existingExpired.has(item.id)) {
            notificationsToCreate.push({
              type: 'item_expired',
              message: `${item.name} has expired`,
              itemId: item.id
            });
            results.expiredItems++;
          }
        } catch (error) {
          console.error(`Error processing item ${item.id}:`, error);
          results.errors.push(`Item ${item.id}: ${error.message}`);
        }
      }

      // Create all notifications using existing service
      for (const notificationData of notificationsToCreate) {
        await this.notificationService.createNotification(notificationData);
      }
      
      if (notificationsToCreate.length > 0) {
        console.log(`Created ${notificationsToCreate.length} notifications`);
      }

      console.log(`Notification check completed: ${results.expiringWarnings} warnings, ${results.expiredItems} expired items`);
      return results;
    } catch (error) {
      console.error('Error in notification check:', error);
      throw error;
    }
  }


  /**
   * Get scheduler status
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      schedules: [
        { name: 'Daily Check', cron: '0 9 * * *', description: 'Check for expiring/expired items at 9 AM daily' },
      ]
    };
  }
}
