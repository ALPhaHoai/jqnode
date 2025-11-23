import { selectNodes } from '../../selector';
import type { HtmlNode, CssSelector, JQ, FilterCallback } from '../../types';
import JQClass from '../../jq';

/**
 * Removes elements from the set of matched elements.
 * @param selectorOrFunctionOrElementOrJQ - CSS selector, function, element, or JQ object to exclude
 * @see https://api.jquery.com/not/
 */
function not(
    this: JQ,
    selectorOrFunctionOrElementOrJQ: CssSelector | FilterCallback | HtmlNode | JQ,
): JQ {
    if (typeof selectorOrFunctionOrElementOrJQ === 'string') {
        // CSS selector filter
        const rootNodes = this._findCommonRoots(this.nodes);
        const allMatches = selectNodes(rootNodes, selectorOrFunctionOrElementOrJQ);

        const filtered = this.nodes.filter((node: HtmlNode) => !allMatches.includes(node));
        return new JQClass(filtered);
    } else if (typeof selectorOrFunctionOrElementOrJQ === 'function') {
        // Function filter
        const filtered: HtmlNode[] = [];
        for (let i = 0; i < this.nodes.length; i++) {
            const node: HtmlNode = this.nodes[i];
            try {
                const result = selectorOrFunctionOrElementOrJQ.call(node, i, node);
                if (!result) {
                    filtered.push(node);
                }
            } catch (error) {
                // If function throws error, treat as falsy (keep element)
                filtered.push(node);
            }
        }
        return new JQClass(filtered);
    } else if (
        selectorOrFunctionOrElementOrJQ &&
        typeof selectorOrFunctionOrElementOrJQ === 'object'
    ) {
        if (
            'type' in selectorOrFunctionOrElementOrJQ &&
            selectorOrFunctionOrElementOrJQ.type === 'element'
        ) {
            // Direct element reference - exclude this specific element
            const filtered = this.nodes.filter(
                (node: HtmlNode) => node !== selectorOrFunctionOrElementOrJQ,
            );
            return new JQClass(filtered);
        } else if (
            'nodes' in selectorOrFunctionOrElementOrJQ &&
            Array.isArray(selectorOrFunctionOrElementOrJQ.nodes)
        ) {
            // JQ object - exclude all nodes in the other JQ object
            const filtered = this.nodes.filter(
                (node: HtmlNode) => !selectorOrFunctionOrElementOrJQ.nodes.includes(node),
            );
            return new JQClass(filtered);
        }
    }
    const result = Object.create(Object.getPrototypeOf(this));
    result.nodes = this.nodes;
    // result.length is a getter that returns result.nodes.length, so we don't need to set it
    return result;
}

export = not;
