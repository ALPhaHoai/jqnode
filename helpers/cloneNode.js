/**
 * Helper method to deep clone a node.
 * @param {Object} node - Node to clone
 * @returns {Object} Cloned node
 */
function _cloneNode(node) {
    if (!node) return node;

    const cloned = {
        type: node.type,
        value: node.value,
        tagName: node.tagName,
        attributes: node.attributes ? { ...node.attributes } : undefined,
        children: node.children ? node.children.map(child => _cloneNode(child)) : undefined
    };

    // Set parent references for cloned children
    if (cloned.children) {
        for (const child of cloned.children) {
            child.parent = cloned;
        }
    }

    return cloned;
}

module.exports = _cloneNode;