const {selectNodes} = require('../../selector');

function is(selectorOrElement) {
    if (typeof selectorOrElement === 'string') {
        // CSS selector
        const rootNodes = this._findCommonRoots();
        const allMatches = selectNodes(rootNodes, selectorOrElement);

        const result = this.nodes.some(node => allMatches.includes(node));
        return result;
    } else if (selectorOrElement && typeof selectorOrElement === 'object') {
        if (selectorOrElement.type === 'element') {
            // Direct element reference
            const result = this.nodes.includes(selectorOrElement);
            return result;
        } else if (selectorOrElement instanceof this.constructor) {
            // JQ object - check if any of our nodes are in the other JQ object
            const result = this.nodes.some(node => selectorOrElement.nodes.includes(node));
            return result;
        }
    }
    return false;
}

module.exports = is;