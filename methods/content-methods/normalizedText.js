const { getTextContent, unescapeHtml } = require('../../utils');
const { normalizeHTML } = require('../../utils-static');

/**
 * Gets or sets the text content of elements with HTML normalization.
 * Similar to text() but applies normalizeHTML to remove tabs, newlines, carriage returns,
 * and collapse multiple spaces into single spaces.
 * @see https://api.jquery.com/text/
 * @param {string} [value] - Text content to set (if setting)
 * @returns {string|JQ} Normalized text content if getting, JQ instance if setting
 * @example
 * const jq = require('@alphahoai/jqnode');
 * const $ = jq.load('<div>   Hello\n\t  World   </div>');
 * console.log($('div').normalizedText()); // 'Hello World'
 */
module.exports = function normalizedText(value) {
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

        // Apply HTML normalization to the text content
        return normalizeHTML(unescapedResult);
    }

    // Set text content on all elements
    this.nodes.forEach(node => {
        // Handle DOM elements
        if (node.nodeType === 1) {
            node.textContent = value;
        } else {
            // Handle internal nodes
            node.children = [{ type: 'text', value }];
        }
    });

    return this;
};
