import { selectNodes } from '../../../selector';
import type { HtmlNode, CssSelector, JQ } from '../../../types';
import JQClass from '../../../jq';

/**
 * Gets the parent of each element in the current set of matched elements, optionally filtered by a selector.
  * @see https://api.jquery.com/parent/
 */
function parent(this: JQ, selector?: CssSelector): JQ {
    const parents: HtmlNode[] = [];
    const seen = new Set<HtmlNode | ParentNode>(); // Avoid duplicates

    for (const node of this.nodes) {
        // Handle both internal nodes and DOM elements
        let parentNode = node.parent || node.parentNode;
        if (parentNode && !seen.has(parentNode)) {
            // Check if it's an element and not HTML
            let isElement = false;
            let isHtml = false;

            if (node.parent && node.parent.type === 'element') {
                isElement = true;
                isHtml = Boolean(node.tagName && node.tagName.toLowerCase() === 'html');
            } else if (node.parentNode && node.parentNode.nodeType === 1) {
                isElement = true;
                isHtml = ('tagName' in node.parentNode && (node.parentNode as Element).tagName.toLowerCase() === 'html');
            }

            if (isElement && !isHtml) {
                // Type guard: ensure it's an HtmlNode
                const htmlParent = parentNode as HtmlNode;
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

        resultNodes = parents.filter((p: HtmlNode) => matchingParents.includes(p));
    }
    const result = new JQClass(resultNodes) as JQ;
    result._prevObject = this;
    return result;
}

export = parent;
