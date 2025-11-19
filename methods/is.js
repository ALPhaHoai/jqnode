const {selectNodes} = require('../selector');

function is(selectorOrElement) {
    this.debugLog(`JQ.is: Checking if any of ${this.nodes.length} elements match ${typeof selectorOrElement}`);

    if (typeof selectorOrElement === 'string') {
        // CSS selector
        const rootNodes = this._findCommonRoots();
        const allMatches = selectNodes(rootNodes, selectorOrElement);

        const result = this.nodes.some(node => allMatches.includes(node));
        this.debugLog(`JQ.is: Selector match result: ${result}`);
        return result;
    } else if (selectorOrElement && typeof selectorOrElement === 'object') {
        if (selectorOrElement.type === 'element') {
            // Direct element reference
            const result = this.nodes.includes(selectorOrElement);
            this.debugLog(`JQ.is: Element match result: ${result}`);
            return result;
        } else if (selectorOrElement instanceof this.constructor) {
            // JQ object - check if any of our nodes are in the other JQ object
            const result = this.nodes.some(node => selectorOrElement.nodes.includes(node));
            this.debugLog(`JQ.is: JQ object match result: ${result}`);
            return result;
        }
    }

    this.debugLog(`JQ.is: Invalid argument, returning false`);
    return false;
}

module.exports = is;