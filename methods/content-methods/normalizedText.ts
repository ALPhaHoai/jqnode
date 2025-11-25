import { normalizeHTML } from '../../utils-static';
import { JqElement } from '../../dom/core/JqElement';
import type { JQ } from '../../types';
import { getElementsText } from '../../helpers/text-content';

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
        const text = getElementsText(this.nodes);
        // Apply HTML normalization to the text content
        return normalizeHTML(text);
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
