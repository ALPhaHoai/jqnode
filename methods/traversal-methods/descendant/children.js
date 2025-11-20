const {selectNodes} = require('../../../selector');

function children(selector) {
    const children = [];
    const seen = new Set(); // Avoid duplicates

    for (const node of this.nodes) {
        // Handle both internal nodes and DOM elements
        const nodeChildren = node.children || (node.childNodes ? Array.from(node.childNodes).filter(child => child.nodeType === 1) : []);

        for (const child of nodeChildren) {
            // For internal nodes, check type === 'element'
            // For DOM elements, check nodeType === 1
            const isElement = child.type === 'element' || child.nodeType === 1;
            if (isElement && !seen.has(child)) {
                seen.add(child);
                children.push(child);
            }
        }
    }

    let resultNodes = children;

    // If selector provided, filter children that match the selector
    if (selector) {
        // We need to find which children match the selector
        const rootNodes = this._findCommonRoots();
        const matchingChildren = selectNodes(rootNodes, selector);

        // Filter our children to only include those that match the selector
        resultNodes = children.filter(child => matchingChildren.includes(child));
    }
    // Use a more reliable way to create new instance
    const JQ = this.constructor;
    const result = new JQ(resultNodes);
    result._prevObject = this;
    return result;
}

module.exports = children;