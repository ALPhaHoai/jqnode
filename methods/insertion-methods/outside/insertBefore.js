const {isCSSSelector, selectNodes} = require('../../../selector');

/**
 * Insert selected elements before each target.
 * @see https://api.jquery.com/insertBefore/
 * @param {*} target - Target elements to insert before
 * @returns {JQ} New JQ instance with the inserted elements
 */
module.exports = function insertBefore(target) {
    let targetJQ;
    let isDynamicTarget = false;
    if (target && target.constructor && target.constructor.name === 'JQ') {
        targetJQ = target;
    } else if (typeof target === 'string') {
        if (isCSSSelector(target)) {
            // CSS selector - search within global context
            const nodes = selectNodes(require('../../../jq').allRootNodes, target);
            targetJQ = new this.constructor(nodes);
        } else {
            // HTML string - parse it and mark as dynamic
            targetJQ = new this.constructor(this._normalizeContent(target));
            isDynamicTarget = true;
        }
    } else {
        // Other content types (nodes, arrays, etc.)
        targetJQ = new this.constructor(this._normalizeContent(target));
        isDynamicTarget = true;
    }
    for (const targetElement of targetJQ.nodes) {
        if (targetElement.parent && targetElement.parent.children) {
            const siblings = targetElement.parent.children;
            const targetIndex = siblings.indexOf(targetElement);

            if (targetIndex !== -1) {
                // Clone our nodes (jQuery clones existing elements)
                // First remove originals from node tree
                for (const nodeToClone of this.nodes) {
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

                // Clone nodes to insert
                const clonedNodes = this.nodes.map(node => this._cloneNode(node));

                // Insert clones before target
                siblings.splice(targetIndex, 0, ...clonedNodes);

                // Set parent references for the cloned nodes
                for (const clonedNode of clonedNodes) {
                    clonedNode.parent = targetElement.parent;
                }
            }
        }

        // Update the DOM if target has _originalElement
        if (targetElement._originalElement && targetElement._originalElement.parentNode) {
            for (const sourceNode of this.nodes) {
                if (sourceNode._originalElement) {
                    // Move existing DOM element
                    targetElement._originalElement.parentNode.insertBefore(
                        sourceNode._originalElement,
                        targetElement._originalElement
                    );
                } else if (sourceNode.type === 'element') {
                    // Create DOM element from node
                    const domElement = document.createElement(sourceNode.tagName);
                    // Copy attributes
                    if (sourceNode.attributes) {
                        for (const [attrName, attrValue] of Object.entries(sourceNode.attributes)) {
                            domElement.setAttribute(attrName, attrValue);
                        }
                    }
                    // Copy properties
                    if (sourceNode.properties) {
                        for (const [propName, propValue] of Object.entries(sourceNode.properties)) {
                            domElement[propName] = propValue;
                        }
                    }
                    targetElement._originalElement.parentNode.insertBefore(
                        domElement,
                        targetElement._originalElement
                    );
                    // Update the node to reference the DOM element
                    sourceNode._originalElement = domElement;
                } else if (sourceNode.type === 'text') {
                    // Create text node
                    const textNode = document.createTextNode(sourceNode.value || '');
                    targetElement._originalElement.parentNode.insertBefore(
                        textNode,
                        targetElement._originalElement
                    );
                    // Update the node to reference the DOM element
                    sourceNode._originalElement = textNode;
                }
            }
        }
    }

    // If this is a dynamically created target, insert source elements before target at root level
    if (isDynamicTarget) {
        // Clone our nodes (jQuery clones existing elements)
        // First remove originals from node tree
        for (const nodeToClone of this.nodes) {
            if (nodeToClone.parent && nodeToClone.parent.children) {
                const index = nodeToClone.parent.children.indexOf(nodeToClone);
                if (index !== -1) {
                    nodeToClone.parent.children.splice(index, 1);
                }
            }
        }

        const allRootNodes = require('../../../jq').allRootNodes;

        // Remove originals from allRootNodes
        for (const nodeToClone of this.nodes) {
            const rootIndex = allRootNodes.indexOf(nodeToClone);
            if (rootIndex !== -1) {
                allRootNodes.splice(rootIndex, 1);
            }
        }

        // Clone nodes to insert
        const clonedNodes = this.nodes.map(node => this._cloneNode(node));

        // Find the position of the target nodes in allRootNodes and insert cloned nodes before them
        for (const targetElement of targetJQ.nodes) {
            const targetIndex = allRootNodes.indexOf(targetElement);
            if (targetIndex !== -1) {
                // Insert cloned nodes before this target
                allRootNodes.splice(targetIndex, 0, ...clonedNodes);
                break; // Only insert before the first target
            }
        }

        // Set parent references for the cloned nodes (no parent since they're at root)
        for (const clonedNode of clonedNodes) {
            clonedNode.parent = null;
        }
    }

    return this;
};