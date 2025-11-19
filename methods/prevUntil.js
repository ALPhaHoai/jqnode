const {nodeMatchesSelector, parseSelector} = require('../selector');

function prevUntil(selector, filter) {
    this.debugLog(`JQ.prevUntil: Finding preceding siblings until selector: ${selector || 'none'}, filter: ${filter || 'none'}`);

    const precedingSiblings = [];
    const {nodeMatchesSelector, parseSelector} = require('../selector');
    let parsedStopSelector = null;
    let stopElement = null;

    if (selector) {
        if (typeof selector === 'string') {
            parsedStopSelector = parseSelector(selector);
        } else if (selector._originalElement) {
            // Handle node-query object
            stopElement = selector._originalElement;
        } else if (selector.nodeType) {
            // Handle DOM element directly
            stopElement = selector;
        } else if (selector.nodes && selector.nodes.length > 0) {
            // Handle node-query object with nodes
            stopElement = selector.nodes[0]._originalElement || selector.nodes[0];
        }
    }

    const parsedFilterSelector = filter ? parseSelector(filter) : null;

    for (const node of this.nodes) {
        // Handle DOM elements
        if (node._originalElement) {
            const element = node._originalElement;
            let sibling = element.previousElementSibling;

            while (sibling) {
                // Check if this sibling matches the stop selector or element
                let shouldStop = false;
                if (parsedStopSelector) {
                    const selectorList = parsedStopSelector.type === 'compound' ? parsedStopSelector.selectors : [parsedStopSelector];
                    // Create a temporary node object for selector matching
                    const tempNode = {
                        type: 'element',
                        tagName: sibling.tagName.toLowerCase(),
                        attributes: {},
                        _originalElement: sibling
                    };
                    // Copy attributes
                    for (let i = 0; i < sibling.attributes.length; i++) {
                        const attr = sibling.attributes[i];
                        tempNode.attributes[attr.name] = attr.value;
                    }
                    if (selectorList.some(sel => nodeMatchesSelector(tempNode, sel))) {
                        shouldStop = true;
                    }
                } else if (stopElement && sibling === stopElement) {
                    // Check if this sibling is the stop element
                    shouldStop = true;
                }

                // If we should stop, break before adding this sibling
                if (shouldStop) {
                    break;
                }

                // If filter provided, only include siblings that match the filter
                let shouldInclude = true;
                if (parsedFilterSelector) {
                    const selectorList = parsedFilterSelector.type === 'compound' ? parsedFilterSelector.selectors : [parsedFilterSelector];
                    const tempNode = {
                        type: 'element',
                        tagName: sibling.tagName.toLowerCase(),
                        attributes: {},
                        _originalElement: sibling
                    };
                    // Copy attributes
                    for (let i = 0; i < sibling.attributes.length; i++) {
                        const attr = sibling.attributes[i];
                        tempNode.attributes[attr.name] = attr.value;
                    }
                    if (!selectorList.some(sel => nodeMatchesSelector(tempNode, sel))) {
                        shouldInclude = false;
                    }
                }

                if (shouldInclude) {
                    // Convert DOM element to internal node format
                    const internalNode = {
                        type: 'element',
                        tagName: sibling.tagName.toLowerCase(),
                        attributes: {},
                        properties: {},
                        children: [],
                        parent: null,
                        _originalElement: sibling
                    };

                    // Copy attributes
                    for (let i = 0; i < sibling.attributes.length; i++) {
                        const attr = sibling.attributes[i];
                        internalNode.attributes[attr.name] = attr.value;
                    }

                    precedingSiblings.push(internalNode);
                }

                sibling = sibling.previousElementSibling;
            }
        } else if (node.parent && node.parent.children) {
            // Handle parsed HTML nodes
            const siblings = node.parent.children.filter(child => child.type === 'element');
            const currentIndex = siblings.indexOf(node);

            if (currentIndex > 0) {
            for (let i = currentIndex - 1; i >= 0; i--) {
                const sibling = siblings[i];

                // Stop if we reach a stop element
                let shouldStop = false;
                if (parsedStopSelector) {
                    const selectorList = parsedStopSelector.type === 'compound' ? parsedStopSelector.selectors : [parsedStopSelector];
                    if (selectorList.some(sel => nodeMatchesSelector(sibling, sel))) {
                        shouldStop = true;
                    }
                } else if (stopElement) {
                    // Check if this sibling matches the stop element
                    if (sibling._originalElement === stopElement || sibling === stopElement) {
                        shouldStop = true;
                    }
                }

                if (shouldStop) {
                    break;
                }

                // If filter provided, only include siblings that match the filter
                if (parsedFilterSelector) {
                    const selectorList = parsedFilterSelector.type === 'compound' ? parsedFilterSelector.selectors : [parsedFilterSelector];
                    if (!selectorList.some(sel => nodeMatchesSelector(sibling, sel))) {
                        continue;
                    }
                }

                precedingSiblings.push(sibling);
            }
            }
        }
    }

    // Remove duplicates - jQuery returns in reverse document order (farthest first)
    const uniqueSiblings = [];
    const seen = new Set();
    for (const sibling of precedingSiblings) {
        if (!seen.has(sibling)) {
            seen.add(sibling);
            uniqueSiblings.push(sibling);
        }
    }

    this.debugLog(`JQ.prevUntil: Found ${uniqueSiblings.length} unique preceding sibling elements in reverse document order (farthest first)`);
    return new this.constructor(uniqueSiblings);
}

module.exports = prevUntil;