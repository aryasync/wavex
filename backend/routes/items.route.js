import express from "express";
import ItemController from "../controllers/items.controller.js";

const router = express.Router();
const itemController = new ItemController();

// Routes - Zero business logic, just HTTP handling
router.get("/items", (req, res) => itemController.getAllItems(req, res));
router.get("/items/expiring", (req, res) => itemController.getExpiringItems(req, res));
router.get("/items/expired", (req, res) => itemController.getExpiredItems(req, res));
router.get("/items/:id", (req, res) => itemController.getItemById(req, res));
router.post("/items", (req, res) => itemController.createItem(req, res));
router.put("/items/:id", (req, res) => itemController.updateItem(req, res));
router.delete("/items/:id", (req, res) => itemController.deleteItem(req, res));

export default router;
