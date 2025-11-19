/**
 * Browser entry point for jqnode library
 * Handles browser-specific adaptations of Node.js code
 */

// Mock process.env for browser environment
if (typeof process === 'undefined') {
  global.process = {
    env: {
      JQNODE_DEBUG: '0',
      DEBUG: ''
    }
  };
}

// Mock jest global for browser
if (typeof jest === 'undefined') {
  global.jest = undefined;
}

module.exports = require('./index');
