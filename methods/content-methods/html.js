const {nodeToHTML} = require('../../utils');
const {parseHTML} = require('../../html-parser');

/**
 * Gets or sets the inner HTML of elements in the collection.
 * @see https://api.jquery.com/html/
 * @param {string} [htmlString] - HTML string to set as inner content (if setting)
 * @returns {string|JQ} Inner HTML of the first element if getting, JQ instance if setting
 */
module.exports = function html(htmlString) {
    if (htmlString === undefined) {
        // Get inner HTML from first element
        if (this.nodes.length === 0) {
            return undefined;
        }

        const firstNode = this.nodes[0];
        if (firstNode.type === 'element') {
            // Return the inner HTML (contents of the element)
            const result = firstNode.children.map(child => {
                return nodeToHTML(child);
            }).join('');
            this.debugLog(`JQ.html: Getting inner HTML of first element, result length: ${result.length}`);
            return result;
        } else {
            // For text nodes or other types, return their HTML representation
            const result = nodeToHTML(firstNode);
            this.debugLog(`JQ.html: Converting non-element node to HTML, result length: ${result.length}`);
            return result;
        }
    }

    // Set inner HTML on all element nodes
    this.debugLog(`JQ.html: Setting inner HTML on ${this.nodes.length} elements`);
    this.nodes.forEach(node => {
        if (node.type === 'element') {
            // Parse the HTML string and set as children
            const parsedNodes = parseHTML(htmlString);
            node.children = parsedNodes;
        }
    });

    return this;
};