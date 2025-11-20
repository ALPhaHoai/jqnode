const {nodeMatchesSelector, parseSelector} = require('../../../selector');

function nextAll(selector) {
    const followingSiblings = [];
    const seen = new Set(); // Avoid duplicates

    // First pass: collect all unique following siblings
    for (const node of this.nodes) {
        if (node.parent && node.parent.children) {
            const siblings = node.parent.children.filter(child => child.type === 'element');
            const currentIndex = siblings.indexOf(node);

            if (currentIndex !== -1) {
                for (let i = currentIndex + 1; i < siblings.length; i++) {
                    const sibling = siblings[i];
                    if (!seen.has(sibling)) {
                        seen.add(sibling);
                        followingSiblings.push(sibling);
                    }
                }
            }
        }
    }

    let resultNodes = followingSiblings;

    // If selector provided, filter following siblings that match the selector
    if (selector) {
        const {nodeMatchesSelector, parseSelector} = require('../../../selector');
        const parsedSelector = parseSelector(selector);

        // Filter siblings to only include those that match the selector
        resultNodes = followingSiblings.filter(sibling => {
            // Use nodeMatchesSelector to check if this sibling matches the selector
            // Handle compound selectors (comma-separated)
            const selectorList = parsedSelector.type === 'compound' ? parsedSelector.selectors : [parsedSelector];
            return selectorList.some(sel => nodeMatchesSelector(sibling, sel));
        });
    }
    return new this.constructor(resultNodes);
}

module.exports = nextAll;