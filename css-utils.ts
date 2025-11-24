import type { HtmlNode } from './types';

/**
 * CSS utility functions shared across CSS-related methods.
 */

/**
 * Convert hyphenated CSS property to camelCase.
 * e.g., 'background-color' -> 'backgroundColor'
 */
export function camelCase(str: string): string {
    return String(str).replace(/-([a-z])/g, function (_match, letter) {
        return letter.toUpperCase();
    });
}

/**
 * Convert camelCase to hyphenated CSS property.
 * e.g., 'backgroundColor' -> 'background-color'
 */
export function hyphenate(str: string): string {
    return String(str)
        .replace(/([A-Z])/g, '-$1')
        .toLowerCase();
}

/**
 * Determine if a CSS property needs 'px' unit when set with a number.
 */
export function needsPxUnit(prop: string): boolean {
    const pxProperties = [
        'width',
        'height',
        'top',
        'right',
        'bottom',
        'left',
        'margin',
        'marginTop',
        'marginRight',
        'marginBottom',
        'marginLeft',
        'padding',
        'paddingTop',
        'paddingRight',
        'paddingBottom',
        'paddingLeft',
        'borderWidth',
        'borderTopWidth',
        'borderRightWidth',
        'borderBottomWidth',
        'borderLeftWidth',
        'fontSize',
        'lineHeight',
        'letterSpacing',
        'wordSpacing',
        'maxWidth',
        'maxHeight',
        'minWidth',
        'minHeight',
        'outlineWidth',
        'textIndent',
    ];
    return pxProperties.includes(camelCase(prop));
}

/**
 * Get computed style from an element.
 */
export function getComputedStyleValue(element: HtmlNode, property: string): string | undefined {
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
            return (
                (computed as unknown as Record<string, string>)[camelProp] ||
                computed.getPropertyValue(hyphenProp)
            );
        }
    }

    // Node.js environment with jsdom
    if ('ownerDocument' in domElement && domElement.ownerDocument) {
        const ownerDoc = (domElement as Element).ownerDocument;
        if (ownerDoc.defaultView && ownerDoc.defaultView.getComputedStyle) {
            try {
                if (domElement.nodeType === 1) {
                    const computed = ownerDoc.defaultView.getComputedStyle(domElement as Element);
                    return (
                        (computed as unknown as Record<string, string>)[camelProp] ||
                        computed.getPropertyValue(hyphenProp)
                    );
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
    const styleAttr = element.getAttribute('style');
    if (styleAttr) {
        // Parse style string like "color: red; width: 100px"
        const styles: Record<string, string> = {};
        styleAttr.split(';').forEach((decl: string) => {
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

/**
 * Set style on an element.
 */
export function setStyleValue(element: HtmlNode, property: string, val: string | number): void {
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
    const styleStr = element.getAttribute('style') || '';
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
    const newStyleStr = Object.keys(styles)
        .map((k: string) => `${k}: ${styles[k]}`)
        .join('; ');
    element.setAttribute('style', newStyleStr);
}
