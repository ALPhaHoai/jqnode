import type { HtmlNode, JQ } from '../../types';

/**
 * Removes an attribute from each element in the set of matched elements.
 * @see https://api.jquery.com/removeAttr/
 */
function removeAttr(this: JQ, name: string): JQ {
    // Split space-separated attribute names (jQuery compatibility)
    const attrNames = name.split(/\s+/).filter(n => n.length > 0);

    this.nodes.forEach((element: HtmlNode) => {
        if (element && element.attributes) {
            attrNames.forEach(attrName => {
                delete element.attributes?.[attrName];
                if (element._originalElement) {
                    element._originalElement.removeAttribute(attrName);
                }
            });
        }
    });
    return this;
}

export = removeAttr;

