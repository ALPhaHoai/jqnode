import { parseSelector, nodeMatchesSelector } from '../../../selector';
import type { HtmlNode, CssSelector, JQ } from '../../../types';

/**
 * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
 */
function closest(this: JQ, selector?: CssSelector): JQ {
    if (!selector) {
        const result = Object.create(Object.getPrototypeOf(this));
        result.nodes = [];
        result.length = 0;
        return result;
    }

    // Parse the selector
    const parsedSelector = parseSelector(selector);
    if (!parsedSelector) {
        const result = Object.create(Object.getPrototypeOf(this));
        result.nodes = [];
        result.length = 0;
        return result;
    }

    const results: HtmlNode[] = [];
    const seen = new Set<HtmlNode>();

    for (const node of this.nodes) {
        let current: HtmlNode | undefined = node;

        // Walk up the tree including the current node
        while (current) {
            // Handle both internal nodes and DOM elements
            const isElement = current.type === 'element' || (current.nodeType === 1);
            if (isElement) {
                // Check if this node matches the selector
                if (nodeMatchesSelector(current, parsedSelector)) {
                    // Only add if we haven't seen this element before
                    if (!seen.has(current)) {
                        seen.add(current);
                        results.push(current);
                    }
                    break; // Found the closest match for this element
                }
            }
            // Handle both internal nodes and DOM elements for parent traversal
            current = (current.parent || current.parentNode) as HtmlNode | undefined;
        }
    }
    const result = Object.create(Object.getPrototypeOf(this));
    result.nodes = results;
    result.length = results.length;
    return result;
}

export = closest;
