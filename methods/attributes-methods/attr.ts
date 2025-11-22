import type { HtmlNode, JQ, AttributeValue, GetterSetterReturn } from '../../types';

/**
 * Gets or sets an attribute on the first element in the collection.
 */
function attr(this: JQ, name: string, value?: AttributeValue): GetterSetterReturn<string> {
    const booleanAttributes = ['checked', 'selected', 'disabled', 'readonly', 'required', 'multiple'];

    if (value === undefined) {
        const element = this.nodes[0];

        if (!element) {
            return undefined;
        }

        if (element._originalElement) {
            const attrValue = element._originalElement.getAttribute(name);
            if (attrValue === null) return undefined;

            if (booleanAttributes.includes(name)) {
                return name;
            }

            return attrValue;
        }

        if (element.nodeType === 1 && element.getAttribute) {
            const attrValue = element.getAttribute(name);
            if (attrValue === null) return undefined;

            if (booleanAttributes.includes(name)) {
                return name;
            }

            return attrValue;
        }

        const attrValue = element.attribs ? element.attribs[name] : undefined;

        if (booleanAttributes.includes(name)) {
            return attrValue;
        }

        return attrValue;
    }

    this.nodes.forEach((element: HtmlNode) => {
        if (!element) return;

        if (element.nodeType === 1 && element.setAttribute && element.removeAttribute) {
            if (booleanAttributes.includes(name)) {
                if (value === true) {
                    element.setAttribute(name, name);
                } else if (value === false || value === null || value === undefined) {
                    element.removeAttribute(name);
                } else {
                    element.setAttribute(name, String(value));
                }
            } else {
                if (value === null || value === undefined) {
                    element.removeAttribute(name);
                } else {
                    element.setAttribute(name, String(value));
                }
            }
            return;
        }

        if (element.attribs) {
            if (booleanAttributes.includes(name)) {
                element.attribs[name] = value === true ? name : String(value || '');
                if (element._originalElement) {
                    if (value === true) {
                        element._originalElement.setAttribute(name, name);
                    } else if (value === false || value === null || value === undefined) {
                        element._originalElement.removeAttribute(name);
                    } else {
                        element._originalElement.setAttribute(name, String(value));
                    }
                }
            } else {
                element.attribs[name] = String(value || '');
                if (element._originalElement) {
                    element._originalElement.setAttribute(name, String(value));
                }
            }
        }
    });

    return this;
}

export = attr;

