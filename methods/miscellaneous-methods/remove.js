/**
 * Remove the set of matched elements from the DOM.
 * @see https://api.jquery.com/remove/
 * @param {string} [selector] - A selector expression that filters the set of matched elements to be removed.
 * @returns {JQ} The JQ instance (for chaining).
 */
module.exports = function remove(selector) {
    let nodesToRemove = this.nodes;

    // If selector is provided, filter nodes
    if (selector) {
        const JQ = require('../../jq');
        const filtered = new JQ(this.nodes).filter(selector);
        nodesToRemove = filtered.nodes;
    }

    // Remove each node from its parent
    nodesToRemove.forEach(node => {
        if (!node) return;

        const parent = node.parent || node.parentNode;
        if (!parent) return;

        // For internal nodes
        if (parent.children && Array.isArray(parent.children)) {
            const index = parent.children.indexOf(node);
            if (index !== -1) {
                parent.children.splice(index, 1);
            }
        }
        // For DOM nodes
        else if (parent.childNodes) {
            parent.removeChild(node);
        }

        // Clear data associated with the node
        if (node._jqData) {
            delete node._jqData;
        }
    });

    return this;
};
