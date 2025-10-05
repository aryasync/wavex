import express from "express";
import multer from "multer";
import ItemController from "../controllers/items.controller.js";

const router = express.Router();
const itemController = new ItemController();

// Configure multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Routes
router.get("/items", (req, res) => itemController.getItemsByCategory(req, res));
router.get("/items/expiring", (req, res) => itemController.getExpiringItems(req, res));
router.get("/items/expired", (req, res) => itemController.getExpiredItems(req, res));
router.get("/items/:id", (req, res) => itemController.getItemById(req, res));
router.post("/items", (req, res) => itemController.createItem(req, res));
router.put("/items/:id", (req, res) => itemController.updateItem(req, res));
router.delete("/items/:id", (req, res) => itemController.deleteItem(req, res));

// AI Image Analysis Route
router.post("/items/analyze-image", upload.single('image'), (req, res) => itemController.analyzeImage(req, res));

// Items by Status Route
router.get("/items/status/:status", (req, res) => itemController.getItemsByStatus(req, res));

export default router;
