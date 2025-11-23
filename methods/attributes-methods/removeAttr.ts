import type { HtmlNode, JQ } from '../../types';

/**
 * Removes an attribute from each element in the set of matched elements.
 * @see https://api.jquery.com/removeAttr/
 */
function removeAttr(this: JQ, name: string): JQ {
    // Split space-separated attribute names (jQuery compatibility)
    const attrNames = name.split(/\s+/).filter(n => n.length > 0);
    const booleanAttributes = ['checked', 'selected', 'disabled', 'readonly', 'required', 'multiple', 'autofocus', 'autoplay', 'hidden', 'controls', 'loop', 'muted', 'default', 'open', 'reversed', 'scoped', 'async', 'defer'];

    this.nodes.forEach((element: HtmlNode) => {
        if (element) {
            attrNames.forEach(attrName => {
                // Remove from internal attributes
                if (element.attributes) {
                    delete element.attributes[attrName];
                }

                // Remove from DOM element
                if (element._originalElement) {
                    element._originalElement.removeAttribute(attrName);
                }

                // For boolean attributes, also set the property to false
                if (booleanAttributes.includes(attrName)) {
                    if (!element.properties) {
                        element.properties = {};
                    }
                    element.properties[attrName] = false;

                    if (element._originalElement) {
                        (element._originalElement as any)[attrName] = false;
                    }
                }
            });
        }
    });
    return this;
}

export = removeAttr;
