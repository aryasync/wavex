import { config } from "../config/index.js";
import { generateId } from "../utils/date.util.js";
import { readJsonFile, writeJsonFile } from "../utils/file.util.js";

export class NotificationService {
  constructor() {
    this.dataFilePath = config.data.notificationsFilePath;
  }


  /**
   * Get all notifications with optional filters
   */
  async getNotifications(filters = {}) {
    const notifications = readJsonFile(this.dataFilePath);
    
    let filteredNotifications = [...notifications];

    // Filter by type
    if (filters.type) {
      filteredNotifications = filteredNotifications.filter(
        notification => notification.type === filters.type
      );
    }

    // Filter by read status
    if (filters.isRead !== undefined) {
      filteredNotifications = filteredNotifications.filter(
        notification => notification.isRead === filters.isRead
      );
    }

    // Sort by createdAt (newest first)
    return filteredNotifications.sort((a, b) => b.createdAt - a.createdAt);
  }

  /**
   * Get a single notification by ID
   */
  async getNotificationById(id) {
    const notifications = readJsonFile(this.dataFilePath);
    return notifications.find(notification => notification.id === id) || null;
  }

  /**
   * Create a new notification
   */
  async createNotification(notificationData) {
    const notifications = readJsonFile(this.dataFilePath);
    
    const notification = {
      id: generateId(),
      type: notificationData.type,
      message: notificationData.message,
      createdAt: Math.floor(Date.now() / 1000), // Unix timestamp
      isRead: false,
      itemId: notificationData.itemId || null
    };

    notifications.push(notification);
    writeJsonFile(this.dataFilePath, notifications);
    
    return notification;
  }


  /**
   * Delete notifications by IDs
   */
  async deleteNotifications(ids) {
    const notifications = readJsonFile(this.dataFilePath);
    const initialLength = notifications.length;
    
    // Filter out notifications with matching IDs
    const filteredNotifications = notifications.filter(
      notification => !ids.includes(notification.id)
    );
    
    const deletedCount = initialLength - filteredNotifications.length;
    
    writeJsonFile(this.dataFilePath, filteredNotifications);
    
    return {
      success: true,
      deletedCount,
      message: `Deleted ${deletedCount} notification(s)`
    };
  }

  /**
   * Update existing notification
   */
  async updateNotification(id, updateData, readAll = false) {
    const notifications = readJsonFile(this.dataFilePath);
    
    // Special case: if readAll is true, mark all as read
    if (readAll && updateData.isRead !== undefined) {
      let updatedCount = 0;
      
      for (let i = 0; i < notifications.length; i++) {
        if (notifications[i].isRead !== updateData.isRead) {
          notifications[i].isRead = updateData.isRead;
          updatedCount++;
        }
      }
  
      writeJsonFile(this.dataFilePath, notifications);
      
      return {
        success: true,
        updatedCount,
        message: `Updated ${updatedCount} notification(s)`
      };
    }
    
    // Normal single notification update
    const notificationIndex = notifications.findIndex(notification => notification.id === id);

    if (notificationIndex === -1) {
      throw new Error("Notification not found");
    }

    // Whitelist approach: Only allow specific fields to be updated
    const allowedFields = config.business.notificationUpdatableFields;
    const allowedUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(([key]) => allowedFields.includes(key))
    );

    // Update notification with only allowed fields
    notifications[notificationIndex] = { ...notifications[notificationIndex], ...allowedUpdateData };

    writeJsonFile(this.dataFilePath, notifications);
    
    return notifications[notificationIndex];
  }

  /**
   * Get notification statistics
   */
  async getNotificationStats() {
    const notifications = readJsonFile(this.dataFilePath);
    
    const total = notifications.length;
    const unread = notifications.filter(n => !n.isRead).length;

    return {
      total: total,
      unread: unread,
      read: total - unread,
    };
  }
}
