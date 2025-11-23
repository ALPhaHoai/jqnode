import type { HtmlNode, JQ, CssSelector } from '../../../types';
import { isCSSSelector, selectNodes } from '../../../selector';
import JQClass from '../../../jq';

/**
 * Insert every element in the set of matched elements before the target.
 * @param target - Target elements to insert before
 * @returns The JQ instance for chaining
 */
function insertBefore(this: JQ, target: CssSelector | JQ | HtmlNode | HtmlNode[] | string): JQ {
    let targetJQ: JQ;
    let isDynamicTarget = false;

    if ((target as any).nodes && Array.isArray((target as any).nodes)) {
        targetJQ = target as JQ;
    } else if (typeof target === 'string') {
        if (isCSSSelector(target)) {
            // CSS selector - search within global context
            const nodes = selectNodes(JQClass.allRootNodes, target as CssSelector);
            targetJQ = Object.create(Object.getPrototypeOf(this));
            targetJQ.nodes = nodes;
        } else {
            // HTML string - parse it and mark as dynamic
            const nodes = this._normalizeContent(target as any);
            targetJQ = Object.create(Object.getPrototypeOf(this));
            targetJQ.nodes = nodes;
            isDynamicTarget = true;
        }
    } else {
        // Other content types (nodes, arrays, etc.)
        const nodes = this._normalizeContent(target as any);
        targetJQ = Object.create(Object.getPrototypeOf(this));
        targetJQ.nodes = nodes;
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
                    const rootIndex = JQClass.allRootNodes.indexOf(nodeToClone);
                    if (rootIndex !== -1) {
                        JQClass.allRootNodes.splice(rootIndex, 1);
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

        const allRootNodes = JQClass.allRootNodes;

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
            clonedNode.parent = undefined;
        }
    }

    return this;
}

export = insertBefore;
