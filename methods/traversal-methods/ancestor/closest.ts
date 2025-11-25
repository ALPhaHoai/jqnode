import { parseSelector, nodeMatchesSelector } from '../../../selector';
import type { CssSelector, JQ, JqElement } from '../../../types';
import { createEmptyJQ } from '../../../helpers/jq-factory';
import JQClass from '../../../jq';

/**
 * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
 * @see https://api.jquery.com/closest/
 */
function closest(this: JQ, selector?: CssSelector): JQ {
    if (!selector) {
        return createEmptyJQ(this);
    }

    // Parse the selector
    const parsedSelector = parseSelector(selector);
    if (!parsedSelector) {
        return createEmptyJQ(this);
    }

    const results: JqElement[] = [];
    const seen = new Set<JqElement>();

    for (const node of this.nodes) {
        let current: JqElement | undefined = node;

        // Walk up the tree including the current node
        while (current) {
            // Handle both internal nodes and DOM elements
            const isElement = current.internalType === 'element' || current.nodeType === 1;
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
            current = (current.parent || current.parentNode) as JqElement | undefined;
        }
    }
    return new JQClass(results);
}

export default closest;
