import type { HtmlNode, JQ, CssSelector } from '../../../types';
import { selectNodes } from '../../../selector';
import JQClass from '../../../jq';

/**
 * Insert every element in the set of matched elements to the beginning of the target.
 * @param target - Target to prepend to
 * @returns The JQ instance for chaining
  * @see https://api.jquery.com/prependTo/
 */
function prependTo(this: JQ, target: CssSelector | JQ | HtmlNode | HtmlNode[] | string): JQ {
    let targetJQ: JQ;
    let isDynamicTarget = false;

    if ((target as any).nodes && Array.isArray((target as any).nodes)) {
        targetJQ = target as JQ;
    } else if (typeof target === 'string') {
        if (target.trim().startsWith('<')) {
            // HTML string - parse it and mark as dynamic
            const nodes = this._normalizeContent(target as any);
            targetJQ = Object.create(Object.getPrototypeOf(this));
            targetJQ.nodes = nodes;
            isDynamicTarget = true;
        } else {
            // Selector string - find matching elements
            const nodes = selectNodes(JQClass.allRootNodes, target as CssSelector);
            targetJQ = Object.create(Object.getPrototypeOf(this));
            targetJQ.nodes = nodes;
        }
    } else {
        // Other content - normalize it
        const nodes = this._normalizeContent(target as any);
        targetJQ = Object.create(Object.getPrototypeOf(this));
        targetJQ.nodes = nodes;
        isDynamicTarget = true;
    }

    const newNodes: HtmlNode[] = [];
    const lastIndex = targetJQ.nodes.length - 1;

    for (let i = 0; i < targetJQ.nodes.length; i++) {
        const targetElement = targetJQ.nodes[i];
        if (targetElement.type === 'element' && targetElement.children) {
            const isLast = i === lastIndex;
            const nodesToAddForTarget: HtmlNode[] = [];

            for (const node of this.nodes) {
                let nodeToAdd: HtmlNode;

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

                nodeToAdd.parent = targetElement;
                nodesToAddForTarget.push(nodeToAdd);
                newNodes.push(nodeToAdd);
            }

            targetElement.children.unshift(...nodesToAddForTarget);
        }
    }

    // If this is a dynamically created target, add it to the root
    if (isDynamicTarget) {
        for (const targetElement of targetJQ.nodes) {
            if (!JQClass.allRootNodes.includes(targetElement)) {
                JQClass.allRootNodes.push(targetElement);
            }
        }
    }

    // Return a new JQ object containing all appended nodes (originals + clones)
    const newJQ = Object.create(Object.getPrototypeOf(this));
    newJQ.nodes = newNodes;
    return newJQ;
}

export = prependTo;
