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
        throw new Error(
          itemIndex !== null ? `Item ${itemIndex + 1}: ${message}` : message
        );
      }
      errors.push(message);
    };

    // Validate name if provided
    if (item.name !== undefined && typeof item.name !== "string") {
      addError("Name must be a string");
    }

    if (
      item.category !== undefined &&
      !validCategories.includes(item.category)
    ) {
      addError(`Category must be one of: ${validCategories.join(", ")}`);
    }

    if (item.status !== undefined && !validStatuses.includes(item.status)) {
      addError(`Status must be one of: ${validStatuses.join(", ")}`);
    }

    if (
      item.generatedBy !== undefined &&
      !validGeneratedBy.includes(item.generatedBy)
    ) {
      addError(`GeneratedBy must be one of: ${validGeneratedBy.join(", ")}`);
    }

    if (item.source !== undefined && !validSources.includes(item.source)) {
      addError(`Source must be one of: ${validSources.join(", ")}`);
    }

    // Validate date fields if provided (should be YYYY-MM-DD format)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (item.purchasedDate !== undefined) {
      if (
        typeof item.purchasedDate !== "string" ||
        !dateRegex.test(item.purchasedDate)
      ) {
        addError("PurchasedDate must be in YYYY-MM-DD format");
      }
    }

    if (item.expiryPeriod !== undefined) {
      if (typeof item.expiryPeriod !== "number") {
        addError("Expiry period must be a number");
      } else if (
        !Number.isInteger(item.expiryPeriod) ||
        item.expiryPeriod <= 0
      ) {
        addError("Expiry period must be a positive integer");
      } else if (item.expiryPeriod > config.business.maxExpiryPeriod) {
        addError(`Expiry period cannot be more than ${config.business.maxExpiryPeriod} days`);
      }
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
   */
  static capitalizeName(name) {
    return name
      .trim()
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  /**
   * Validate and process item (validation + capitalization)
   * @param {Object} item - The item to validate and process
   * @param {Object} options - Validation options
   * @returns {Object} Processed item
   */
  static validateAndProcessItem(item, options = {}) {
    // Validate the item (includes source validation)
    this.validateItem(item, options);

    // Capitalize the name
    const capitalizedName = this.capitalizeName(item.name);

    return {
      name: capitalizedName,
      category: item.category,
      expiryPeriod: item.expiryPeriod,
      source: item.source, // Include source if present
    };
  }
}
