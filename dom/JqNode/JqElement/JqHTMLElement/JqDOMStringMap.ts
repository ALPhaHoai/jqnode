/**
 * Implementation of DOMStringMap for the dataset property
 * Based on https://developer.mozilla.org/en-US/docs/Web/API/DOMStringMap
 * 
 * Provides access to custom data attributes (data-*) on elements.
 * Automatically converts between camelCase property names and kebab-case attribute names.
 * 
 * @example
 * element.dataset.userId = '123';
 * // Creates attribute: data-user-id="123"
 * 
 * console.log(element.dataset.userId); // '123'
 */

import type { JqHTMLElement } from './JqHTMLElement';

/**
 * DOMStringMap implementation for managing data-* attributes
 */
export class JqDOMStringMap {
    private _element: JqHTMLElement;

    constructor(element: JqHTMLElement) {
        this._element = element;
    }

    // Allow indexing
    [key: string]: any;
}

/**
 * Creates a Proxy-based DOMStringMap that syncs with element attributes
 */
export function createDOMStringMap(element: JqHTMLElement): DOMStringMap {
    const map = new JqDOMStringMap(element);

    // Populate with existing data-* attributes
    const attrNames = element.getAttributeNames();
    for (const name of attrNames) {
        if (name.startsWith('data-')) {
            const camelKey = name.substring(5).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
            const value = element.getAttribute(name);
            if (value !== null) {
                map[camelKey] = value;
            }
        }
    }

    // Create proxy to sync changes back to attributes
    return new Proxy(map, {
        get: (target, prop: string) => {
            if (typeof prop === 'string' && prop !== '_element') {
                const attrName = 'data-' + prop.replace(/[A-Z]/g, letter => '-' + letter.toLowerCase());
                return element.getAttribute(attrName);
            }
            return target[prop];
        },
        set: (target, prop: string, value) => {
            if (typeof prop === 'string' && prop !== '_element') {
                const attrName = 'data-' + prop.replace(/[A-Z]/g, letter => '-' + letter.toLowerCase());
                element.setAttribute(attrName, String(value));
            }
            target[prop] = value;
            return true;
        }
    }) as unknown as DOMStringMap;
}
