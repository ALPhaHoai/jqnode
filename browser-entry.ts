/**
 * Browser entry point for jqnode library
 * Handles browser-specific adaptations of Node.js code
 */

// Mock process.env for browser environment
if (typeof process === 'undefined') {
    (globalThis as any).process = {
        env: {
            JQNODE_DEBUG: '0',
            DEBUG: '',
        },
    };
}

// Mock jest global for browser
if (typeof jest === 'undefined') {
    (globalThis as any).jest = undefined;
}

// Import and re-export main library
import JQExport from './index';

// Export as default (Rollup's UMD wrapper will assign this to window.$ via the 'name' config)
export default JQExport;
