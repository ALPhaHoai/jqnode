const {nodeMatchesSelector, parseSelector} = require('../../../selector');

function siblings(selector) {
    this.debugLog(`JQ.siblings: Finding siblings for ${this.nodes.length} elements, selector: ${selector || 'none'}`);

    const allSiblings = [];
    const seen = new Set(); // Use a Set for deduplication

    // Parse selector if provided
    let parsedSelector = null;
    if (selector) {
        parsedSelector = parseSelector(selector);
    }

    for (const node of this.nodes) {
        if (node.parent && node.parent.children) {
            // Use internal node traversal
            node.parent.children.forEach(sibling => {
                // Exclude the node itself and text nodes
                if (sibling !== node && sibling.type === 'element' && !seen.has(sibling)) {
                    seen.add(sibling);

                    let shouldInclude = true;
                    if (parsedSelector) {
                        if (!nodeMatchesSelector(sibling, parsedSelector)) {
                            shouldInclude = false;
                        }
                    }

                    if (shouldInclude) {
                        allSiblings.push(sibling);
                    }
                }
            });
        }
    }

    this.debugLog(`JQ.siblings: Found ${allSiblings.length} siblings`);
    return new this.constructor(allSiblings);
}

module.exports = siblings;