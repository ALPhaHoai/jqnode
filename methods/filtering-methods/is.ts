import { selectNodes } from '../../selector';
import type { HtmlNode, CssSelector, JQ, FilterCallback } from '../../types';

/**
 * Checks the current matched set of elements against a selector, element, function, or JQ object and returns true if at least one matches.
 * @param selectorOrFunctionOrElement - CSS selector, function, element, or JQ object to test against
 * @see https://api.jquery.com/is/
 */
function is(this: JQ, selectorOrFunctionOrElement: CssSelector | FilterCallback | HtmlNode | JQ): boolean {
    if (typeof selectorOrFunctionOrElement === 'string') {
        // CSS selector
        const rootNodes = this._findCommonRoots(this.nodes);
        const allMatches = selectNodes(rootNodes, selectorOrFunctionOrElement);

        const result = this.nodes.some((node: HtmlNode) => allMatches.includes(node));
        return result;
    } else if (typeof selectorOrFunctionOrElement === 'function') {
        // Function test
        for (let i = 0; i < this.nodes.length; i++) {
            const node: HtmlNode = this.nodes[i];
            try {
                const result = selectorOrFunctionOrElement.call(node, i, node);
                if (result) {
                    return true;
                }
            } catch (error) {
                // If function throws error, treat as falsy (continue checking)
            }
        }
        return false;
    } else if (selectorOrFunctionOrElement && typeof selectorOrFunctionOrElement === 'object') {
        if ('type' in selectorOrFunctionOrElement && selectorOrFunctionOrElement.type === 'element') {
            // Direct element reference
            const result = this.nodes.includes(selectorOrFunctionOrElement);
            return result;
        } else if ('nodes' in selectorOrFunctionOrElement && Array.isArray(selectorOrFunctionOrElement.nodes)) {
            // JQ object - check if any of our nodes are in the other JQ object
            const result = this.nodes.some((node: HtmlNode) => selectorOrFunctionOrElement.nodes.includes(node));
            return result;
        }
    }
    return false;
}

export = is;
