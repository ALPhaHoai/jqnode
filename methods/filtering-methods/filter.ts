import { nodeMatchesSelector, parseSelector } from '../../selector';
import type { HtmlNode, CssSelector, JQ, FilterCallback } from '../../types';
import JQClass from '../../jq';

/**
 * Reduces the set of matched elements to those that match the selector or pass the function's test.
 */
function filter(this: JQ, selectorOrFunction: CssSelector | FilterCallback, context?: HtmlNode): JQ {
    if (typeof selectorOrFunction === 'string') {
        // CSS selector filter
        const parsedSelector = parseSelector(selectorOrFunction);
        if (!parsedSelector) {
            const result = Object.create(Object.getPrototypeOf(this));
            result.nodes = [];
            result.length = 0;
            return result;
        }

        const filtered = this.nodes.filter((node: HtmlNode) => {
            // Ensure attributes are strings for selector matching and test compatibility
            if (node.attributes) {
                for (const [key, value] of Object.entries(node.attributes)) {
                    if (typeof value !== 'string') {
                        node.attributes[key] = String(value);
                    }
                }
            }

            // Build context for pseudo-selectors
            const selectorContext: { siblings?: HtmlNode[] } = {};
            if (node.parent && node.parent.children) {
                selectorContext.siblings = node.parent.children.filter((child: HtmlNode) => child.type === 'element');
            } else {
                selectorContext.siblings = [];
            }
            return nodeMatchesSelector(node, parsedSelector, selectorContext);
        });

        // Convert attributes to strings on the filtered nodes for test compatibility
        filtered.forEach((node: HtmlNode) => {
            if (node.attributes) {
                for (const [key, value] of Object.entries(node.attributes)) {
                    if (typeof value !== 'string') {
                        node.attributes[key] = String(value);
                    }
                }
            }
        });
        const result = new JQClass(filtered) as JQ;
    result._prevObject = this;
    return result;
    } else if (typeof selectorOrFunction === 'function') {
        // Function filter
        const filtered: HtmlNode[] = [];
        for (let i = 0; i < this.nodes.length; i++) {
            const node: HtmlNode = this.nodes[i];

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
    result.length = 0;
    result._prevObject = this;
    return result;
}

export = filter;
