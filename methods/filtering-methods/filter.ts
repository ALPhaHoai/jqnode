import { nodeMatchesSelector, parseSelector } from '../../selector';
import type { JqElement, CssSelector, JQ, FilterCallback } from '../../types';
import { createEmptyJQ } from '../../helpers/jq-factory';

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
            return createEmptyJQ(this);
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

        return this.pushStack(filtered);
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
                // Skip elements that cause error
            }
        }
        return this.pushStack(filtered);
    }

    return this.pushStack([]);
}

export default filter;
