const {getTextContent, unescapeHtml} = require('../utils');

/**
 * Gets or sets the text content of elements.
 * @see https://api.jquery.com/text/
 * @param {string} [value] - Text content to set (if setting)
 * @returns {string|JQ} Concatenated text content if getting, JQ instance if setting
 */
module.exports = function text(value) {
    if (value === undefined) {
        // Get text content from element nodes only (handle both internal nodes and DOM elements)
        const elementNodes = this.nodes.filter(node => node.type === 'element' || (node.nodeType === 1));

        // Check if any element is detached (from fractional eq() indices)
        if (elementNodes.some(node => node._detached)) {
            return '';
        }

        if (elementNodes.length === 0) {
            return '';
        }

        const result = elementNodes.map(node => {
            // Handle DOM elements
            if (node.nodeType === 1) {
                return node.textContent || '';
            }
            // Handle internal nodes
            return getTextContent(node);
        }).join('');

        const unescapedResult = unescapeHtml(result);
        this.debugLog(`JQ.text: Getting text content from ${elementNodes.length} element nodes, total length: ${unescapedResult.length}`);
        return unescapedResult;
    }

    // Set text content on all elements
    this.debugLog(`JQ.text: Setting text content "${value}" on ${this.nodes.length} elements`);
    this.nodes.forEach(node => {
        // Handle DOM elements
        if (node.nodeType === 1) {
            node.textContent = value;
        } else {
            // Handle internal nodes
            node.children = [{type: 'text', value}];
        }
    });

    return this;
};