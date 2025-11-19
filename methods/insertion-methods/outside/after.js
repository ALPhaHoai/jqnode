function after(...content) {
    this.debugLog(`JQ.after: Inserting content after ${this.nodes.length} elements`);

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

    this.debugLog(`JQ.after: Normalized ${allContent.length} nodes to insert, ${contentToClone.length} JQ objects to clone`);

    for (const element of this.nodes) {
        if (element.parent && element.parent.children) {
            const siblings = element.parent.children;
            const elementIndex = siblings.indexOf(element);

            if (elementIndex !== -1) {
                // Handle cloned content (HTML strings, etc.)
                if (allContent.length > 0) {
                    const clonedContent = allContent.map(node => this._cloneNode(node));
                    siblings.splice(elementIndex + 1, 0, ...clonedContent);

                    // Set parent references for the cloned nodes
                    for (const clonedNode of clonedContent) {
                        clonedNode.parent = element.parent;
                    }

                    this.debugLog(`JQ.after: Inserted ${clonedContent.length} cloned nodes after element <${element.tagName}>`);
                }

                // Handle JQ objects - clone them and remove originals
                let insertionIndex = elementIndex + 1;
                for (const jqObject of contentToClone) {
                    const clonedNodes = [];
                    for (const nodeToClone of jqObject.nodes) {
                        // Clone the node
                        const clonedNode = this._cloneNode(nodeToClone);
                        clonedNodes.push(clonedNode);

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
                    }

                    // Insert all cloned nodes at once in the correct order
                    siblings.splice(insertionIndex, 0, ...clonedNodes);
                    for (const clonedNode of clonedNodes) {
                        clonedNode.parent = element.parent;
                    }
                    insertionIndex += clonedNodes.length;

                    this.debugLog(`JQ.after: Cloned and moved ${jqObject.nodes.length} nodes after element <${element.tagName}>`);
                }
            }
        }

        // Also update the DOM if _originalElement is available
        if (element._originalElement && element._originalElement.parentNode) {
            for (const contentItem of allContent) {
                if (contentItem._originalElement) {
                    // If content has _originalElement, use it directly
                    element._originalElement.parentNode.insertBefore(
                        contentItem._originalElement,
                        element._originalElement.nextSibling
                    );
                } else if (contentItem.type === 'element') {
                    // Create DOM element from node
                    const domElement = document.createElement(contentItem.tagName);
                    // Copy attributes
                    if (contentItem.attributes) {
                        for (const [attrName, attrValue] of Object.entries(contentItem.attributes)) {
                            domElement.setAttribute(attrName, attrValue);
                        }
                    }
                    // Copy properties
                    if (contentItem.properties) {
                        for (const [propName, propValue] of Object.entries(contentItem.properties)) {
                            domElement[propName] = propValue;
                        }
                    }
                    element._originalElement.parentNode.insertBefore(
                        domElement,
                        element._originalElement.nextSibling
                    );
                    // Update the node to reference the DOM element
                    contentItem._originalElement = domElement;
                } else if (contentItem.type === 'text') {
                    // Create text node
                    const textNode = document.createTextNode(contentItem.value || '');
                    element._originalElement.parentNode.insertBefore(
                        textNode,
                        element._originalElement.nextSibling
                    );
                    // Update the node to reference the DOM element
                    contentItem._originalElement = textNode;
                }
            }

            // Handle DOM manipulation for JQ objects - clone originals
            let domInsertionPoint = element._originalElement.nextSibling;
            for (const jqObject of contentToClone) {
                for (const nodeToClone of jqObject.nodes) {
                    if (nodeToClone._originalElement) {
                        // Clone the DOM element
                        const clonedDomElement = nodeToClone._originalElement.cloneNode(true);
                        element._originalElement.parentNode.insertBefore(
                            clonedDomElement,
                            domInsertionPoint
                        );
                        // Update insertion point for next element
                        domInsertionPoint = clonedDomElement.nextSibling;
                        // Update the cloned node to reference the DOM element
                        // (We need to find the corresponding cloned node - this is complex, skipping for now)
                    }
                }
            }
        }
    }

    return this;
}

module.exports = after;