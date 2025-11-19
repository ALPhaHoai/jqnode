const {parseSelector, nodeMatchesSelector} = require('../selector');

function closest(selector) {
    this.debugLog(`JQ.closest: Finding closest ancestors matching "${selector}" for ${this.nodes.length} elements`);

    if (!selector) {
        this.debugLog(`JQ.closest: No selector provided, returning empty result`);
        return new this.constructor([]);
    }

    // Parse the selector
    const parsedSelector = parseSelector(selector);
    if (!parsedSelector) {
        this.debugLog(`JQ.closest: Invalid selector "${selector}", returning empty result`);
        return new this.constructor([]);
    }

    const results = [];
    const seen = new Set();

    for (const node of this.nodes) {
        let current = node;

        // Walk up the tree including the current node
        while (current) {
            // Handle both internal nodes and DOM elements
            const isElement = current.type === 'element' || (current.nodeType === 1);
            if (isElement) {
                // Check if this node matches the selector
                if (nodeMatchesSelector(current, parsedSelector)) {
                    // Only add if we haven't seen this element before
                    if (!seen.has(current)) {
                        seen.add(current);
                        results.push(current);
                    }
                    break; // Found the closest match for this element
                }
            }
            // Handle both internal nodes and DOM elements for parent traversal
            current = current.parent || current.parentNode;
        }
    }

    this.debugLog(`JQ.closest: Found ${results.length} closest elements`);
    // Use a more reliable way to create new instance
    const JQ = this.constructor;
    return new JQ(results);
}

module.exports = closest;