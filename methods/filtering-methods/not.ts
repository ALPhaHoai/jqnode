import { selectNodes } from '../../selector';
import type { JqElement, CssSelector, JQ, FilterCallback } from '../../types';

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
        return this.pushStack(filtered);
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
        return this.pushStack(filtered);
    } else if (
        selectorOrFunctionOrElementOrJQ &&
        typeof selectorOrFunctionOrElementOrJQ === 'object'
    ) {
        if (
            'internalType' in selectorOrFunctionOrElementOrJQ &&
            selectorOrFunctionOrElementOrJQ.internalType === 'element'
        ) {
            // Direct element reference - exclude this specific element
            const filtered = this.nodes.filter(
                (node: JqElement) => node !== selectorOrFunctionOrElementOrJQ,
            );
            return this.pushStack(filtered);
        } else if (
            'nodes' in selectorOrFunctionOrElementOrJQ &&
            Array.isArray(selectorOrFunctionOrElementOrJQ.nodes)
        ) {
            // JQ object - exclude all elements in it
            const nodesToExclude = selectorOrFunctionOrElementOrJQ.nodes;
            const filtered = this.nodes.filter(
                (node: JqElement) => !nodesToExclude.includes(node),
            );
            return this.pushStack(filtered);
        }
    }

    return this.pushStack(this.nodes);
}

export default not;
