import type { JQ } from '../../../types';
import { HtmlNode } from '../../../types';
import JQClass from '../../../jq';

/**
 * Gets the children of each element in the set, including text and comment nodes.
 * @see https://api.jquery.com/contents/
 */
function contents(this: JQ): JQ {
    const contents: HtmlNode[] = [];
    const seen = new Set<HtmlNode>();

    // Helper function to convert DOM node to internal format
    function convertDomNode(domNode: HtmlNode | ChildNode): HtmlNode | null {
        if (domNode.nodeType === 1) {
            // Element node - need to check if it's a DOM Element or HtmlNode
            const tagName =
                'tagName' in domNode
                    ? typeof domNode.tagName === 'string'
                        ? domNode.tagName.toLowerCase()
                        : String(domNode.tagName).toLowerCase()
                    : '';

            // Create attributes object
            const attributes: Record<string, string> = {};

            // Handle attributes - check if it's a NamedNodeMap (DOM) or plain object (HtmlNode)
            if ('attributes' in domNode && domNode.attributes) {
                // Type guard: check if it's a NamedNodeMap by checking for length property
                if (
                    'length' in domNode.attributes &&
                    typeof domNode.attributes.length === 'number'
                ) {
                    // DOM NamedNodeMap
                    const attrs = domNode.attributes as unknown as NamedNodeMap;
                    for (let i = 0; i < attrs.length; i++) {
                        const attr = attrs[i];
                        if (attr) {
                            attributes[attr.name] = attr.value;
                        }
                    }
                } else {
                    // HtmlNode attribs object
                    const attrs = domNode.attributes as Record<string, unknown>;
                    Object.assign(attributes, attrs);
                }
            }

            const node = new HtmlNode('element', tagName);
            node.tagName = tagName;
            node.attributes._setData(attributes);
            node._originalElement = ('nodeType' in domNode && domNode.nodeType === 1
                ? (domNode as Element)
                : undefined);

            // Copy properties from DOM element
            if ('nodeType' in domNode && domNode.nodeType === 1) {
                const propNames = [
                    'value',
                    'checked',
                    'selected',
                    'type',
                    'name',
                    'disabled',
                    'readonly',
                ] as const;
                for (const prop of propNames) {
                    // Use type assertion with unknown intermediate
                    const value = (domNode as unknown as Record<string, unknown>)[prop];
                    if (value !== undefined && node.properties) {
                        node.properties[prop] = value;
                    }
                }
            }

            return node;
        } else if (domNode.nodeType === 3) {
            // Text node
            const textContent =
                'textContent' in domNode
                    ? domNode.textContent
                    : 'data' in domNode
                        ? (domNode as HtmlNode).textData
                        : null;
            const textNode = new HtmlNode('text');
            textNode.textData = textContent || '';
            textNode._originalElement = 'nodeType' in domNode ? (domNode as Element) : null;
            return textNode;
        } else if (domNode.nodeType === 8) {
            // Comment node
            const textContent =
                'textContent' in domNode
                    ? domNode.textContent
                    : 'data' in domNode
                        ? (domNode as HtmlNode).textData
                        : null;
            const commentNode = new HtmlNode('comment');
            commentNode.textData = textContent || '';
            commentNode._originalElement = 'nodeType' in domNode ? (domNode as Element) : null;
            return commentNode;
        }
        return null;
    }

    for (const node of this.nodes) {
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
            for (const child of node.children) {
                if (!seen.has(child)) {
                    seen.add(child);
                    contents.push(child);
                }
            }
        }
    }
    return new JQClass(contents);
}

export = contents;
