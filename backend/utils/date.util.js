// Date utility functions

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Check if a date string is in the past
 */
export function isDateInPast(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day
  return date < today;
}

/**
 * Check if a date is within X days from today
 */
export function isDateWithinDays(dateString, days) {
  const date = new Date(dateString);
  const today = new Date();
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + days);
  
  return date >= today && date <= futureDate;
}

/**
 * Calculate days until expiry
 */
export function getDaysUntilExpiry(expiryDate) {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Format date for display
 */
export function formatDateForDisplay(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}