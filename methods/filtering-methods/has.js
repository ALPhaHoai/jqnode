const {selectNodes} = require('../../selector');

function has(selectorOrElement) {
    this.debugLog(`JQ.has: Finding elements with descendants matching ${typeof selectorOrElement}`);

    const matchingElements = [];

    if (typeof selectorOrElement === 'string') {
        for (const element of this.nodes) {
            if (element.type === 'element' && element.children) {
                // Search only among element children, not including the element itself
                const elementChildren = element.children.filter(child => child.type === 'element');
                try {
                    const descendants = selectNodes(elementChildren, selectorOrElement);
                    if (descendants.length > 0) {
                        matchingElements.push(element);
                    }
                } catch (error) {
                    // Re-throw syntax errors to match jQuery behavior
                    if (error instanceof SyntaxError) {
                        throw error;
                    }
                    // For other errors, skip this element
                }
            }
        }
    } else if (selectorOrElement && typeof selectorOrElement === 'object' && selectorOrElement.type === 'element') {
        // Direct element reference
        for (const element of this.nodes) {
            if (element.type === 'element' && element.children) {
                const hasDescendant = this._hasDescendant(element, selectorOrElement);
                if (hasDescendant) {
                    matchingElements.push(element);
                }
            }
        }
    }

    this.debugLog(`JQ.has: Found ${matchingElements.length} elements with matching descendants`);
    return new this.constructor(matchingElements);
}

module.exports = has;