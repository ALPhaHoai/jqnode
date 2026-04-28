import type { JqElement, JQ } from '../../types';
import { isBooleanAttribute } from '../../helpers/html-constants';

/**
 * Removes an attribute from each element in the set of matched elements.
 * @see https://api.jquery.com/removeAttr/
 */
function removeAttr(this: JQ, name: string): JQ {
    // Split space-separated attribute names (jQuery compatibility)
    const attrNames = name.split(/\s+/).filter((n) => n.length > 0);

    this.nodes.forEach((element: JqElement) => {
        if (element) {
            attrNames.forEach((attrName) => {
                // Remove from internal attributes
                if (element.attributes) {
                    try {
                        element.attributes.removeNamedItem(attrName);
                    } catch (e) {
                        // Attribute may not exist
                    }
                }

                // Remove from DOM element
                if (element._originalElement) {
                    element._originalElement.removeAttribute(attrName);
                }

                // For boolean attributes, also set the property to false
                if (isBooleanAttribute(attrName)) {
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

export default removeAttr;
