import { JqElement } from '../../dom/core/JqElement';
import type { JQ, GetterSetterReturn } from '../../types';
import { getElementsText } from '../../helpers/text-content';

/**
 * Gets or sets the text content of elements.
 * @see https://api.jquery.com/text/
 */
// Getter overload
function text(this: JQ): GetterSetterReturn<string>;
// Setter overload
function text(this: JQ, content: string): JQ;
// Implementation
function text(this: JQ, value?: string): GetterSetterReturn<string> {
    if (value === undefined) {
        return getElementsText(this.nodes);
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

export default text;
