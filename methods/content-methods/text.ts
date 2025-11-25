import { getTextContent, unescapeHtml } from '../../utils';
import { JqElement } from '../../dom/core/JqElement';
import type { JQ, GetterSetterReturn } from '../../types';

/**
 * Gets or sets the text content of elements.
 * @see https://api.jquery.com/text/
 */
function text(this: JQ, value?: string): GetterSetterReturn<string> {
    if (value === undefined) {
        // Get text content from element nodes only
        const elementNodes = this.nodes.filter(
            (node: JqElement) => node.internalType === 'element' || node.nodeType === 1,
        );

        // Check if any element is detached (from fractional eq() indices)
        if (elementNodes.some((node: JqElement) => node._detached)) {
            return '';
        }

        if (elementNodes.length === 0) {
            return '';
        }

        const result = elementNodes
            .map((node: JqElement) => {
                // Use HTML5 textContent property as single source of truth
                if ('textContent' in node) {
                    return node.textContent || '';
                }
                // Fallback to internal node traversal for parsed nodes
                return getTextContent(node);
            })
            .join('');

        const unescapedResult = unescapeHtml(result);
        return unescapedResult;
    }

    // Set text content on all elements
    this.nodes.forEach((node: JqElement) => {
        // Use HTML5 textContent property as single source of truth
        if ('textContent' in node) {
            node.textContent = value;
        } else if ('children' in node && Array.isArray((node as JqElement).children)) {
            // Fallback for internal nodes - replace children with text node
            const textNode = new JqElement('text');
            textNode.textData = value || '';
            (node as JqElement).children = [textNode];
        }
    });

    return this;
}

export = text;
