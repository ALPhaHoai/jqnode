const {nodeMatchesSelector, parseSelector} = require('../selector');

function filter(selectorOrFunction, context) {
    this.debugLog(`JQ.filter: Filtering ${this.nodes.length} elements with ${typeof selectorOrFunction}`);

    if (typeof selectorOrFunction === 'string') {
        // CSS selector filter
        const parsedSelector = parseSelector(selectorOrFunction);
        if (!parsedSelector) {
            this.debugLog(`JQ.filter: Invalid selector "${selectorOrFunction}", returning empty result`);
            return new this.constructor([]);
        }

        const filtered = this.nodes.filter(node => {
            // Ensure attributes are strings for selector matching and test compatibility
            if (node.attributes) {
                for (const [key, value] of Object.entries(node.attributes)) {
                    if (typeof value !== 'string') {
                        node.attributes[key] = String(value);
                    }
                }
            }

            // Build context for pseudo-selectors
            const context = {};
            if (node.parent && node.parent.children) {
                context.siblings = node.parent.children.filter(child => child.type === 'element');
            } else {
                context.siblings = [];
            }
            return nodeMatchesSelector(node, parsedSelector, context);
        });

        // Convert attributes to strings on the filtered nodes for test compatibility
        filtered.forEach(node => {
            if (node.attributes) {
                for (const [key, value] of Object.entries(node.attributes)) {
                    if (typeof value !== 'string') {
                        node.attributes[key] = String(value);
                    }
                }
            }
        });
        this.debugLog(`JQ.filter: Filtered to ${filtered.length} elements using selector "${selectorOrFunction}"`);
        const result = new this.constructor(filtered);
        result._prevObject = this;
        return result;
    } else if (typeof selectorOrFunction === 'function') {
        // Function filter
        const filtered = [];
        for (let i = 0; i < this.nodes.length; i++) {
            const node = this.nodes[i];

            try {
                const result = selectorOrFunction.call(context || node, i, node);
                if (result) {
                    filtered.push(node);
                }
            } catch (error) {
                // Skip elements that cause errors in the filter function
                this.debugLog(`JQ.filter: Skipping element at index ${i} due to error: ${error.message}`);
                // Continue to next element without adding this one
            }
        }
        this.debugLog(`JQ.filter: Filtered to ${filtered.length} elements using function`);
        const result = new this.constructor(filtered);
        result._prevObject = this;
        return result;
    }

    this.debugLog(`JQ.filter: Invalid selector/function, returning empty result`);
    const result = new this.constructor([]);
    result._prevObject = this;
    return result;
}

module.exports = filter;