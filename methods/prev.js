const {nodeMatchesSelector, parseSelector} = require('../selector');

function prev(selector) {
    this.debugLog(`JQ.prev: Finding previous sibling for ${this.nodes.length} elements, selector: ${selector || 'none'}`);

    const prevSiblings = [];

    for (const node of this.nodes) {
        if (node.parent && node.parent.children) {
            const allChildren = node.parent.children;
            const currentIndex = allChildren.indexOf(node);

            if (currentIndex > 0) {
                if (selector) {
                    // If selector provided, find the first previous sibling that matches the selector
                    const parsedSelector = parseSelector(selector);
                    for (let i = currentIndex - 1; i >= 0; i--) {
                        const sibling = allChildren[i];
                        if (sibling.type === 'element' && nodeMatchesSelector(sibling, parsedSelector)) {
                            prevSiblings.push(sibling);
                            break; // Only take the first matching element
                        }
                    }
                } else {
                    // No selector, just get the immediately previous element sibling
                    for (let i = currentIndex - 1; i >= 0; i--) {
                        const sibling = allChildren[i];
                        if (sibling.type === 'element') {
                            prevSiblings.push(sibling);
                            break; // Only take the first (closest) element sibling
                        }
                    }
                }
            }
        }
    }

    this.debugLog(`JQ.prev: Found ${prevSiblings.length} previous sibling elements`);
    return new this.constructor(prevSiblings);
}

module.exports = prev;