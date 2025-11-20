const {nodeMatchesSelector, parseSelector} = require('../../selector');

function filter(selectorOrFunction, context) {
    if (typeof selectorOrFunction === 'string') {
        // CSS selector filter
        const parsedSelector = parseSelector(selectorOrFunction);
        if (!parsedSelector) {
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
                // Continue to next element without adding this one
            }
        }
        const result = new this.constructor(filtered);
        result._prevObject = this;
        return result;
    }
    const result = new this.constructor([]);
    result._prevObject = this;
    return result;
}

module.exports = filter;