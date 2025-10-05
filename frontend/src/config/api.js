/**
 * API Configuration
 * Centralized configuration for all API endpoints
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.DEV ? 'http://localhost:3001/api' : 'https://wavex-4lnx.onrender.com/api');
