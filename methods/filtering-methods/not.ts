import { selectNodes } from '../../selector';
import type { HtmlNode, CssSelector, JQ, FilterCallback } from '../../types';
import JQClass from '../../jq';

/**
 * Removes elements from the set of matched elements.
 */
function not(this: JQ, selectorOrFunction: CssSelector | FilterCallback): JQ {
    if (typeof selectorOrFunction === 'string') {
        // CSS selector filter
        const rootNodes = this._findCommonRoots(this.nodes);
        const allMatches = selectNodes(rootNodes, selectorOrFunction);

        const filtered = this.nodes.filter((node: HtmlNode) => !allMatches.includes(node));
        return new JQClass(filtered);
    } else if (typeof selectorOrFunction === 'function') {
        // Function filter
        const filtered: HtmlNode[] = [];
        for (let i = 0; i < this.nodes.length; i++) {
            const node: HtmlNode = this.nodes[i];
            try {
                const result = selectorOrFunction.call(node, i, node);
                if (!result) {
                    filtered.push(node);
                }
            } catch (error) {
                // If function throws error, treat as falsy (keep element)
                filtered.push(node);
            }
        }
        return new JQClass(filtered);
    }
    const result = Object.create(Object.getPrototypeOf(this));
    result.nodes = this.nodes;
    // result.length is a getter that returns result.nodes.length, so we don't need to set it
    return result;
}

export = not;
