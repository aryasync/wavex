import { config } from "../config/index.js";

/**
 * Unified validation utility for items
 */
export class ItemValidator {
  /**
   * Validate item data
   * @param {Object} item - The item to validate
   * @param {Object} options - Validation options
   * @param {boolean} options.throwOnError - Whether to throw errors or return validation result
   * @param {number} options.itemIndex - Index of item (for error messages)
   * @returns {Object|void} Validation result or throws error
   */
  static validateItem(item, options = {}) {
    const { throwOnError = false, itemIndex = null } = options;
    const errors = [];
    const validCategories = config.business.supportedCategories;

    // Check required fields
    if (!item.name || typeof item.name !== "string") {
      const error = "Name is required and must be a string";
      if (throwOnError) {
        throw new Error(itemIndex !== null ? `Item ${itemIndex + 1}: ${error}` : error);
      }
      errors.push(error);
    }

    if (!item.expiryPeriod || typeof item.expiryPeriod !== "number") {
      const error = "Expiry period is required and must be a number";
      if (throwOnError) {
        throw new Error(itemIndex !== null ? `Item ${itemIndex + 1}: ${error}` : error);
      }
      errors.push(error);
    }

    // Check expiryPeriod is a positive integer
    if (item.expiryPeriod && (!Number.isInteger(item.expiryPeriod) || item.expiryPeriod <= 0)) {
      const error = "Expiry period must be a positive integer";
      if (throwOnError) {
        throw new Error(itemIndex !== null ? `Item ${itemIndex + 1}: ${error}` : error);
      }
      errors.push(error);
    }

    // Validate expiryPeriod is reasonable (max 365 days)
    if (item.expiryPeriod && item.expiryPeriod > 365) {
      const error = "Expiry period cannot be more than 365 days";
      if (throwOnError) {
        throw new Error(itemIndex !== null ? `Item ${itemIndex + 1}: ${error}` : error);
      }
      errors.push(error);
    }

    // Check category if provided
    if (item.category && !validCategories.includes(item.category)) {
      const error = `Category must be one of: ${validCategories.join(", ")}`;
      if (throwOnError) {
        throw new Error(itemIndex !== null ? `Item ${itemIndex + 1}: ${error}` : error);
      }
      errors.push(error);
    }

    if (throwOnError) {
      return; // No errors, validation passed
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Capitalize the first letter of each word in a name
   * @param {string} name - The name to capitalize
   * @returns {string} Capitalized name
   */
  static capitalizeName(name) {
    return name
      .trim()
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Validate and process item (validation + capitalization)
   * @param {Object} item - The item to validate and process
   * @param {Object} options - Validation options
   * @returns {Object} Processed item
   */
  static validateAndProcessItem(item, options = {}) {
    // Validate the item
    this.validateItem(item, options);

    // Capitalize the name
    const capitalizedName = this.capitalizeName(item.name);

    return {
      name: capitalizedName,
      category: item.category,
      expiryPeriod: item.expiryPeriod,
    };
  }
}
