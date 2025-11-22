import type { HtmlNode, JQ, CssValueInput, CssProperties } from '../../types';

/**
 * Gets or sets CSS properties on elements.
 */
function css(
    this: JQ,
    prop: string | string[] | CssProperties,
    value?: CssValueInput
): JQ {
    // Helper: Convert hyphenated CSS property to camelCase
    // e.g., 'background-color' -> 'backgroundColor'
    function camelCase(str: string): string {
        return String(str).replace(/-([a-z])/g, function (_match, letter) {
            return letter.toUpperCase();
        });
    }

    // Helper: Convert camelCase to hyphenated
    // e.g., 'backgroundColor' -> 'background-color'
    function hyphenate(str: string): string {
        return String(str).replace(/([A-Z])/g, '-$1').toLowerCase();
    }

    // Helper: Determine if a CSS property needs 'px' unit when set with a number
    function needsPxUnit(prop: string): boolean {
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
    function getComputedStyleValue(element: HtmlNode, property: string): string | undefined {
        const camelProp = camelCase(property);
        const hyphenProp = hyphenate(property);

        // Get the actual DOM element from internal node structure if needed
        let domElement: Element | HtmlNode = element;
        if (element._originalElement) {
            domElement = element._originalElement as Element;
        }

        // Browser environment
        if (typeof window !== 'undefined' && window.getComputedStyle) {
            // Make sure we have a real DOM element
            if (domElement.nodeType === 1) {
                const computed = window.getComputedStyle(domElement as Element);
                return (computed as unknown as Record<string, string>)[camelProp] || computed.getPropertyValue(hyphenProp);
            }
        }

        // Node.js environment with jsdom
        if ('ownerDocument' in domElement && domElement.ownerDocument) {
            const ownerDoc = (domElement as Element).ownerDocument;
            if (ownerDoc.defaultView && ownerDoc.defaultView.getComputedStyle) {
                try {
                    if (domElement.nodeType === 1) {
                        const computed = ownerDoc.defaultView.getComputedStyle(domElement as Element);
                        return (computed as unknown as Record<string, string>)[camelProp] || computed.getPropertyValue(hyphenProp);
                    }
                } catch (e) {
                    // Fall through to inline style fallback
                }
            }
        }

        // Fallback to inline style from _originalElement
        if ('style' in domElement && domElement.style) {
            const value = (domElement.style as unknown as Record<string, string>)[camelProp];
            if (value) return value;
        }

        // For internal nodes without _originalElement, parse style attribute
        if (element.attribs && element.attribs.style) {
            const styleStr = element.attribs.style;
            // Parse style string like "color: red; width: 100px"
            const styles: Record<string, string> = {};
            styleStr.split(';').forEach((decl: string) => {
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
            return styles[property] || styles[camelProp] || styles[hyphenProp] || undefined;
        }

        return undefined;
    }

    // Helper: Set style on an element
    function setStyleValue(element: HtmlNode, property: string, val: string | number): void {
        const camelProp = camelCase(property);
        let finalValue = val;

        // Convert number to string with 'px' for applicable properties
        if (typeof val === 'number' && needsPxUnit(property)) {
            finalValue = val + 'px';
        }

        // Get actual DOM element
        let domElement: Element | HtmlNode = element;
        if (element._originalElement) {
            domElement = element._originalElement as Element;
        }

        // Set on DOM element's style object
        if (domElement.nodeType === 1 && 'style' in domElement && domElement.style) {
            (domElement.style as unknown as Record<string, string | number>)[camelProp] = finalValue;
        }

        // Also update the internal node's style attribute string
        if (element.attribs) {
            let styleStr = element.attribs.style || '';
            const hyphenProp = hyphenate(property);

            // Parse existing styles
            const styles: Record<string, string | number> = {};
            if (styleStr) {
                styleStr.split(';').forEach((decl: string) => {
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
            element.attribs.style = Object.keys(styles)
                .map((k: string) => `${k}: ${styles[k]}`)
                .join('; ');
        }
    }

    // GETTER CASES
    // Arrays and non-objects (strings) go through getter logic
    if (value === undefined && (typeof prop !== 'object' || Array.isArray(prop))) {
        const element = this.nodes[0];

        if (!element) {
            return undefined as unknown as JQ;
        }

        // Case 1: Get array of properties - returns object
        if (Array.isArray(prop)) {
            const result: Record<string, string | undefined> = {};
            prop.forEach(function (property: string) {
                result[property] = getComputedStyleValue(element, property) as string;
            });
            return result as unknown as JQ;
        }

        // Case 2: Get single property - returns string
        return getComputedStyleValue(element, prop) as unknown as JQ;
    }

    // SETTER CASES
    // Case 1: Set object of properties
    if (typeof prop === 'object' && !Array.isArray(prop)) {
        this.nodes.forEach(function (element: HtmlNode) {
            if (!element) return;

            Object.keys(prop).forEach(function (property: string) {
                const value = prop[property];
                // Only string | number values allowed in object syntax (not functions)
                if (typeof value !== 'function') {
                    setStyleValue(element, property, value);
                }
            });
        });
        return this;
    }

    // Case 2: Set single property with function
    if (typeof value === 'function') {

        this.nodes.forEach(function (element: HtmlNode, index: number) {
            if (!element) return;

            const currentValue = getComputedStyleValue(element, prop as string) || '';
            const newValue = value.call(element, index, currentValue);
            setStyleValue(element, prop as string, newValue);
        });
        return this;
    }

    // Case 3: Set single property with value
    this.nodes.forEach(function (element: HtmlNode) {
        if (!element) return;
        setStyleValue(element, prop as string, value!);
    });

    return this;
}

export = css;


