function before(...content) {
    this.debugLog(`JQ.before: Inserting content before ${this.nodes.length} elements`);

    // Flatten all content arguments into a single array of nodes
    const allContent = [];
    const contentToClone = [];

    for (const item of content) {
        // Check if this is a JQ object containing existing elements
        if (item && typeof item === 'object' && (item.constructor && item.constructor.name === 'JQ' || item.nodes && Array.isArray(item.nodes))) {
            // This is a JQ object - we clone its elements and remove originals (jQuery behavior)
            contentToClone.push(item);
        } else {
            // Other content types - normalize and clone as before
            allContent.push(...this._normalizeContent(item));
        }
    }

    this.debugLog(`JQ.before: Normalized ${allContent.length} nodes to insert, ${contentToClone.length} JQ objects to clone`);

    for (const element of this.nodes) {
        if (element.parent && element.parent.children) {
            const siblings = element.parent.children;
            const elementIndex = siblings.indexOf(element);

            if (elementIndex !== -1) {
                // Handle cloned content (HTML strings, etc.)
                if (allContent.length > 0) {
                    const clonedContent = allContent.map(node => this._cloneNode(node));
                    siblings.splice(elementIndex, 0, ...clonedContent);

                    // Set parent references for the cloned nodes
                    for (const clonedNode of clonedContent) {
                        clonedNode.parent = element.parent;
                    }

                    this.debugLog(`JQ.before: Inserted ${clonedContent.length} cloned nodes before element <${element.tagName}>`);
                }

                // Handle JQ objects - clone them and remove originals
                for (const jqObject of contentToClone) {
                    // Insert nodes in reverse order to maintain correct document order
                    for (let i = jqObject.nodes.length - 1; i >= 0; i--) {
                        const nodeToClone = jqObject.nodes[i];
                        // Clone the node
                        const clonedNode = this._cloneNode(nodeToClone);

                        // Remove original from current parent if it has one
                        if (nodeToClone.parent && nodeToClone.parent.children) {
                            const index = nodeToClone.parent.children.indexOf(nodeToClone);
                            if (index !== -1) {
                                nodeToClone.parent.children.splice(index, 1);
                            }
                        }

                        // Remove original from allRootNodes if present
                        const rootIndex = require('../../../jq').allRootNodes.indexOf(nodeToClone);
                        if (rootIndex !== -1) {
                            require('../../../jq').allRootNodes.splice(rootIndex, 1);
                        }

                        // Insert clone before current element
                        siblings.splice(elementIndex, 0, clonedNode);
                        clonedNode.parent = element.parent;
                    }
                    this.debugLog(`JQ.before: Cloned and moved ${jqObject.nodes.length} nodes before element <${element.tagName}>`);
                }
            }
        }
    }

    return this;
}

module.exports = before;