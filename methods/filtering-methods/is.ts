import { selectNodes } from '../../selector';
import type { HtmlNode, CssSelector, JQ } from '../../types';

/**
 * Checks the current matched set of elements against a selector, element, or JQ object and returns true if at least one matches.
 */
function is(this: JQ, selectorOrElement: CssSelector | HtmlNode | JQ): boolean {
    if (typeof selectorOrElement === 'string') {
        // CSS selector
        const rootNodes = this._findCommonRoots(this.nodes);
        const allMatches = selectNodes(rootNodes, selectorOrElement);

        const result = this.nodes.some((node: HtmlNode) => allMatches.includes(node));
        return result;
    } else if (selectorOrElement && typeof selectorOrElement === 'object') {
        if (selectorOrElement.type === 'element') {
            // Direct element reference
            const result = this.nodes.includes(selectorOrElement);
            return result;
        } else if ('nodes' in selectorOrElement && Array.isArray(selectorOrElement.nodes)) {
            // JQ object - check if any of our nodes are in the other JQ object
            const result = this.nodes.some((node: HtmlNode) => selectorOrElement.nodes.includes(node));
            return result;
        }
    }
    return false;
}

export = is;
