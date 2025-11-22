import { getTextContent, unescapeHtml } from '../../utils';
import type { HtmlNode, JQ } from '../../types';

/**
 * Gets or sets the text content of elements.
 */
function text(this: JQ, value?: string): string | JQ {
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
            // Handle DOM elements
            if (node.nodeType === 1) {
                return ('textContent' in node ? node.textContent : null) || '';
            }
            // Handle internal nodes
            return getTextContent(node);
        }).join('');

        const unescapedResult = unescapeHtml(result);
        return unescapedResult;
    }

    // Set text content on all elements
    this.nodes.forEach((node: HtmlNode) => {
        // Handle DOM elements
        if (node.nodeType === 1) {
            if ('textContent' in node) {
                node.textContent = value;
            }
        } else {
            // Handle internal nodes
            node.children = [{ type: 'text', data: value }];
        }
    });

    return this;
}

export = text;
