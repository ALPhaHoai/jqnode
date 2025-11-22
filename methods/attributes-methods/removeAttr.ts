import type { HtmlNode, JQ } from '../../types';

/**
 * Removes an attribute from each element in the set of matched elements.
 */
function removeAttr(this: JQ, name: string): JQ {
    this.nodes.forEach((element: HtmlNode) => {
        if (element && element.attribs) {
            delete element.attribs[name];
            if (element._originalElement) {
                element._originalElement.removeAttribute(name);
            }
        }
    });
    return this;
}

export = removeAttr;

