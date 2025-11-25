import { nodeMatchesSelector, parseSelector } from '../../selector';
import type { JqElement, CssSelector, JQ, FilterCallback } from '../../types';
import JQClass from '../../jq';

/**
 * Reduces the set of matched elements to those that match the selector or pass the function's test.
 * @see https://api.jquery.com/filter/
 */
function filter(
    this: JQ,
    selectorOrFunction: CssSelector | FilterCallback,
    context?: JqElement,
): JQ {
    if (typeof selectorOrFunction === 'string') {
        // CSS selector filter
        const parsedSelector = parseSelector(selectorOrFunction);
        if (!parsedSelector) {
            const result = Object.create(Object.getPrototypeOf(this));
            result.nodes = [];

            return result;
        }

        const filtered = this.nodes.filter((node: JqElement) => {
            // Build context for pseudo-selectors
            const selectorContext: { siblings?: JqElement[] } = {};
            if (node.parent && node.parent.children) {
                selectorContext.siblings = node.parent.children.filter(
                    (child: JqElement) => child.internalType === 'element',
                );
            } else {
                selectorContext.siblings = [];
            }
            return nodeMatchesSelector(node, parsedSelector, selectorContext);
        });

        const result = new JQClass(filtered) as JQ;
        result._prevObject = this;
        return result;
    } else if (typeof selectorOrFunction === 'function') {
        // Function filter
        const filtered: JqElement[] = [];
        for (let i = 0; i < this.nodes.length; i++) {
            const node: JqElement = this.nodes[i];

            try {
                const result = selectorOrFunction.call(context || node, i, node);
                if (result) {
                    filtered.push(node);
                }
            } catch (error) {
                // Skip elements that cause errors in the filter function
            }
        }
        const result = new JQClass(filtered) as JQ;
        result._prevObject = this;
        return result;
    }
    const result = Object.create(Object.getPrototypeOf(this));
    result.nodes = [];

    result._prevObject = this;
    return result;
}

export default filter;
