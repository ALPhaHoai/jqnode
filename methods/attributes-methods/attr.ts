import type { HtmlNode, JQ, AttributeValue, GetterSetterReturn } from '../../types';

/**
 * Gets or sets an attribute on the first element in the collection.
 */
function attr(this: JQ, name: string, value?: AttributeValue): GetterSetterReturn<string> {
    const booleanAttributes = ['checked', 'selected', 'disabled', 'readonly', 'required', 'multiple', 'autofocus', 'autoplay', 'hidden', 'controls', 'loop', 'muted', 'default', 'open', 'reversed', 'scoped', 'async', 'defer'];

    if (value === undefined) {
        const element = this.nodes[0];

        if (!element) {
            return undefined;
        }

        if (element._originalElement) {
            const attrValue = element._originalElement.getAttribute(name);
            if (attrValue !== null) {
                if (booleanAttributes.includes(name)) {
                    return name;
                }
                return attrValue;
            }
            // Fallback to internal attributes if not found in DOM
            if (element.attributes && element.attributes[name] !== undefined) {
                const fallbackValue = element.attributes[name];
                if (booleanAttributes.includes(name)) {
                    return fallbackValue as string;
                }
                return fallbackValue as string;
            }
            return undefined;
        }

        if (element.nodeType === 1 && element.getAttribute) {
            const attrValue = element.getAttribute(name);
            if (attrValue === null) return undefined;

            if (booleanAttributes.includes(name)) {
                return name;
            }

            return attrValue;
        }

        const attrValue = element.attributes ? element.attributes[name] : undefined;

        if (booleanAttributes.includes(name)) {
            return attrValue as string | undefined;
        }

        return attrValue as string | undefined;
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

        if (element.attributes) {
            if (booleanAttributes.includes(name)) {
                element.attributes[name] = value === true ? name : String(value || '');
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
                element.attributes[name] = String(value || '');
                if (element._originalElement) {
                    element._originalElement.setAttribute(name, String(value));
                }
            }
        }
    });

    return this;
}

export = attr;

