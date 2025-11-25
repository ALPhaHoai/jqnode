import { normalizeHTML } from '../../utils-static';
import type { JQ } from '../../types';
import { getElementsText, setElementsText } from '../../helpers/text-content';

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

    // Set text content on all elements using helper
    setElementsText(this.nodes, value);

    return this;
}

export default normalizedText;
