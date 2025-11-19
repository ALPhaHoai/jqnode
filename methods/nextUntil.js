const {nodeMatchesSelector, parseSelector} = require('../selector');

function nextUntil(selector, filter) {
    this.debugLog(`JQ.nextUntil: Finding following siblings until selector: ${selector || 'none'}, filter: ${filter || 'none'}`);

    const followingSiblings = [];
    const {nodeMatchesSelector, parseSelector} = require('../selector');
    const parsedStopSelector = selector && typeof selector === 'string' ? parseSelector(selector) : null;
    const parsedFilterSelector = filter ? parseSelector(filter) : null;

    for (const node of this.nodes) {
        if (node.parent && node.parent.children) {
            const allSiblings = node.parent.children;
            const currentIndex = allSiblings.indexOf(node);

            if (currentIndex !== -1) {
                for (let i = currentIndex + 1; i < allSiblings.length; i++) {
                    const sibling = allSiblings[i];

                    // Skip non-element siblings for stop condition checks and addition
                    // But we still need to check stop conditions against all siblings
                    const isElementSibling = sibling.type === 'element';

                    // Stop if we reach a stop element (check all siblings for stop condition)
                    if (parsedStopSelector) {
                        const selectorList = parsedStopSelector.type === 'compound' ? parsedStopSelector.selectors : [parsedStopSelector];
                        if (selectorList.some(sel => nodeMatchesSelector(sibling, sel))) {
                            break;
                        }
                    }
                    if (selector && typeof selector === 'object' && selector.type === 'element' && sibling === selector) {
                        break;
                    }
                    if (selector && selector.nodes && Array.isArray(selector.nodes) && selector.nodes.includes(sibling)) {
                        break;
                    }

                    // Only consider element siblings for inclusion
                    if (!isElementSibling) {
                        continue;
                    }

                    // If filter provided, only include siblings that match the filter
                    if (parsedFilterSelector) {
                        const selectorList = parsedFilterSelector.type === 'compound' ? parsedFilterSelector.selectors : [parsedFilterSelector];
                        if (!selectorList.some(sel => nodeMatchesSelector(sibling, sel))) {
                            continue;
                        }
                    }

                    followingSiblings.push(sibling);
                }
            }
        } else {
            // Handle root nodes - check root nodes array
            const rootNodes = require('../jq').allRootNodes;
            const currentIndex = rootNodes.indexOf(node);

            if (currentIndex !== -1) {
                for (let i = currentIndex + 1; i < rootNodes.length; i++) {
                    const sibling = rootNodes[i];

                    // Skip non-element siblings for stop condition checks and addition
                    const isElementSibling = sibling.type === 'element';

                    // Stop if we reach a stop element (check all siblings for stop condition)
                    if (parsedStopSelector) {
                        const selectorList = parsedStopSelector.type === 'compound' ? parsedStopSelector.selectors : [parsedStopSelector];
                        if (selectorList.some(sel => nodeMatchesSelector(sibling, sel))) {
                            break;
                        }
                    }
                    if (selector && typeof selector === 'object' && selector.type === 'element' && sibling === selector) {
                        break;
                    }
                    if (selector && selector.nodes && Array.isArray(selector.nodes) && selector.nodes.includes(sibling)) {
                        break;
                    }

                    // Only consider element siblings for inclusion
                    if (!isElementSibling) {
                        continue;
                    }

                    // If filter provided, only include siblings that match the filter
                    if (parsedFilterSelector) {
                        const selectorList = parsedFilterSelector.type === 'compound' ? parsedFilterSelector.selectors : [parsedFilterSelector];
                        if (!selectorList.some(sel => nodeMatchesSelector(sibling, sel))) {
                            continue;
                        }
                    }

                    followingSiblings.push(sibling);
                }
            }
        }
    }

    this.debugLog(`JQ.nextUntil: Found ${followingSiblings.length} following sibling elements`);
    return new this.constructor(followingSiblings);
}

module.exports = nextUntil;