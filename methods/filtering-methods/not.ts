import { selectNodes } from '../../selector';
import type { JqElement, CssSelector, JQ, FilterCallback } from '../../types';
import JQClass from '../../jq';
import { createJQWithNodes } from '../../helpers/jq-factory';

/**
 * Removes elements from the set of matched elements.
 * @param selectorOrFunctionOrElementOrJQ - CSS selector, function, element, or JQ object to exclude
 * @see https://api.jquery.com/not/
 */
function not(
    this: JQ,
    selectorOrFunctionOrElementOrJQ: CssSelector | FilterCallback | JqElement | JQ,
): JQ {
    if (typeof selectorOrFunctionOrElementOrJQ === 'string') {
        // CSS selector filter
        const rootNodes = this._findCommonRoots(this.nodes);
        const allMatches = selectNodes(rootNodes, selectorOrFunctionOrElementOrJQ);

        const filtered = this.nodes.filter((node: JqElement) => !allMatches.includes(node));
        return new JQClass(filtered);
    } else if (typeof selectorOrFunctionOrElementOrJQ === 'function') {
        // Function filter
        const filtered: JqElement[] = [];
        for (let i = 0; i < this.nodes.length; i++) {
            const node: JqElement = this.nodes[i];
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
                (node: JqElement) => node !== selectorOrFunctionOrElementOrJQ,
            );
            return new JQClass(filtered);
        } else if (
            'nodes' in selectorOrFunctionOrElementOrJQ &&
            Array.isArray(selectorOrFunctionOrElementOrJQ.nodes)
        ) {
            // JQ object - exclude all nodes in the other JQ object
            const filtered = this.nodes.filter(
                (node: JqElement) => !selectorOrFunctionOrElementOrJQ.nodes.includes(node),
            );
            return new JQClass(filtered);
        }
    }
    // result.length is a getter that returns result.nodes.length, so we don't need to set it
    return createJQWithNodes(this, this.nodes);
}

export default not;
