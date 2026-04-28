/**
 * Implementation of CSSStyleDeclaration for inline styles
 * Based on https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration
 * 
 * Provides access to an element's style attribute as individual CSS properties.
 * Syncs changes back to the element's style attribute.
 * 
 * @example
 * element.style.setProperty('color', 'red');
 * element.style.setProperty('font-size', '14px');
 * console.log(element.style.getPropertyValue('color')); // 'red'
 * console.log(element.getAttribute('style')); // 'color: red; font-size: 14px'
 */

import type { JqHTMLElement } from './JqHTMLElement';

/**
 * Simple CSSStyleDeclaration implementation for the style property
 */
export class JqCSSStyleDeclaration {
    private _element: JqHTMLElement;
    private _styles: Map<string, string> = new Map();

    constructor(element: JqHTMLElement) {
        this._element = element;
        this._parseStyleAttribute();
    }

    /**
     * Parses the style attribute into individual CSS properties
     */
    private _parseStyleAttribute(): void {
        const styleAttr = this._element.getAttribute('style');
        if (styleAttr) {
            const declarations = styleAttr.split(';');
            for (const decl of declarations) {
                const colonIndex = decl.indexOf(':');
                if (colonIndex > 0) {
                    const prop = decl.substring(0, colonIndex).trim();
                    const value = decl.substring(colonIndex + 1).trim();
                    this._styles.set(prop, value);
                }
            }
        }
    }

    /**
     * Updates the element's style attribute from the internal styles map
     */
    private _updateStyleAttribute(): void {
        const styleString = Array.from(this._styles.entries())
            .map(([prop, value]) => `${prop}: ${value}`)
            .join('; ');
        if (styleString) {
            this._element.setAttribute('style', styleString);
        } else {
            this._element.removeAttribute('style');
        }
    }

    /**
     * Sets a CSS property value
     */
    setProperty(property: string, value: string): void {
        this._styles.set(property, value);
        this._updateStyleAttribute();
    }

    /**
     * Gets a CSS property value
     */
    getPropertyValue(property: string): string {
        return this._styles.get(property) || '';
    }

    /**
     * Removes a CSS property
     */
    removeProperty(property: string): string {
        const value = this._styles.get(property) || '';
        this._styles.delete(property);
        this._updateStyleAttribute();
        return value;
    }

    /**
     * Gets or sets the CSS text
     */
    get cssText(): string {
        return this._element.getAttribute('style') || '';
    }

    set cssText(value: string) {
        this._element.setAttribute('style', value);
        this._styles.clear();
        this._parseStyleAttribute();
    }

    // Allow CSS property access via indexer
    [key: string]: any;
}
