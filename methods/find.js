const {selectNodes} = require('../selector');

/**
 * Finds descendant elements by CSS selector or tag name.
 * Supports basic CSS selectors: tag, #id, .class, and combinations.
 * @see https://api.jquery.com/find/
 * @param {string} selector - CSS selector or tag name to search for
 * @returns {JQ} New JQ instance with found elements
 */
module.exports = function find(selector) {
    this.debugLog(`JQ.find: Searching for selector "${selector}" within ${this.nodes.length} nodes`);
    // Use the CSS selector engine for more advanced selection
    const result = new this.constructor(selectNodes(this.nodes, selector));
    result._prevObject = this;
    this.debugLog(`JQ.find: Found ${result.nodes.length} matching elements`);
    return result;
};
