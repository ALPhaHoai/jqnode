/**
 * Gets or sets CSS properties on elements with camelCase property names (React inline style format).
 * Similar to .css() but transforms kebab-case CSS properties to camelCase.
 * @see https://react.dev/reference/react-dom/components/common#applying-css-styles
 * @param {string|Array|Object} prop - Property name, array of property names, or object of property-value pairs
 * @param {string|number|Function} [value] - Property value, or function that returns a value
 * @returns {string|Object|JQ} Property value(s) if getting (with camelCase keys), JQ instance if setting
 */
module.exports = function cssCamel(prop, value) {
    // Helper: Convert hyphenated CSS property to camelCase
    // e.g., 'background-color' -> 'backgroundColor'
    function camelCase(str) {
        return String(str).replace(/-([a-z])/g, function (match, letter) {
            return letter.toUpperCase();
        });
    }

    // Helper: Convert camelCase to hyphenated
    // e.g., 'backgroundColor' -> 'background-color'
    function hyphenate(str) {
        return String(str).replace(/([A-Z])/g, '-$1').toLowerCase();
    }

    // Helper: Determine if a CSS property needs 'px' unit when set with a number
    function needsPxUnit(prop) {
        const pxProperties = [
            'width', 'height', 'top', 'right', 'bottom', 'left',
            'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
            'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
            'borderWidth', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth',
            'fontSize', 'lineHeight', 'letterSpacing', 'wordSpacing',
            'maxWidth', 'maxHeight', 'minWidth', 'minHeight',
            'outlineWidth', 'textIndent'
        ];
        return pxProperties.includes(camelCase(prop));
    }

    // Helper: Get computed style from an element
    function getComputedStyleValue(element, property) {
        const camelProp = camelCase(property);
        const hyphenProp = hyphenate(property);

        // Get the actual DOM element from internal node structure if needed
        let domElement = element;
        if (element._originalElement) {
            domElement = element._originalElement;
        }

        // Browser environment
        if (typeof window !== 'undefined' && window.getComputedStyle) {
            // Make sure we have a real DOM element
            if (domElement.nodeType === 1) {
                const computed = window.getComputedStyle(domElement);
                return computed[camelProp] || computed.getPropertyValue(hyphenProp);
            }
        }

        // Node.js environment with jsdom
        if (domElement.ownerDocument) {
            const ownerDoc = domElement.ownerDocument;
            if (ownerDoc.defaultView && ownerDoc.defaultView.getComputedStyle) {
                try {
                    if (domElement.nodeType === 1) {
                        const computed = ownerDoc.defaultView.getComputedStyle(domElement);
                        return computed[camelProp] || computed.getPropertyValue(hyphenProp);
                    }
                } catch (e) {
                    // Fall through to inline style fallback
                }
            }
        }

        // Fallback to inline style from _originalElement
        if (domElement.style) {
            const value = domElement.style[camelProp];
            if (value) return value;
        }

        // For internal nodes without _originalElement, parse style attribute
        if (element.attributes && element.attributes.style) {
            const styleStr = element.attributes.style;
            // Parse style string like "color: red; width: 100px"
            const styles = {};
            styleStr.split(';').forEach(decl => {
                const colonIndex = decl.indexOf(':');
                if (colonIndex > 0) {
                    const prop = decl.substring(0, colonIndex).trim();
                    const val = decl.substring(colonIndex + 1).trim();
                    if (prop && val) {
                        // Store both hyphenated and camelCase versions
                        styles[prop] = val;
                        styles[camelCase(prop)] = val;
                    }
                }
            });

            // Try both camelCase and hyphenated versions
            return styles[property] || styles[camelProp] || styles[hyphenProp];
        }

        return undefined;
    }

    // Helper: Set style on an element
    function setStyleValue(element, property, val) {
        const camelProp = camelCase(property);
        let finalValue = val;

        // Convert number to string with 'px' for applicable properties
        if (typeof val === 'number' && needsPxUnit(property)) {
            finalValue = val + 'px';
        }

        // Get actual DOM element
        let domElement = element;
        if (element._originalElement) {
            domElement = element._originalElement;
        }

        // Set on DOM element's style object
        if (domElement.nodeType === 1 && domElement.style) {
            domElement.style[camelProp] = finalValue;
        }

        // Also update the internal node's style attribute string
        if (element.attributes) {
            let styleStr = element.attributes.style || '';
            const hyphenProp = hyphenate(property);

            // Parse existing styles
            const styles = {};
            if (styleStr) {
                styleStr.split(';').forEach(decl => {
                    const colonIndex = decl.indexOf(':');
                    if (colonIndex > 0) {
                        const prop = decl.substring(0, colonIndex).trim();
                        const value = decl.substring(colonIndex + 1).trim();
                        if (prop && value) {
                            styles[prop] = value;
                        }
                    }
                });
            }

            // Update or add the property
            styles[hyphenProp] = finalValue;

            // Rebuild style string
            element.attributes.style = Object.keys(styles)
                .map(k => `${k}: ${styles[k]}`)
                .join('; ');
        }
    }

    // GETTER CASES
    // Arrays and non-objects (strings) go through getter logic
    if (value === undefined && (typeof prop !== 'object' || Array.isArray(prop))) {
        const element = this.nodes[0];

        if (!element) {
            return undefined;
        }

        // Case 1: Get array of properties - returns object with camelCase keys
        if (Array.isArray(prop)) {
            const result = {};
            prop.forEach(function (property) {
                const camelProp = camelCase(property);
                result[camelProp] = getComputedStyleValue(element, property);
            });
            return result;
        }

        // Case 2: Get single property - returns string
        return getComputedStyleValue(element, prop);
    }

    // SETTER CASES
    // Case 1: Set object of properties
    if (typeof prop === 'object' && !Array.isArray(prop)) {
        this.nodes.forEach(function (element) {
            if (!element) return;

            Object.keys(prop).forEach(function (property) {
                setStyleValue(element, property, prop[property]);
            });
        });
        return this;
    }

    // Case 2: Set single property with function
    if (typeof value === 'function') {
        const self = this;
        this.nodes.forEach(function (element, index) {
            if (!element) return;

            const currentValue = getComputedStyleValue(element, prop);
            const newValue = value.call(element, index, currentValue);
            setStyleValue(element, prop, newValue);
        });
        return this;
    }

    // Case 3: Set single property with value
    this.nodes.forEach(function (element) {
        if (!element) return;
        setStyleValue(element, prop, value);
    });

    return this;
};
