import { selectNodes } from '../../selector';
import type { JqElement, CssSelector, JQ } from '../../types';
import JQClass from '../../jq';

/**
 * Reduces the set of matched elements to those that have a descendant that matches the selector or element.
 * @see https://api.jquery.com/has/
 */
function has(this: JQ, selectorOrElement: CssSelector | JqElement): JQ {
    const matchingElements: JqElement[] = [];

    if (typeof selectorOrElement === 'string') {
        for (const element of this.nodes) {
            if (element.internalType === 'element' && element.children) {
                // Search only among element children, not including the element itself
                const elementChildren = element.children.filter(
                    (child: JqElement) => child.internalType === 'element',
                );
                try {
                    const descendants = selectNodes(elementChildren, selectorOrElement);
                    if (descendants.length > 0) {
                        matchingElements.push(element);
                    }
                } catch (error) {
                    // Re-throw syntax errors to match jQuery behavior
                    if (error instanceof SyntaxError) {
                        throw error;
                    }
                    // For other errors, skip this element
                }
            }
        }
    } else if (
        selectorOrElement &&
        typeof selectorOrElement === 'object' &&
        selectorOrElement.internalType === 'element'
    ) {
        // Direct element reference
        for (const element of this.nodes) {
            if (element.internalType === 'element' && element.children) {
                const hasDescendant = this._hasDescendant(element, selectorOrElement);
                if (hasDescendant) {
                    matchingElements.push(element);
                }
            }
        }
    }
    return new JQClass(matchingElements);
}

export default has;
