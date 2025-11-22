import type { HtmlNode, JQ, CssSelector } from '../../../types';
import { isCSSSelector, selectNodes } from '../../../selector';
import JQClass from '../../../jq';

/**
 * Insert every element in the set of matched elements after the target.
 * @param target - Target elements to insert after
 * @returns The JQ instance for chaining
 */
function insertAfter(this: JQ, target: CssSelector | JQ | HtmlNode | HtmlNode[] | string): JQ {
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
            const nodes = this._normalizeContent(target);
            targetJQ = Object.create(Object.getPrototypeOf(this));
            targetJQ.nodes = nodes;
            isDynamicTarget = true;
        }
    } else {
        // Other content types (nodes, arrays, etc.)
        const nodes = this._normalizeContent(target);
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
                        const rootIndex = JQClass.allRootNodes.indexOf(nodeToClone);
                        if (rootIndex !== -1) {
                            JQClass.allRootNodes.splice(rootIndex, 1);
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
            const rootNodes = JQClass.allRootNodes;
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

export = insertAfter;
