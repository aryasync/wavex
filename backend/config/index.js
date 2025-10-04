import path from "path";

export const config = {
  // Server configuration
  server: {
    port: process.env.PORT || 3001,
    host: process.env.HOST || "localhost"
  },
  
  // Data configuration
  data: {
    filePath: path.join(process.cwd(), "data", "items.data.json")
  },
  
  // Business logic constants
  business: {
    expiryWarningDays: 3, // Warn 3 days before expiry
    maxItemsPerUser: 100,
    supportedCategories: [
      "dairy", 
      "meat", 
      "produce", 
      "beverages", 
      "other"
    ]
  },
  
  // API configuration
  api: {
    version: "v1",
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // limit each IP to 100 requests per windowMs
    }
  }
};