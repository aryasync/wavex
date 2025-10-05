/**
 * Utility functions for item-related operations
 */

/**
 * Get item icon based on category and name
 */
export const getItemIcon = (category, name) => {
  const nameLower = name.toLowerCase();
  
  // Specific item icons
  if (nameLower.includes('milk')) return '🥛';
  if (nameLower.includes('bread')) return '🍞';
  if (nameLower.includes('apple')) return '🍎';
  if (nameLower.includes('banana')) return '🍌';
  if (nameLower.includes('egg')) return '🥚';
  if (nameLower.includes('cheese')) return '🧀';
  if (nameLower.includes('chicken')) return '🍗';
  if (nameLower.includes('yogurt')) return '🥄';
  
  // Category-based icons
  switch (category.toLowerCase()) {
    case 'dairy': return '🥛';
    case 'meat': return '🍖';
    case 'produce': return '🥬';
    case 'pantry': return '🥫';
    default: return '📦';
  }
};

/**
 * Transform backend item data to frontend format
 */
export const transformBackendItem = (backendItem) => ({
  id: backendItem.id,
  name: backendItem.name,
  category: backendItem.category.charAt(0).toUpperCase() + backendItem.category.slice(1),
  expiryDate: backendItem.expiryDate,
  purchasedDate: backendItem.purchasedDate,
  icon: getItemIcon(backendItem.category, backendItem.name),
  status: backendItem.status,
  generatedBy: backendItem.generatedBy,
  source: backendItem.source
});

/**
 * Transform frontend item data to backend format
 */
export const transformFrontendItem = (frontendItem) => ({
  name: frontendItem.name,
  category: frontendItem.category.toLowerCase(),
  purchasedDate: frontendItem.purchasedDate || new Date().toISOString().split('T')[0],
  expiryPeriod: frontendItem.expiryPeriod || 7,
  status: "confirmed",
  generatedBy: "manual",
  source: null
});

/**
 * Calculate days until expiry for an item
 */
export const calculateDaysUntilExpiry = (expiryDate) => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Get expiry status for an item
 */
export const getExpiryStatus = (expiryDate) => {
  const days = calculateDaysUntilExpiry(expiryDate);
  
  if (days < 0) return { status: 'expired', color: 'red' };
  if (days <= 3) return { status: 'expiring_soon', color: 'orange' };
  if (days <= 7) return { status: 'expiring_this_week', color: 'yellow' };
  return { status: 'good', color: 'green' };
};