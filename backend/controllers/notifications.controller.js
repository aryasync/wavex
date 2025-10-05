import { NotificationService } from "../services/notifications.service.js";
import { config } from "../config/index.js";

const notificationService = new NotificationService();

/**
 * Get notifications with optional filters and ID support
 * GET /api/notifications?type=item_expiry_warning&isRead=false
 * GET /api/notifications?ids[]=id1&ids[]=id2&ids[]=id3
 */
export const getNotifications = async (req, res) => {
  try {
    const { type, isRead, ids } = req.query;
    
    // Validate filters against whitelist
    if (type && !config.business.validNotificationTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: `Invalid notification type. Valid types: ${config.business.validNotificationTypes.join(", ")}`
      });
    }

    // Convert isRead string to boolean
    let isReadBoolean;
    if (isRead !== undefined) {
      if (isRead === 'true') {
        isReadBoolean = true;
      } else if (isRead === 'false') {
        isReadBoolean = false;
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid isRead value. Must be 'true' or 'false'"
        });
      }
    }

    let notifications = [];

    // Handle array of IDs from query parameter
    if (ids && ids.length > 0) {
      const idArray = Array.isArray(ids) ? ids : [ids];
      const allNotifications = await notificationService.loadNotifications();
      notifications = allNotifications.filter(notification => 
        idArray.includes(notification.id)
      );
    }
    // Handle filters for all notifications
    else {
      const filters = {};
      if (type) filters.type = type;
      if (isReadBoolean !== undefined) filters.isRead = isReadBoolean;
      notifications = await notificationService.getNotifications(filters);
    }

    res.json({
      success: true,
      data: notifications,
      count: notifications.length,
      filters: { type, isRead: isReadBoolean, ids }
    });
  } catch (error) {
    console.error("Error getting notifications:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve notifications"
    });
  }
};


/**
 * Create a new notification
 * POST /api/notifications
 */
export const createNotification = async (req, res) => {
  try {
    const { type, message, itemId } = req.body;

    // Validate required fields
    if (!type || !message) {
      return res.status(400).json({
        success: false,
        message: "Type and message are required"
      });
    }

    // Validate notification type
    if (!config.business.validNotificationTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: `Invalid notification type. Valid types: ${config.business.validNotificationTypes.join(", ")}`
      });
    }

    const notification = await notificationService.createNotification({
      type,
      message,
      itemId
    });

    res.status(201).json({
      success: true,
      data: notification,
      message: "Notification created successfully"
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create notification"
    });
  }
};


/**
 * Delete notifications by IDs
 * DELETE /api/notifications
 */
export const deleteNotifications = async (req, res) => {
  try {
    const { ids } = req.body;

    // Validate that ids is an array
    if (!Array.isArray(ids)) {
      return res.status(400).json({
        success: false,
        message: "Ids must be an array"
      });
    }

    if (ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one notification ID must be provided"
      });
    }

    const result = await notificationService.deleteNotifications(ids);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error("Error deleting notifications:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete notifications"
    });
  }
};

/**
 * Update a notification
 * PUT /api/notifications/:id
 */
export const updateNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Notification ID is required"
      });
    }

    const updatedNotification = await notificationService.updateNotification(id, updateData);

    res.json({
      success: true,
      data: updatedNotification,
      message: "Notification updated successfully"
    });
  } catch (error) {
    console.error("Error updating notification:", error);
    if (error.message === "Notification not found") {
      res.status(404).json({
        success: false,
        message: "Notification not found"
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to update notification"
      });
    }
  }
};

/**
 * Get notification statistics
 * GET /api/notifications/stats
 */
export const getNotificationStats = async (req, res) => {
  try {
    const stats = await notificationService.getNotificationStats();

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error("Error getting notification stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve notification statistics"
    });
  }
};
