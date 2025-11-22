import { selectNodes } from '../../selector';
import type { HtmlNode, CssSelector, JQ } from '../../types';

type NotCallback = (this: HtmlNode, index: number, element: HtmlNode) => boolean;

/**
 * Removes elements from the set of matched elements.
 */
function not(this: JQ, selectorOrFunction: CssSelector | NotCallback): JQ {
    if (typeof selectorOrFunction === 'string') {
        // CSS selector filter
        const rootNodes = this._findCommonRoots(this.nodes);
        const allMatches = selectNodes(rootNodes, selectorOrFunction);

        const filtered = this.nodes.filter((node: HtmlNode) => !allMatches.includes(node));
        const result = Object.create(Object.getPrototypeOf(this));
        result.nodes = filtered;
        result.length = filtered.length;
        return result;
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
        const result = Object.create(Object.getPrototypeOf(this));
        result.nodes = filtered;
        result.length = filtered.length;
        return result;
    }
    const result = Object.create(Object.getPrototypeOf(this));
    result.nodes = this.nodes;
    result.length = this.nodes.length;
    return result;
}

export = not;
