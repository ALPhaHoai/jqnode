import { selectNodes } from '../../../selector';
import type { JqElement, CssSelector, JQ } from '../../../types';
import JQClass from '../../../jq';

/**
 * Gets the parent of each element in the current set of matched elements, optionally filtered by a selector.
 * @see https://api.jquery.com/parent/
 */
function parent(this: JQ, selector?: CssSelector): JQ {
    const parents: JqElement[] = [];
    const seen = new Set<JqElement | ParentNode>(); // Avoid duplicates

    for (const node of this.nodes) {
        // Handle both internal nodes and DOM elements
        const parentNode = node.parent || node.parentNode;
        if (parentNode && !seen.has(parentNode)) {
            // Check if it's an element and not HTML
            let isElement = false;
            let isHtml = false;

            if (node.parent && node.parent.internalType === 'element') {
                isElement = true;
                isHtml = Boolean(node.tagName && node.tagName.toLowerCase() === 'html');
            } else if (node.parentNode && node.parentNode.nodeType === 1) {
                isElement = true;
                isHtml =
                    'tagName' in node.parentNode &&
                    (node.parentNode as Element).tagName.toLowerCase() === 'html';
            }

            if (isElement && !isHtml) {
                // Type guard: ensure it's an JqElement
                const htmlParent = parentNode as JqElement;
                seen.add(htmlParent);
                parents.push(htmlParent);
            }
        }
    }

    let resultNodes = parents;

    // If selector provided, filter parents that match the selector
    if (selector) {
        const rootNodes = this._findCommonRoots(this.nodes);
        const matchingParents = selectNodes(rootNodes, selector);

        resultNodes = parents.filter((p: JqElement) => matchingParents.includes(p));
    }
    const result = new JQClass(resultNodes) as JQ;
    result._prevObject = this;
    return result;
}

export default parent;
