/**
 * Helper method to find common root nodes for selector matching.
 * @returns {Array} Array of root nodes
 */
module.exports = function _findCommonRoots() {
    const roots = new Set();

    // Walk up from each node to find roots
    for (const node of this.nodes) {
        let current = node;
        while (current.parent || current.parentNode) {
            current = current.parent || current.parentNode;
        }
        roots.add(current);
    }

    return Array.from(roots);
};