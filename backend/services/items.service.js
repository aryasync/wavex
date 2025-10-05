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
   * Create item data structure
   */
  createItemData(data) {
    const now = new Date().toISOString().split("T")[0]; // Today's date in YYYY-MM-DD

    return {
      id: generateId(),
      name: data.name,
      expiryDate: data.expiryDate,
      addedDate: data.addedDate || now,
      dateBought: data.dateBought || data.addedDate || now,
      category: data.category || "other",
    };
  }

  /**
   * Get items with flexible filtering
   */
  async getItems(filters = {}) {
    const items = await readJsonFile(this.dataFile);

    // Single pass: filter and recalculate in one operation
    const result = [];
    
    for (const item of items) {
      // Recalculate expiry date once per item
      const recalculatedItem = this.recalculateExpiryDate(item);
      
      // Apply all filters in one pass
      if (filters.category && 
          (!recalculatedItem.category || 
           recalculatedItem.category.toLowerCase() !== filters.category.toLowerCase())) {
        continue;
      }
      
      if (filters.status && recalculatedItem.status !== filters.status) continue;
      if (filters.source && recalculatedItem.source !== filters.source) continue;
      if (filters.generatedBy && recalculatedItem.generatedBy !== filters.generatedBy) continue;
      if (filters.expired && !isDateInPast(recalculatedItem.expiryDate)) continue;
      if (filters.expiring) {
        const days = filters.expiringDays || config.business.expiryWarningDays;
        if (isDateInPast(recalculatedItem.expiryDate) || 
            !isDateWithinDays(recalculatedItem.expiryDate, days)) continue;
      }
      
      // Item passes all filters, add to result
      result.push(recalculatedItem);
    }
    
    return result;
  }

  /**
   * Get item by ID
   */
  async getItemById(id) {
    const items = await readJsonFile(this.dataFile);
    const item = findItemById(items, id);
    return item ? this.recalculateExpiryDate(item) : null;
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

    // Transform data into complete item object
    const now = new Date().toISOString().split("T")[0]; // Today's date in YYYY-MM-DD
    const purchasedDate = itemData.purchasedDate || now;
    
    // Calculate expiry date by adding expiryPeriod to purchasedDate
    const expiryDate = new Date(purchasedDate);
    expiryDate.setDate(expiryDate.getDate() + itemData.expiryPeriod);
    const expiryDateString = expiryDate.toISOString().split("T")[0];

    // Capitalize the first letter of each word in the name
    const capitalizedName = ItemValidator.capitalizeName(itemData.name);

    const newItem = {
      id: generateId(),
      name: capitalizedName,
      expiryPeriod: itemData.expiryPeriod,
      expiryDate: expiryDateString, // Calculated from purchasedDate + expiryPeriod
      purchasedDate: purchasedDate,
      category: itemData.category || "other",
      createdAt: Math.floor(Date.now() / 1000), // Unix timestamp
      status: itemData.status || config.business.validStatuses[1], // "confirmed"
      generatedBy: itemData.generatedBy || config.business.validGeneratedBy[0], // "manual"
      source: itemData.source || null,
    };

    const items = readJsonFile(this.dataFile);
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
    const items = readJsonFile(this.dataFile);
    const itemIndex = items.findIndex((item) => item.id === id);

    if (itemIndex === -1) {
      throw new Error("Item not found");
    }

    // Whitelist approach: Only allow specific fields to be updated
    const allowedFields = config.business.itemsUpdatableFields;
    const allowedUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(([key]) => allowedFields.includes(key))
    );

    // Validate update data
    const validation = this.validateItem(allowedUpdateData);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
    }

    // Update item with only allowed fields
    items[itemIndex] = { ...items[itemIndex], ...allowedUpdateData };

    // Auto-recalculate expiryDate if purchasedDate or expiryPeriod changed
    if (allowedUpdateData.purchasedDate || allowedUpdateData.expiryPeriod) {
      const purchasedDate = allowedUpdateData.purchasedDate || items[itemIndex].purchasedDate;
      const expiryPeriod = allowedUpdateData.expiryPeriod || items[itemIndex].expiryPeriod;
      
      if (purchasedDate && expiryPeriod) {
        items[itemIndex].expiryDate = this.calculateExpiryDate(purchasedDate, expiryPeriod);
      }
    }

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
    const items = readJsonFile(this.dataFile);
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
