import type { JqElement, JQ, AttributeValue, GetterSetterReturn } from '../../types';

/**
 * Gets or sets an attribute on the first element in the collection.
 * @see https://api.jquery.com/attr/
 */
function attr(
    this: JQ,
    name: string | Record<string, AttributeValue>,
    value?: AttributeValue | ((index: number, attr: string) => string | number | void | undefined),
): GetterSetterReturn<string> {
    const booleanAttributes = [
        'checked',
        'selected',
        'disabled',
        'readonly',
        'required',
        'multiple',
        'autofocus',
        'autoplay',
        'hidden',
        'controls',
        'loop',
        'muted',
        'default',
        'open',
        'reversed',
        'scoped',
        'async',
        'defer',
    ];

    // Handle object map: attr({ key: value, ... })
    if (typeof name === 'object' && name !== null) {
        for (const key in name) {
            if (Object.prototype.hasOwnProperty.call(name, key)) {
                this.attr(key, name[key]);
            }
        }
        return this;
    }

    // Getter: attr(name)
    if (value === undefined) {
        const element = this.nodes[0];
        if (!element) return undefined;

        // Check DOM element first
        if (element._originalElement) {
            if (booleanAttributes.includes(name)) {
                return element._originalElement.hasAttribute(name) ? name : undefined;
            }
            const attrValue = element._originalElement.getAttribute(name);
            return attrValue !== null ? attrValue : undefined;
        }

        // Fallback to internal attributes
        const attrValue = element.getAttribute(name);
        if (attrValue !== null) {
            if (booleanAttributes.includes(name)) {
                return name;
            }
            return attrValue;
        }

        // Check boolean properties if not found in attributes (for consistency)
        if (booleanAttributes.includes(name) && element.properties && element.properties[name]) {
            return name;
        }

        return undefined;
    }

    // Setter: attr(name, value) or attr(name, function)
    this.nodes.forEach((element: JqElement, index: number) => {
        if (!element) return;

        let valToSet: AttributeValue | undefined;

        if (typeof value === 'function') {
            const currentAttr = element.getAttribute(name) || '';
            const result = value.call(element, index, currentAttr);
            if (result === undefined) return; // Don't change if undefined returned
            valToSet = result as AttributeValue;
        } else {
            valToSet = value;
        }

        // Handle boolean attributes
        if (booleanAttributes.includes(name)) {
            if (valToSet === false || valToSet === null || valToSet === undefined) {
                // Remove attribute
                element.removeAttribute(name);
                if (element._originalElement) {
                    element._originalElement.removeAttribute(name);
                }
            } else {
                // Set attribute to name (standard HTML5 boolean attribute behavior)
                element.setAttribute(name, name);
                if (element._originalElement) {
                    element._originalElement.setAttribute(name, name);
                }
            }
        } else {
            // Handle normal attributes
            if (valToSet === null || valToSet === undefined) {
                // Remove attribute
                element.removeAttribute(name);
                if (element._originalElement) {
                    element._originalElement.removeAttribute(name);
                }
            } else {
                // Set attribute
                const stringValue = String(valToSet);
                element.setAttribute(name, stringValue);
                if (element._originalElement) {
                    element._originalElement.setAttribute(name, stringValue);
                }
            }
        }
    });

    return this;
}

export = attr;
