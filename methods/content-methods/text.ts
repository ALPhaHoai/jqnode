import { getTextContent, unescapeHtml } from '../../utils';
import type { HtmlNode, JQ, GetterSetterReturn } from '../../types';

/**
 * Gets or sets the text content of elements.
 * @see https://api.jquery.com/text/
 */
function text(this: JQ, value?: string): GetterSetterReturn<string> {
    if (value === undefined) {
        // Get text content from element nodes only
        const elementNodes = this.nodes.filter((node: HtmlNode) =>
            node.type === 'element' || node.nodeType === 1
        );

        // Check if any element is detached (from fractional eq() indices)
        if (elementNodes.some((node: HtmlNode) => node._detached)) {
            return '';
        }

        if (elementNodes.length === 0) {
            return '';
        }

        const result = elementNodes.map((node: HtmlNode) => {
            // Use HTML5 textContent property as single source of truth
            if ('textContent' in node) {
                return node.textContent || '';
            }
            // Fallback to internal node traversal for parsed nodes
            return getTextContent(node);
        }).join('');

        const unescapedResult = unescapeHtml(result);
        return unescapedResult;
    }

    // Set text content on all elements
    this.nodes.forEach((node: HtmlNode) => {
        // Use HTML5 textContent property as single source of truth
        if ('textContent' in node) {
            node.textContent = value;
        } else {
            // Fallback for internal nodes - replace children with text node
            node.children = [{ type: 'text', data: value }];
        }
    });

    return this;
}

export = text;
