import { selectNodes } from '../../selector';
import type { HtmlNode, CssSelector, JQ } from '../../types';

/**
 * Reduces the set of matched elements to those that have a descendant that matches the selector or element.
 */
function has(this: JQ, selectorOrElement: CssSelector | HtmlNode): JQ {
    const matchingElements: HtmlNode[] = [];

    if (typeof selectorOrElement === 'string') {
        for (const element of this.nodes) {
            if (element.type === 'element' && element.children) {
                // Search only among element children, not including the element itself
                const elementChildren = element.children.filter((child: HtmlNode) => child.type === 'element');
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
    } else if (selectorOrElement && typeof selectorOrElement === 'object' && selectorOrElement.type === 'element') {
        // Direct element reference
        for (const element of this.nodes) {
            if (element.type === 'element' && element.children) {
                const hasDescendant = this._hasDescendant(element, selectorOrElement);
                if (hasDescendant) {
                    matchingElements.push(element);
                }
            }
        }
    }
    const result = Object.create(Object.getPrototypeOf(this));
    result.nodes = matchingElements;
    result.length = matchingElements.length;
    return result;
}

export = has;
