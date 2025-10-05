import fs from "fs/promises";
import { config } from "../config/index.js";
import { generateId } from "../utils/date.util.js";

export class NotificationService {
  constructor() {
    this.dataFilePath = config.data.notificationsFilePath;
  }

  /**
   * Load notifications from file
   */
  async loadNotifications() {
    try {
      const data = await fs.readFile(this.dataFilePath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      // If file doesn't exist or is empty, return empty array
      if (error.code === "ENOENT") {
        return [];
      }
      throw error;
    }
  }

  /**
   * Save notifications to file
   */
  async saveNotifications(notifications) {
    await fs.writeFile(this.dataFilePath, JSON.stringify(notifications, null, 2));
  }

  /**
   * Get all notifications with optional filters
   */
  async getNotifications(filters = {}) {
    const notifications = await this.loadNotifications();
    
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
    const notifications = await this.loadNotifications();
    return notifications.find(notification => notification.id === id) || null;
  }

  /**
   * Create a new notification
   */
  async createNotification(notificationData) {
    const notifications = await this.loadNotifications();
    
    const notification = {
      id: generateId(),
      type: notificationData.type,
      message: notificationData.message,
      createdAt: Math.floor(Date.now() / 1000), // Unix timestamp
      isRead: false,
      itemId: notificationData.itemId || null
    };

    notifications.push(notification);
    await this.saveNotifications(notifications);
    
    return notification;
  }


  /**
   * Delete notifications by IDs
   */
  async deleteNotifications(ids) {
    const notifications = await this.loadNotifications();
    const initialLength = notifications.length;
    
    // Filter out notifications with matching IDs
    const filteredNotifications = notifications.filter(
      notification => !ids.includes(notification.id)
    );
    
    const deletedCount = initialLength - filteredNotifications.length;
    
    await this.saveNotifications(filteredNotifications);
    
    return {
      success: true,
      deletedCount,
      message: `Deleted ${deletedCount} notification(s)`
    };
  }

  /**
   * Update existing notification
   */
  async updateNotification(id, updateData) {
    const notifications = await this.loadNotifications();
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

    await this.saveNotifications(notifications);
    
    return notifications[notificationIndex];
  }

  /**
   * Get notification statistics
   */
  async getNotificationStats() {
    const notifications = await this.loadNotifications();
    
    const total = notifications.length;
    const unread = notifications.filter(n => !n.isRead).length;

    return {
      total: total,
      unread: unread,
      read: total - unread,
    };
  }
}
