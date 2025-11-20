const {selectNodes} = require('../../selector');

function not(selectorOrFunction) {
    if (typeof selectorOrFunction === 'string') {
        // CSS selector filter
        const rootNodes = this._findCommonRoots();
        const allMatches = selectNodes(rootNodes, selectorOrFunction);

        const filtered = this.nodes.filter(node => !allMatches.includes(node));
        return new this.constructor(filtered);
    } else if (typeof selectorOrFunction === 'function') {
        // Function filter
        const filtered = [];
        for (let i = 0; i < this.nodes.length; i++) {
            const node = this.nodes[i];
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
        return new this.constructor(filtered);
    }
    return new this.constructor(this.nodes);
}

module.exports = not;