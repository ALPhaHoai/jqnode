function contents() {
    this.debugLog(`JQ.contents: Finding all child nodes for ${this.nodes.length} elements`);

    const contents = [];
    const seen = new Set(); // Avoid duplicates

    // Helper function to convert DOM node to internal format
    function convertDomNode(domNode) {
        if (domNode.nodeType === 1) { // ELEMENT_NODE
            // Convert DOM element to internal node format
            const node = {
                type: 'element',
                tagName: domNode.tagName.toLowerCase(),
                attributes: {},
                properties: {},
                children: [],
                parent: null,
                _originalElement: domNode
            };

            // Copy attributes
            if (domNode.attributes) {
                for (let i = 0; i < domNode.attributes.length; i++) {
                    const attr = domNode.attributes[i];
                    node.attributes[attr.name] = attr.value;
                }
            }

            // Copy properties for form elements
            if (domNode.nodeType === 1) {
                const propNames = ['value', 'checked', 'selected', 'type', 'name', 'disabled', 'readonly'];
                for (const prop of propNames) {
                    if (domNode[prop] !== undefined) {
                        node.properties[prop] = domNode[prop];
                    }
                }
            }

            return node;
        } else if (domNode.nodeType === 3) { // TEXT_NODE
            return {
                type: 'text',
                value: domNode.textContent,
                _originalElement: domNode
            };
        } else if (domNode.nodeType === 8) { // COMMENT_NODE
            return {
                type: 'comment',
                value: domNode.textContent,
                _originalElement: domNode
            };
        }
        // For other node types, return null to skip
        return null;
    }

    for (const node of this.nodes) {
        // If this is a DOM element, use childNodes to get all child nodes including text and comments
        if (node._originalElement) {
            const childNodes = node._originalElement.childNodes;
            for (let i = 0; i < childNodes.length; i++) {
                const child = childNodes[i];
                const convertedNode = convertDomNode(child);
                if (convertedNode && !seen.has(convertedNode)) {
                    seen.add(convertedNode);
                    contents.push(convertedNode);
                }
            }
        } else if (node.children) {
            // For parsed HTML nodes, use the children array
            for (const child of node.children) {
                if (!seen.has(child)) {
                    seen.add(child);
                    contents.push(child);
                }
            }
        }
    }

    this.debugLog(`JQ.contents: Found ${contents.length} child nodes`);
    return new this.constructor(contents);
}

module.exports = contents;