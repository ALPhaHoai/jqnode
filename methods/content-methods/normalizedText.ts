import { getTextContent, unescapeHtml } from '../../utils';
import { normalizeHTML } from '../../utils-static';
import { JqElement } from '../../dom/core/JqElement';
import type { JQ } from '../../types';

/**
 * Gets or sets the text content of elements with HTML normalization.
 * Similar to text() but applies normalizeHTML to remove tabs, newlines, carriage returns,
 * and collapse multiple spaces into single spaces.
 *
 * Note: This is not a jQuery method. This is a custom jqnode method.
 */
function normalizedText(this: JQ): string;
function normalizedText(this: JQ, value: string): JQ;
function normalizedText(this: JQ, value?: string): string | JQ {
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

        // Apply HTML normalization to the text content
        return normalizeHTML(unescapedResult);
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

export default normalizedText;
