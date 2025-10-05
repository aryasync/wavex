import path from "path";

export const config = {
  // Server configuration
  server: {
    port: process.env.PORT || 3001,
    host: process.env.HOST || "localhost",
  },

  // Data configuration
  data: {
    filePath: path.join(process.cwd(), "data", "items.data.json"),
  },

  // Business logic constants
  business: {
    expiryWarningDays: 3, // Warn 3 days before expiry
    maxItemsPerUser: 100,
    validCategories: ["dairy", "meat", "produce", "pantry", "other"],
    validStatuses: ["pending", "confirmed"],
    validGeneratedBy: ["manual", "ai"],
    validSources: ["receipt", "groceries"],

    // Fields that users are allowed to update
    // Note: expiryDate is calculated automatically from purchasedDate + expiryPeriod
    itemsUpdatableFields: [
      "name",
      "category",
      "expiryPeriod",
      "purchasedDate",
      "status",
    ],

    // TODO: Notification fields (when implemented)
    // notificationUpdatableFields: [
    //   "title",
    //   "message",
    //   "isRead",
    //   "priority"
    // ]
  },

  API_Key: process.env.OPENAI_API_KEY,

  // API configuration
  api: {
    version: "v1",
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    },
  },
};
