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
    const validCategories = config.business.validCategories;
    const validStatuses = config.business.validStatuses;
    const validGeneratedBy = config.business.validGeneratedBy;
    const validSources = config.business.validSources;

    // Helper function to add error
    const addError = (message) => {
      if (throwOnError) {
        throw new Error(itemIndex !== null ? `Item ${itemIndex + 1}: ${message}` : message);
      }
      errors.push(message);
    };

    // Validate required fields
    if (!item.name || typeof item.name !== "string") {
      addError("Name is required and must be a string");
    }

    if (!item.expiryPeriod || typeof item.expiryPeriod !== "number") {
      addError("Expiry period is required and must be a number");
    }

    // Validate expiryPeriod is a positive integer
    if (item.expiryPeriod && (!Number.isInteger(item.expiryPeriod) || item.expiryPeriod <= 0)) {
      addError("Expiry period must be a positive integer");
    }

    // Validate expiryPeriod is reasonable (max 365 days)
    if (item.expiryPeriod && item.expiryPeriod > 365) {
      addError("Expiry period cannot be more than 365 days");
    }

    // Validate category if provided
    if (item.category && !validCategories.includes(item.category)) {
      addError(`Category must be one of: ${validCategories.join(", ")}`);
    }

    // Validate status if provided
    if (item.status && !validStatuses.includes(item.status)) {
      addError(`Status must be one of: ${validStatuses.join(", ")}`);
    }

    // Validate generatedBy if provided
    if (item.generatedBy && !validGeneratedBy.includes(item.generatedBy)) {
      addError(`GeneratedBy must be one of: ${validGeneratedBy.join(", ")}`);
    }

    // Validate source if provided
    if (item.source && !validSources.includes(item.source)) {
      addError(`Source must be one of: ${validSources.join(", ")}`);
    }

    // Validate purchasedDate if provided (should be YYYY-MM-DD format)
    if (item.purchasedDate && typeof item.purchasedDate === "string") {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(item.purchasedDate)) {
        addError("PurchasedDate must be in YYYY-MM-DD format");
      }
    }

    // Validate expiryDate if provided (should be YYYY-MM-DD format)
    if (item.expiryDate && typeof item.expiryDate === "string") {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(item.expiryDate)) {
        addError("ExpiryDate must be in YYYY-MM-DD format");
      }
    }

    // Validate createdAt if provided (should be Unix timestamp)
    if (item.createdAt && (typeof item.createdAt !== "number" || !Number.isInteger(item.createdAt))) {
      addError("CreatedAt must be a Unix timestamp (integer)");
    }

    // Validate id if provided (should be string)
    if (item.id && typeof item.id !== "string") {
      addError("Id must be a string");
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

    // Validate source field if present (for AI items)
    if (item.source !== undefined) {
      const validSources = config.business.validSources;
      
      if (!item.source || typeof item.source !== 'string') {
        const error = "Source field is required and must be a string";
        if (options.throwOnError) {
          throw new Error(options.itemIndex !== null ? `Item ${options.itemIndex + 1}: ${error}` : error);
        }
        throw new Error(error);
      }

      if (!validSources.includes(item.source)) {
        const error = `Source must be one of: ${validSources.join(", ")}`;
        if (options.throwOnError) {
          throw new Error(options.itemIndex !== null ? `Item ${options.itemIndex + 1}: ${error}` : error);
        }
        throw new Error(error);
      }
    }

    // Capitalize the name
    const capitalizedName = this.capitalizeName(item.name);

    return {
      name: capitalizedName,
      category: item.category,
      expiryPeriod: item.expiryPeriod,
      source: item.source // Include source if present
    };
  }
}
