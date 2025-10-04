import fs from "fs";
import path from "path";
import crypto from "crypto";

/**
 * Read JSON file safely
 */
export function readJsonFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return [];
  }
}

/**
 * Write JSON file safely
 */
export function writeJsonFile(filePath, data) {
  try {
    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error);
    return false;
  }
}

/**
 * Generate unique ID using hash
 */
export function generateId() {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Find item by ID
 */
export function findItemById(items, id) {
  return items.find(item => item.id === id);
}

/**
 * Remove item by ID
 */
export function removeItemById(items, id) {
  return items.filter(item => item.id !== id);
}
