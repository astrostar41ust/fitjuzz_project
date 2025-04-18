/**
 * Logger utility for logging messages to the console
 */

// 
const info = (message) => {
  console.log(`[INFO] ${message}`);
};

// 
const warn = (message) => {
  console.warn(`[WARNING] ${message}`);
};

// 
const error = (message, err) => {
  console.error(`[ERROR] ${message}`, err || '');
};

module.exports = {
  info,
  warn,
  error
}; 