import type { HtmlNode, JQ, CssSelector } from '../../../types';
import { selectNodes } from '../../../selector';
import JQClass from '../../../jq';

/**
 * Insert every element in the set of matched elements to the end of the target.
 * @param target - Target to append to
 * @returns The JQ instance for chaining
 */
function appendTo(this: JQ, target: CssSelector | JQ | HtmlNode | HtmlNode[] | string): JQ {
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

    for (const targetElement of targetJQ.nodes) {
        if (targetElement.type === 'element' && targetElement.children) {
            // Clone our nodes to avoid sharing references
            const clonedNodes = this.nodes.map(node => this._cloneNode(node));
            targetElement.children.push(...clonedNodes);

            // Set parent references for the cloned nodes
            for (const clonedNode of clonedNodes) {
                clonedNode.parent = targetElement;
            }
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

    return this;
}

export = appendTo;
