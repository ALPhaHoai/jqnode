const {parseSelector, nodeMatchesSelector} = require('../../../selector');

function parents(selector) {
    const ancestors = [];
    const seen = new Set(); // Avoid duplicates

    // Parse selector if provided
    let parsedSelector = null;
    if (selector) {
        parsedSelector = parseSelector(selector);
        if (!parsedSelector) {
            return new this.constructor([]);
        }
    }

    for (const node of this.nodes) {
        // If we have a DOM element, traverse the actual DOM tree
        if (node._originalElement) {
            let domCurrent = node._originalElement.parentElement;
            while (domCurrent && domCurrent.nodeType === 1) {
                // Create a unique key to avoid duplicates
                const attributes = {};
                for (let i = 0; i < domCurrent.attributes.length; i++) {
                    const attr = domCurrent.attributes[i];
                    attributes[attr.name] = attr.value;
                }
                const key = `${domCurrent.tagName.toLowerCase()}-${JSON.stringify(attributes)}`;

                if (!seen.has(key)) {
                    seen.add(key);

                    // Convert DOM element to node format
                    const domNode = {
                        type: 'element',
                        tagName: domCurrent.tagName.toLowerCase(),
                        attributes: attributes,
                        properties: {},
                        children: [],
                        parent: null,
                        _originalElement: domCurrent
                    };

                    // If selector provided, check if this ancestor matches
                    if (!parsedSelector || nodeMatchesSelector(domNode, parsedSelector)) {
                        ancestors.push(domNode);
                    }
                }
                domCurrent = domCurrent.parentElement;
            }
        } else {
            // Otherwise, traverse the internal node tree
            let current = node.parent;
            while (current) {
                if (current.type === 'element') {
                    // Create a unique key to avoid duplicates
                    const key = `${current.tagName}-${JSON.stringify(current.attributes)}`;

                    if (!seen.has(key)) {
                        seen.add(key);

                        // If selector provided, check if this ancestor matches
                        if (!parsedSelector || nodeMatchesSelector(current, parsedSelector)) {
                            ancestors.push(current);
                        }
                    }
                }
                current = current.parent;
            }
        }
    }
    return new this.constructor(ancestors);
}

module.exports = parents;