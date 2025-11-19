const {nodeMatchesSelector, parseSelector} = require('../selector');

function next(selector) {
    this.debugLog(`JQ.next: Finding next sibling for ${this.nodes.length} elements, selector: ${selector || 'none'}`);

    const nextSiblings = [];

    for (const node of this.nodes) {
        if (node.parent && node.parent.children) {
            // Node has a parent - use normal sibling logic
            const siblings = node.parent.children.filter(child => child.type === 'element');
            const currentIndex = siblings.indexOf(node);

            if (currentIndex !== -1) {
                if (selector) {
                    // If selector provided, find the next sibling that matches the selector
                    const {nodeMatchesSelector, parseSelector} = require('../selector');
                    const parsedSelector = parseSelector(selector);

                    // Find the first sibling after currentIndex that matches the selector
                    for (let i = currentIndex + 1; i < siblings.length; i++) {
                        const sibling = siblings[i];
                        // Handle compound selectors (comma-separated)
                        const selectorList = parsedSelector.type === 'compound' ? parsedSelector.selectors : [parsedSelector];
                        if (selectorList.some(sel => nodeMatchesSelector(sibling, sel))) {
                            nextSiblings.push(sibling);
                            break; // Only take the first matching one
                        }
                    }
                } else {
                    // No selector, just get the immediate next element sibling
                    if (currentIndex < siblings.length - 1) {
                        nextSiblings.push(siblings[currentIndex + 1]);
                    }
                }
            }
        } else {
            // Node is a root node - check root nodes array
            const rootNodes = require('../jq').allRootNodes;
            const currentIndex = rootNodes.indexOf(node);

            if (currentIndex !== -1) {
                if (selector) {
                    // If selector provided, find the next root sibling that matches the selector
                    const {nodeMatchesSelector, parseSelector} = require('../selector');
                    const parsedSelector = parseSelector(selector);

                    // Find the first root node after currentIndex that matches the selector
                    for (let i = currentIndex + 1; i < rootNodes.length; i++) {
                        const sibling = rootNodes[i];
                        if (sibling.type === 'element') {
                            // Handle compound selectors (comma-separated)
                            const selectorList = parsedSelector.type === 'compound' ? parsedSelector.selectors : [parsedSelector];
                            if (selectorList.some(sel => nodeMatchesSelector(sibling, sel))) {
                                nextSiblings.push(sibling);
                                break; // Only take the first matching one
                            }
                        }
                    }
                } else {
                    // No selector, just get the immediate next root element sibling
                    for (let i = currentIndex + 1; i < rootNodes.length; i++) {
                        const sibling = rootNodes[i];
                        if (sibling.type === 'element') {
                            nextSiblings.push(sibling);
                            break; // Only take the first one
                        }
                    }
                }
            }
        }
    }

    this.debugLog(`JQ.next: Found ${nextSiblings.length} next sibling elements`);
    return new this.constructor(nextSiblings);
}

module.exports = next;