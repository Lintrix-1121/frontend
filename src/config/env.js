// config/env.js
const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:2090/api',
  appName: import.meta.env.VITE_APP_NAME || 'My App',
  nodeEnv: import.meta.env.VITE_NODE_ENV || 'development',
  isDevelopment: import.meta.env.VITE_NODE_ENV === 'development',
  isProduction: import.meta.env.VITE_NODE_ENV === 'production',
};

export default config;