/**
 * Gets or sets an attribute on the first element in the collection.
 * @see https://api.jquery.com/attr/
 * @param {string} name - Attribute name
 * @param {string|boolean} [value] - Attribute value (if setting)
 * @returns {string|JQ} Attribute value if getting, JQ instance if setting
 */
module.exports = function attr(name, value) {
    // jQuery treats these as boolean attributes
    const booleanAttributes = ['checked', 'selected', 'disabled', 'readonly', 'required', 'multiple'];

    if (value === undefined) {
        // Get attribute value from first element
        const element = this.nodes[0];

        if (!element) {
            return undefined;
        }

        // For elements with _originalElement, ALWAYS read from the DOM to stay in sync with reality
        // This matches jQuery's behavior of always reading the current DOM state
        if (element._originalElement) {
            const attrValue = element._originalElement.getAttribute(name);
            if (attrValue === null) return undefined;

            // For boolean attributes, jQuery always returns the attribute name if present
            if (booleanAttributes.includes(name)) {
                return name;
            }

            return attrValue;
        }

        // Handle DOM elements (direct DOM element without our wrapper)
        if (element.nodeType === 1) {
            const attrValue = element.getAttribute(name);
            if (attrValue === null) return undefined;

            // For boolean attributes, jQuery always returns the attribute name if present
            if (booleanAttributes.includes(name)) {
                return name;
            }

            return attrValue;
        }

        // Handle internal nodes (fallback)
        const attrValue = element.attributes ? element.attributes[name] : undefined;

        // For boolean attributes, return the actual stored value (jQuery behavior)
        if (booleanAttributes.includes(name)) {
            return attrValue;
        }

        const result = attrValue;
        return result;
    }

    // Set attribute value on all elements
    this.nodes.forEach(element => {
        if (!element) return;

        // Handle DOM elements
        if (element.nodeType === 1) {
            if (booleanAttributes.includes(name)) {
                if (value === true) {
                    element.setAttribute(name, name);
                } else if (value === false || value === null || value === undefined) {
                    element.removeAttribute(name);
                } else {
                    element.setAttribute(name, value);
                }
            } else {
                if (value === null || value === undefined) {
                    element.removeAttribute(name);
                } else {
                    element.setAttribute(name, value);
                }
            }
            return;
        }

        // Handle internal nodes
        if (element.attributes) {
            // For boolean attributes, jQuery sets the value to the attribute name when true
            if (booleanAttributes.includes(name)) {
                element.attributes[name] = value === true ? name : value;
                // Also update the DOM element if it exists
                if (element._originalElement) {
                    if (value === true) {
                        element._originalElement.setAttribute(name, name);
                    } else if (value === false || value === null || value === undefined) {
                        element._originalElement.removeAttribute(name);
                    } else {
                        element._originalElement.setAttribute(name, value);
                    }
                }
            } else {
                element.attributes[name] = value;
                // Also update the DOM element if it exists
                if (element._originalElement) {
                    element._originalElement.setAttribute(name, value);
                }
            }
        }
    });

    return this;
};
