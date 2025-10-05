import ItemService from "../services/items.service.js";
import AIService from "../services/ai.service.js";
import { config } from "../config/index.js";

class ItemController {
  constructor() {
    this.itemService = new ItemService();
    this.aiService = new AIService();
  }

  /**
   * Get items with flexible filtering
   */
  async getItems(req, res) {
    try {
      const { category, status, source, generatedBy, expired, expiring, expiringDays } = req.query;
      
      const filters = {};
      if (category) filters.category = category;
      if (status) filters.status = status;
      if (source) filters.source = source;
      if (generatedBy) filters.generatedBy = generatedBy;
      if (expired === 'true') filters.expired = true;
      if (expiring === 'true') filters.expiring = true;
      if (expiringDays) filters.expiringDays = parseInt(expiringDays);
      
      const items = await this.itemService.getItems(filters);
      res.json(items);
    } catch (error) {
      console.error("Error getting items:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve items",
      });
    }
  }

  /**
   * Get available categories from config
   */
  async getCategories(req, res) {
    try {
      const categories = config.business.validCategories;
      res.json({
        success: true,
        categories: categories
      });
    } catch (error) {
      console.error("Error getting categories:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve categories",
      });
    }
  }

  /**
   * Get item by ID
   */
  async getItemById(req, res) {
    try {
      const { id } = req.params;
      const item = await this.itemService.getItemById(id);

      if (!item) {
        return res.status(404).json({
          success: false,
          message: "Item not found",
        });
      }

      res.json(item);
    } catch (error) {
      console.error("Error getting item by ID:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve item",
      });
    }
  }

  /**
   * Create new item
   */
  async createItem(req, res) {
    try {
      const newItem = await this.itemService.createItem(req.body);
      res.status(201).json({
        success: true,
        item: newItem,
      });
    } catch (error) {
      console.error("Error creating item:", error);

      if (error.message.includes("Validation failed")) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to create item",
      });
    }
  }

  /**
   * Update item
   */
  async updateItem(req, res) {
    try {
      const { id } = req.params;
      const updatedItem = await this.itemService.updateItem(id, req.body);
      res.json({
        success: true,
        item: updatedItem,
      });
    } catch (error) {
      console.error("Error updating item:", error);

      if (error.message === "Item not found") {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      if (error.message.includes("Validation failed")) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to update item",
      });
    }
  }

  /**
   * Delete item
   */
  async deleteItem(req, res) {
    try {
      const { id } = req.params;
      const { deleteAll } = req.query;

      // Check if deleteAll parameter is provided (accept string 'true' or boolean true)
      if (deleteAll === 'true' || deleteAll === true) {
        const result = await this.itemService.deleteAllItems();
        return res.json({
          success: true,
          message: `Successfully deleted ${result.deletedCount} items`,
          deletedCount: result.deletedCount,
          items: result.items,
        });
      }

      // Regular single item deletion
      const deletedItem = await this.itemService.deleteItem(id);
      res.json({
        success: true,
        item: deletedItem,
      });
    } catch (error) {
      console.error("Error deleting item:", error);

      if (error.message === "Item not found") {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to delete item",
      });
    }
  }

  /**
   * Analyze image with AI and create items
   */
  async analyzeImage(req, res) {
    try {
      // Check if image file was uploaded
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No image file provided",
        });
      }

      // Analyze image with AI
      const aiItems = await this.aiService.analyzeImage(req.file.buffer);
      
      if (aiItems.length === 0) {
        return res.json({
          success: true,
          message: "No food items detected in the image",
          items: [],
          createdCount: 0
        });
      }

      // Create pending items from AI response (not confirmed yet)
      const pendingItems = [];
      const errors = [];

      for (const itemData of aiItems) {
        try {
          // Add AI-specific metadata
          const aiItemData = {
            ...itemData,
            status: config.business.validStatuses[0], // "pending"
            generatedBy: config.business.validGeneratedBy[1] // "ai"
          };
          
          const newItem = await this.itemService.createItem(aiItemData);
          pendingItems.push(newItem);
        } catch (error) {
          console.error(`Error creating pending item ${itemData.name}:`, error);
          errors.push({
            item: itemData,
            error: error.message            
          });
        }
      }

      // Return response with pending items
      const response = {
        success: true,
        message: `AI detected ${pendingItems.length} items - pending confirmation`,
        items: pendingItems,
        createdCount: pendingItems.length,
        totalDetected: aiItems.length
      };

      // Include errors if any
      if (errors.length > 0) {
        response.errors = errors;
        response.message += ` (${errors.length} items failed to create)`;
      }

      res.status(201).json(response);

    } catch (error) {
      console.error("Error analyzing image:", error);

      // Handle specific error types
      if (error.message.includes('API key')) {
        return res.status(500).json({
          success: false,
          message: "AI service not configured. Please set OPENAI_API_KEY environment variable.",
        });
      }

      if (error.message.includes('Image processing')) {
        return res.status(400).json({
          success: false,
          message: "Invalid image file. Please upload a valid image.",
        });
      }

      if (error.message.includes('AI analysis failed')) {
        return res.status(500).json({
          success: false,
          message: "Failed to analyze image. Please try again.",
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to analyze image",
      });
    }
  }
}

export default ItemController;
