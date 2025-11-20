const {nodeMatchesSelector, parseSelector} = require('../../../selector');

function prevAll(selector) {
    const allPrecedingSiblings = [];

    // Parse selector if provided
    let parsedSelector = null;
    if (selector) {
        parsedSelector = parseSelector(selector);
    }

    for (const node of this.nodes) {
        // Handle DOM elements
        if (node._originalElement) {
            const element = node._originalElement;
            let sibling = element.previousElementSibling;

            while (sibling) {
                // If selector provided, only include siblings that match the selector
                let shouldInclude = true;
                if (parsedSelector) {
                    const selectorList = parsedSelector.type === 'compound' ? parsedSelector.selectors : [parsedSelector];
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

                    allPrecedingSiblings.push(internalNode);
                }

                sibling = sibling.previousElementSibling;
            }
        } else if (node.parent && node.parent.children) {
            // Handle parsed HTML nodes
            const siblings = node.parent.children;
            const nodeIndex = siblings.indexOf(node);

            for (let i = 0; i < nodeIndex; i++) {
                const sibling = siblings[i];
                if (sibling.type === 'element') { // Only consider element nodes
                    let shouldInclude = true;
                    if (parsedSelector) {
                        if (!nodeMatchesSelector(sibling, parsedSelector)) {
                            shouldInclude = false;
                        }
                    }
                    if (shouldInclude) {
                        allPrecedingSiblings.push(sibling);
                    }
                }
            }
        }
    }

    // Remove duplicates while preserving order (farthest to closest, matching jQuery)
    const uniqueSiblings = [];
    const seen = new Set();
    for (const sibling of allPrecedingSiblings) {
        if (!seen.has(sibling)) {
            seen.add(sibling);
            uniqueSiblings.push(sibling);
        }
    }
    return new this.constructor(uniqueSiblings);
}

module.exports = prevAll;