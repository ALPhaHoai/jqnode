import type { JQ, GetterSetterReturn } from '../../types';
import { getElementsText, setElementsText } from '../../helpers/text-content';

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

    // Set text content on all elements using helper
    setElementsText(this.nodes, value);

    return this;
}

export default text;
