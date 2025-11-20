const {selectNodes} = require('../../../selector');

function parentsUntil(selector, filter) {
    const ancestors = [];
    const seen = new Set(); // Avoid duplicates
    const stopElements = new Set();

    // Find stop elements if selector provided
    if (selector) {
        if (typeof selector === 'string') {
            const rootNodes = this._findCommonRoots();
            const stopNodes = selectNodes(rootNodes, selector);
            stopNodes.forEach(node => stopElements.add(node));
        } else if (selector && typeof selector === 'object' && selector.type === 'element') {
            // Direct node reference
            stopElements.add(selector);
        } else if (selector && selector.nodes && Array.isArray(selector.nodes)) {
            // JQ object
            selector.nodes.forEach(node => stopElements.add(node));
        }
    }

    for (const node of this.nodes) {
        // Check DOM parents if available (more reliable for traversal)
        if (node._originalElement) {
            let domCurrent = node._originalElement.parentElement;
            while (domCurrent && domCurrent.nodeType === 1) {
                // Stop if we reach a stop element (check by matching attributes)
                const shouldStop = Array.from(stopElements).some(stopNode => {
                    if (stopNode._originalElement === domCurrent) return true;
                    if (stopNode.tagName === domCurrent.tagName.toLowerCase()) {
                        // Check if attributes match
                        const stopAttrs = stopNode.attributes || {};
                        const domAttrs = {};
                        for (let i = 0; i < domCurrent.attributes.length; i++) {
                            const attr = domCurrent.attributes[i];
                            domAttrs[attr.name] = attr.value;
                        }
                        return Object.keys(stopAttrs).every(key => domAttrs[key] === stopAttrs[key]);
                    }
                    return false;
                });

                if (shouldStop) {
                    break;
                }

                // Create a unique key for DOM elements
                const attributes = {};
                for (let i = 0; i < domCurrent.attributes.length; i++) {
                    const attr = domCurrent.attributes[i];
                    attributes[attr.name] = attr.value;
                }
                const key = `dom-${domCurrent.tagName.toLowerCase()}-${JSON.stringify(attributes)}`;

                if (!seen.has(key)) {
                    seen.add(key);
                    // Convert DOM element to node format
                    const domNode = {
                        type: 'element',
                        tagName: domCurrent.tagName.toUpperCase(),
                        attributes: attributes,
                        properties: {},
                        children: [],
                        parent: null,
                        _originalElement: domCurrent
                    };
                    ancestors.push(domNode);
                }
                domCurrent = domCurrent.parentElement;
            }
        } else {
            // Fallback to internal node traversal
            let current = node.parent;
            while (current) {
                // Stop if we reach a stop element
                if (stopElements.has(current)) {
                    break;
                }

                const key = `internal-${current.tagName}-${JSON.stringify(current.attributes)}`;
                if (!seen.has(key)) {
                    seen.add(key);
                    ancestors.push(current);
                }
                current = current.parent;
            }
        }
    }

    let resultNodes = ancestors;

    // If filter provided, filter ancestors that match the filter selector
    if (filter) {
        const rootNodes = this._findCommonRoots();
        const matchingAncestors = selectNodes(rootNodes, filter);

        // Filter our ancestors to only include those that match the filter
        resultNodes = ancestors.filter(ancestor => matchingAncestors.includes(ancestor));
    }
    return new this.constructor(resultNodes);
}

module.exports = parentsUntil;