const { parseHTML } = require('../html-parser');

/**
 * Helper method to normalize content into an array of nodes.
 * @param {*} content - HTML string, node object, JQ object, or array of these
 * @returns {Array} Array of node objects
 */
module.exports = function _normalizeContent(content) {
    if (typeof content === 'string') {
        // HTML string - parse it
        return parseHTML(content);
    } else if (content && typeof content === 'object') {
        if (content.type === 'element' || content.type === 'text' || content.type === 'comment') {
            // Single node object
            return [content];
        } else if (content.constructor && content.constructor.name === 'JQ') {
            // JQ object - return its nodes
            return content.nodes.slice(); // Clone to avoid modifying original
        } else if (content.nodes && Array.isArray(content.nodes)) {
            // JQ object - return its nodes (more robust check for browser compatibility)
            return content.nodes.slice(); // Clone to avoid modifying original
        } else if (Array.isArray(content)) {
            // Array of content - flatten and normalize each item
            const result = [];
            for (const item of content) {
                result.push(...this._normalizeContent(item));
            }
            return result;
        }
    }

    // Invalid content - return empty array
    return [];
};
