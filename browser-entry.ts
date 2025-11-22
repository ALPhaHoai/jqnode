/**
 * Browser entry point for jqnode library
 * Handles browser-specific adaptations of Node.js code
 */

// Mock process.env for browser environment
if (typeof process === 'undefined') {
    (global as any).process = {
        env: {
            JQNODE_DEBUG: '0',
            DEBUG: ''
        }
    };
}

// Mock jest global for browser
if (typeof jest === 'undefined') {
    (global as any).jest = undefined;
}

// Re-export everything from index
module.exports = require('./index');
