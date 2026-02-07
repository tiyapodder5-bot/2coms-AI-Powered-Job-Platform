// Auto-detect environment and set API URL
const getApiUrl = () => {
  // Check if running in production (deployed site)
  const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
  
  // Use environment variable if set, otherwise auto-detect
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Auto-detect based on environment
  if (isProduction) {
    // Production: Use your Render backend URL
    return 'https://your-backend-url.onrender.com/api';
  } else {
    // Development: Use localhost
    return 'http://localhost:5000/api';
  }
};

export const API_URL = getApiUrl();

// Log API URL for debugging (remove in production)
console.log('🌐 API URL:', API_URL);
