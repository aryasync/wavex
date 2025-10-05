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
import { ItemValidator } from "../utils/validation.util.js";
import { config } from "../config/index.js";

class ItemService {
  constructor() {
    this.dataFile = config.data.filePath;
  }

  /**
   * Validate item data
   */
  validateItem(item) {
    return ItemValidator.validateItem(item);
  }

  /**
   * Create a new item with defaults
   */
  createItemData(data) {
    const now = new Date().toISOString().split("T")[0]; // Today's date in YYYY-MM-DD
    const purchasedDate = data.purchasedDate || now;
    
    // Calculate expiry date by adding expiryPeriod to purchasedDate
    const expiryDate = new Date(purchasedDate);
    expiryDate.setDate(expiryDate.getDate() + data.expiryPeriod);
    const expiryDateString = expiryDate.toISOString().split("T")[0];

    // Capitalize the first letter of each word in the name
    const capitalizedName = ItemValidator.capitalizeName(data.name);

    return {
      id: generateId(),
      name: capitalizedName,
      expiryPeriod: data.expiryPeriod,
      expiryDate: expiryDateString, // Calculated from purchasedDate + expiryPeriod
      purchasedDate: purchasedDate,
      category: data.category || "other",
      createdAt: Math.floor(Date.now() / 1000), // Unix timestamp
    };
  }

  /**
   * Calculate expiry date from purchasedDate and expiryPeriod
   */
  calculateExpiryDate(purchasedDate, expiryPeriod) {
    const expiryDate = new Date(purchasedDate);
    expiryDate.setDate(expiryDate.getDate() + expiryPeriod);
    return expiryDate.toISOString().split("T")[0];
  }

  /**
   * Recalculate expiry date for an item
   */
  recalculateExpiryDate(item) {
    if (item.expiryPeriod && item.purchasedDate) {
      item.expiryDate = this.calculateExpiryDate(item.purchasedDate, item.expiryPeriod);
    }
    return item;
  }

  /**
   * Get all items
   * @param {string} category - Optional category filter
   */
  async getItemsByCategory(category = null) {
    const items = await readJsonFile(this.dataFile);

    // Recalculate expiry dates for all items
    const recalculatedItems = items.map(item => this.recalculateExpiryDate(item));

    // If no category specified, return all items
    if (!category) return recalculatedItems;

    // Filter by category (case-insensitive)
    return recalculatedItems.filter(
      (item) =>
        item.category && item.category.toLowerCase() === category.toLowerCase()
    );
  }

  /**
   * Get item by ID
   */
  async getItemById(id) {
    const items = await this.getItemsByCategory();
    const item = findItemById(items, id);
    return item ? this.recalculateExpiryDate(item) : null;
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
