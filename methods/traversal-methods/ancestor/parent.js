const {selectNodes} = require('../../../selector');

function parent(selector) {
    const parents = [];
    const seen = new Set(); // Avoid duplicates

    for (const node of this.nodes) {
        // Handle both internal nodes and DOM elements
        let parentNode = node.parent || node.parentNode;
        if (parentNode && !seen.has(parentNode)) {
            // Check if it's an element and not HTML
            let isElement = false;
            let isHtml = false;

            if (node.parent && node.parent.type === 'element') {
                isElement = true;
                isHtml = node.tagName && node.tagName.toLowerCase() === 'html';
            } else if (node.parentNode && node.parentNode.nodeType === 1) {
                isElement = true;
                isHtml = node.parentNode.tagName.toLowerCase() === 'html';
            }

            if (isElement && !isHtml) {
                seen.add(parentNode);
                parents.push(parentNode);
            }
        }
    }

    let resultNodes = parents;

    // If selector provided, filter parents that match the selector
    if (selector) {
        // We need to find which parents match the selector
        // Since selectNodes expects root nodes, we need to find the common roots
        const rootNodes = this._findCommonRoots();
        const matchingParents = selectNodes(rootNodes, selector);

        // Filter our parents to only include those that match the selector
        resultNodes = parents.filter(parent => matchingParents.includes(parent));
    }
    // Use a more reliable way to create new instance
    const JQ = this.constructor;
    const result = new JQ(resultNodes);
    result._prevObject = this;
    return result;
}

module.exports = parent;