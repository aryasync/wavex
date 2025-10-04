import ItemService from "../services/items.service.js";

class ItemController {
  constructor() {
    this.itemService = new ItemService();
  }

  /**
   * Get all items
   */
  async getAllItems(req, res) {
    try {
      const items = await this.itemService.getAllItems();
      res.json(items);
    } catch (error) {
      console.error("Error getting all items:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve items",
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
   * Get expiring items
   */
  async getExpiringItems(req, res) {
    try {
      const days = parseInt(req.query.days) || undefined;
      const items = await this.itemService.getExpiringItems(days);
      res.json(items);
    } catch (error) {
      console.error("Error getting expiring items:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve expiring items",
      });
    }
  }

  /**
   * Get expired items
   */
  async getExpiredItems(req, res) {
    try {
      const items = await this.itemService.getExpiredItems();
      res.json(items);
    } catch (error) {
      console.error("Error getting expired items:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve expired items",
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
}

export default ItemController;
