const {selectNodes} = require('../../../selector');

function insertAfter(target) {
    let targetJQ;
    let isDynamicTarget = false;
    if (target instanceof this.constructor) {
        targetJQ = target;
    } else if (typeof target === 'string') {
        const {isCSSSelector, selectNodes} = require('../../../selector');
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
    // If this is a dynamically created target, add it to the root first
    if (isDynamicTarget) {
        for (const targetElement of targetJQ.nodes) {
            if (!require('../../../jq').allRootNodes.includes(targetElement)) {
                require('../../../jq').allRootNodes.push(targetElement);
            }
        }
    }

    for (const targetElement of targetJQ.nodes) {
        if (targetElement.parent && targetElement.parent.children) {
            const siblings = targetElement.parent.children;
            const targetIndex = siblings.indexOf(targetElement);

            if (targetIndex !== -1) {
                // Clone our nodes (jQuery clones existing elements)
                // First remove originals from node tree if they are attached
                for (const nodeToClone of this.nodes) {
                    if (nodeToClone.parent && nodeToClone.parent.children) {
                        const index = nodeToClone.parent.children.indexOf(nodeToClone);
                        if (index !== -1) {
                            nodeToClone.parent.children.splice(index, 1);
                        }
                    }
                    // For dynamic targets, don't remove from root nodes (keep original)
                    if (!isDynamicTarget) {
                        const rootIndex = require('../../../jq').allRootNodes.indexOf(nodeToClone);
                        if (rootIndex !== -1) {
                            require('../../../jq').allRootNodes.splice(rootIndex, 1);
                        }
                    }
                }

                // Clone nodes to insert
                const clonedNodes = this.nodes.map(node => this._cloneNode(node));

                // Insert clones after target
                siblings.splice(targetIndex + 1, 0, ...clonedNodes);

                // Set parent references for the cloned nodes
                for (const clonedNode of clonedNodes) {
                    clonedNode.parent = targetElement.parent;
                }
            }
        } else {
            // Target is a root node, insert into root nodes array
            const rootNodes = require('../../../jq').allRootNodes;
            const targetIndex = rootNodes.indexOf(targetElement);
            if (targetIndex !== -1) {
                // Clone our nodes (jQuery clones existing elements)
                // First remove originals from node tree if they are attached
                for (const nodeToClone of this.nodes) {
                    if (nodeToClone.parent && nodeToClone.parent.children) {
                        const index = nodeToClone.parent.children.indexOf(nodeToClone);
                        if (index !== -1) {
                            nodeToClone.parent.children.splice(index, 1);
                        }
                    }
                    // For dynamic targets, don't remove from root nodes (keep original)
                    if (!isDynamicTarget) {
                        const rootIndex = rootNodes.indexOf(nodeToClone);
                        if (rootIndex !== -1) {
                            rootNodes.splice(rootIndex, 1);
                        }
                    }
                }

                // Clone nodes to insert
                const clonedNodes = this.nodes.map(node => this._cloneNode(node));

                // Insert clones after target in root nodes
                rootNodes.splice(targetIndex + 1, 0, ...clonedNodes);
            }
        }
    }

    return this;
}

module.exports = insertAfter;