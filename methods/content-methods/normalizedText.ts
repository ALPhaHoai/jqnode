import { getTextContent, unescapeHtml } from '../../utils';
import { normalizeHTML } from '../../utils-static';
import type { HtmlNode, JQ } from '../../types';

/**
 * Gets or sets the text content of elements with HTML normalization.
 * Similar to text() but applies normalizeHTML to remove tabs, newlines, carriage returns,
 * and collapse multiple spaces into single spaces.
 */
function normalizedText(this: JQ, value?: string): string | JQ {
    if (value === undefined) {
        // Get text content from element nodes only
        const elementNodes = this.nodes.filter((node: HtmlNode) =>
            node.type === 'element' || node.nodeType === 1
        );

        // Check if any element is detached (from fractional eq() indices)
        if (elementNodes.some((node: HtmlNode) => ('_detached' in node && node._detached))) {
            return '';
        }

        if (elementNodes.length === 0) {
            return '';
        }

        const result = elementNodes.map((node: HtmlNode) => {
            // Handle DOM elements
            if (node.nodeType === 1) {
                return node.textContent || '';
            }
            // Handle internal nodes
            return getTextContent(node);
        }).join('');

        const unescapedResult = unescapeHtml(result);

        // Apply HTML normalization to the text content
        return normalizeHTML(unescapedResult);
    }

    // Set text content on all elements
    this.nodes.forEach((node: HtmlNode) => {
        // Handle DOM elements
        if (node.nodeType === 1) {
            node.textContent = value;
        } else {
            // Handle internal nodes
            node.children = [{ type: 'text', data: value }];
        }
    });

    return this;
}

export = normalizedText;
