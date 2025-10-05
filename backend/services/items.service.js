import {
  readJsonFile,
  writeJsonFile,
  generateId,
  findItemById,
  removeItemById,
} from "../utils/file.util.js";
import {
  isDateInPast,
  isDateWithinDays,
  getDaysUntilExpiry,
} from "../utils/date.util.js";
import { config } from "../config/index.js";

class ItemService {
  constructor() {
    this.dataFile = config.data.filePath;
  }

  /**
   * Validate item data
   */
  validateItem(item) {
    const errors = [];

    // Check required fields
    if (!item.name || typeof item.name !== "string") {
      errors.push("Name is required and must be a string");
    }

    if (!item.expiryDate || typeof item.expiryDate !== "string") {
      errors.push("Expiry date is required and must be a string");
    }

    // Check date format (YYYY-MM-DD)
    if (item.expiryDate && !/^\d{4}-\d{2}-\d{2}$/.test(item.expiryDate)) {
      errors.push("Expiry date must be in YYYY-MM-DD format");
    }

    // Check category if provided
    const validCategories = config.business.supportedCategories;
    if (item.category && !validCategories.includes(item.category)) {
      errors.push(`Category must be one of: ${validCategories.join(", ")}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Create a new item with defaults
   */
  createItemData(data) {
    const now = new Date().toISOString().split("T")[0]; // Today's date in YYYY-MM-DD

    return {
      id: generateId(),
      name: data.name,
      expiryDate: data.expiryDate,
      addedDate: data.addedDate || now,
      category: data.category || "other",
    };
  }

  /**
   * Get all items
   * @param {string} category - Optional category filter
   */
  async getItemsByCategory(category = null) {
    const items = await readJsonFile(this.dataFile);

    // If no category specified, return all items
    if (!category) return items;

    // Filter by category (case-insensitive)
    return items.filter(
      (item) =>
        item.category && item.category.toLowerCase() === category.toLowerCase()
    );
  }

  /**
   * Get item by ID
   */
  async getItemById(id) {
    const items = await this.getItemsByCategory();
    return findItemById(items, id);
  }

  /**
   * Get items that are expiring soon
   */
  async getExpiringItems(days = config.business.expiryWarningDays) {
    const items = await this.getItemsByCategory();
    return items.filter(
      (item) =>
        !isDateInPast(item.expiryDate) &&
        isDateWithinDays(item.expiryDate, days)
    );
  }

  /**
   * Get expired items
   */
  async getExpiredItems() {
    const items = await this.getItemsByCategory();
    return items.filter((item) => isDateInPast(item.expiryDate));
  }

  /**
   * Create new item
   */
  async createItem(itemData) {
    // Validate input
    const validation = this.validateItem(itemData);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
    }

    const newItem = this.createItemData(itemData);
    const items = await this.getItemsByCategory();
    items.push(newItem);

    // Save to file
    const success = writeJsonFile(this.dataFile, items);
    if (!success) throw new Error("Failed to save item");

    return newItem;
  }

  /**
   * Update existing item
   */
  async updateItem(id, updateData) {
    const items = await this.getItemsByCategory();
    const itemIndex = items.findIndex((item) => item.id === id);

    if (itemIndex === -1) {
      throw new Error("Item not found");
    }

    // Validate update data
    const validation = this.validateItem(updateData);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
    }

    // Update item
    items[itemIndex] = { ...items[itemIndex], ...updateData };

    // Save to file
    const success = writeJsonFile(this.dataFile, items);
    if (!success) {
      throw new Error("Failed to update item");
    }

    return items[itemIndex];
  }

  /**
   * Delete item
   */
  async deleteItem(id) {
    const items = await this.getItemsByCategory();
    const item = findItemById(items, id);

    if (!item) {
      throw new Error("Item not found");
    }

    const updatedItems = removeItemById(items, id);

    // Save to file
    const success = writeJsonFile(this.dataFile, updatedItems);
    if (!success) {
      throw new Error("Failed to delete item");
    }

    return item;
  }
}

export default ItemService;
