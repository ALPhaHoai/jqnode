import type { JqElement, JQ, CssSelector } from '../../../types';
import { isCSSSelector, selectNodes } from '../../../selector';
import JQClass from '../../../jq';

/**
 * Insert every element in the set of matched elements after the target.
 * @param target - Target elements to insert after
 * @returns The JQ instance for chaining
 * @see https://api.jquery.com/insertAfter/
 */
function insertAfter(this: JQ, target: CssSelector | JQ | JqElement | JqElement[] | string): JQ {
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

    // If this is a dynamically created target, add it to the root first
    if (isDynamicTarget) {
        for (const targetElement of targetJQ.nodes) {
            if (!JQClass.allRootNodes.includes(targetElement)) {
                JQClass.allRootNodes.push(targetElement);
            }
        }
    }

    const newNodes: JqElement[] = [];
    const lastIndex = targetJQ.nodes.length - 1;

    for (let i = 0; i < targetJQ.nodes.length; i++) {
        const targetElement = targetJQ.nodes[i];

        // Find parent and index
        let parentChildren: JqElement[] | undefined;
        let targetIndex = -1;

        if (targetElement.parent && targetElement.parent.children) {
            parentChildren = targetElement.parent.children;
            targetIndex = parentChildren.indexOf(targetElement);
        } else if (JQClass.allRootNodes.includes(targetElement)) {
            parentChildren = JQClass.allRootNodes;
            targetIndex = parentChildren.indexOf(targetElement);
        }

        if (parentChildren && targetIndex !== -1) {
            const isLast = i === lastIndex;
            const nodesToAddForTarget: JqElement[] = [];

            for (const node of this.nodes) {
                let nodeToAdd: JqElement;

                if (isLast) {
                    // For the last target, we move the original node
                    nodeToAdd = node;

                    // Detach from current parent if exists
                    if (nodeToAdd.parent && nodeToAdd.parent.children) {
                        const index = nodeToAdd.parent.children.indexOf(nodeToAdd);
                        if (index !== -1) {
                            nodeToAdd.parent.children.splice(index, 1);
                        }
                    }

                    // Remove from allRootNodes if present
                    const rootIndex = JQClass.allRootNodes.indexOf(nodeToAdd);
                    if (rootIndex !== -1) {
                        JQClass.allRootNodes.splice(rootIndex, 1);
                    }
                } else {
                    // For non-last targets, we clone the node
                    nodeToAdd = this._cloneNode(node);
                }

                // Set parent reference
                if (targetElement.parent) {
                    nodeToAdd.parent = targetElement.parent;
                } else {
                    nodeToAdd.parent = undefined; // Root node
                }

                nodesToAddForTarget.push(nodeToAdd);
                newNodes.push(nodeToAdd);
            }

            // Insert all nodes at once after the target
            // Note: If we are moving nodes that are already in the same parent, indices might shift.
            // But here we detached them first (if moving), so indices should be stable relative to target (if target wasn't moved).
            // However, if target was one of the nodes we moved... that's an edge case.
            // jQuery usually handles this.

            // We need to re-calculate targetIndex because detaching nodes might have shifted it
            // if the detached nodes were before the target in the same parent.
            if (targetElement.parent && targetElement.parent.children) {
                targetIndex = targetElement.parent.children.indexOf(targetElement);
            } else if (JQClass.allRootNodes.includes(targetElement)) {
                targetIndex = JQClass.allRootNodes.indexOf(targetElement);
            }

            if (targetIndex !== -1) {
                parentChildren.splice(targetIndex + 1, 0, ...nodesToAddForTarget);
            }
        }
    }

    // Return a new JQ object containing all inserted nodes (originals + clones)
    const newJQ = Object.create(Object.getPrototypeOf(this));
    newJQ.nodes = newNodes;
    return newJQ;
}

export default insertAfter;
