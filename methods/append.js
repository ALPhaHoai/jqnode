function append(...content) {
    this.debugLog(`JQ.append: Appending content to ${this.nodes.length} elements`);

    // Flatten all content arguments into a single array of nodes
    const allContent = [];
    const contentToClone = [];

    for (const item of content) {
        // Check if this is a JQ object containing existing elements
        if (item && typeof item === 'object' && (item.constructor && item.constructor.name === 'JQ' || item.nodes && Array.isArray(item.nodes))) {
            // This is a JQ object - we move its elements (jQuery behavior)
            contentToClone.push(item);
        } else {
            // Other content types - normalize and clone as before
            allContent.push(...this._normalizeContent(item));
        }
    }

    this.debugLog(`JQ.append: Normalized ${allContent.length} nodes to append, ${contentToClone.length} JQ objects to clone`);

    for (const element of this.nodes) {
        if (element.type === 'element' && element.children) {
            // Handle cloned content (HTML strings, etc.)
            if (allContent.length > 0) {
                const clonedContent = allContent.map(node => this._cloneNode(node));
                element.children.push(...clonedContent);
                this.debugLog(`JQ.append: Appended ${clonedContent.length} cloned nodes to element <${element.tagName}>`);
            }

            // Handle JQ objects - move them (jQuery behavior)
            for (const jqObject of contentToClone) {
                for (const nodeToMove of jqObject.nodes) {
                    // Remove from current parent
                    if (nodeToMove.parent && nodeToMove.parent.children) {
                        const index = nodeToMove.parent.children.indexOf(nodeToMove);
                        if (index !== -1) {
                            nodeToMove.parent.children.splice(index, 1);
                        }
                    }

                    // Remove from allRootNodes if present
                    const rootIndex = require('../jq').allRootNodes.indexOf(nodeToMove);
                    if (rootIndex !== -1) {
                        require('../jq').allRootNodes.splice(rootIndex, 1);
                    }

                    // Add to new parent
                    element.children.push(nodeToMove);
                    nodeToMove.parent = element;
                }
                this.debugLog(`JQ.append: Moved ${jqObject.nodes.length} nodes to element <${element.tagName}>`);
            }
        }
    }

    return this;
}

module.exports = append;