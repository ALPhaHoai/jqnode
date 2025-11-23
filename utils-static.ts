/**
 * Static utility methods for jQuery compatibility
 * These are utility functions that are attached to the jQuery/$ object itself
 */

import type { HtmlNode } from './types';

/**
 * Return a number representing the current time.
 * @deprecated Use Date.now() instead.
 */
function now(): number {
    return Date.now();
}

/**
 * An empty function.
 */
function noop(): void {
    // Empty function
}

/**
 * Create a serialized representation of an array, a plain object, or a jQuery object.
 */
function param(obj: any, traditional: boolean = false): string {
    const s: string[] = [];

    const add = (key: string, valueOrFunction: any): void => {
        const value = typeof valueOrFunction === 'function' ? valueOrFunction() : valueOrFunction;
        s.push(encodeURIComponent(key) + '=' + encodeURIComponent(value == null ? '' : value));
    };

    const buildParams = (prefix: string, obj: any): void => {
        if (Array.isArray(obj)) {
            obj.forEach((v, i) => {
                if (traditional || /\[\]$/.test(prefix)) {
                    add(prefix, v);
                } else {
                    buildParams(
                        prefix + '[' + (typeof v === 'object' && v != null ? i : '') + ']',
                        v,
                    );
                }
            });
        } else if (!traditional && obj != null && typeof obj === 'object') {
            for (const name in obj) {
                if (obj.hasOwnProperty(name)) {
                    buildParams(prefix + '[' + name + ']', obj[name]);
                }
            }
        } else {
            add(prefix, obj);
        }
    };

    // Check if it's a jQuery object with nodes
    if (obj && obj.nodes && Array.isArray(obj.nodes)) {
        // Serialize form elements
        obj.nodes.forEach((node: HtmlNode) => {
            if (node.name === 'INPUT' || node.name === 'SELECT' || node.name === 'TEXTAREA') {
                const name = node.attribs?.name;
                const value = node.attribs?.value;
                if (name) {
                    add(name, value || '');
                }
            }
        });
    } else if (Array.isArray(obj)) {
        // Handle array (from serializeArray format)
        obj.forEach((item: any) => {
            if (item && item.name !== undefined) {
                add(item.name, item.value);
            }
        });
    } else if (obj != null && typeof obj === 'object') {
        // Handle plain object
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (traditional) {
                    add(key, obj[key]);
                } else {
                    buildParams(key, obj[key]);
                }
            }
        }
    }

    return s.join('&');
}

/**
 * Parses a string into an array of DOM nodes or HtmlNodes.
 */
function parseHTML(data: string, context?: Document | boolean, keepScripts?: boolean): any[] {
    if (!data || typeof data !== 'string') {
        return [];
    }

    // Handle boolean parameter in second position
    if (typeof context === 'boolean') {
        keepScripts = context;
        context = undefined;
    }

    // Use the html-parser for server-side
    if (typeof document === 'undefined') {
        const { parseHTML: parseHTMLInternal } = require('./html-parser');
        const nodes: HtmlNode[] = parseHTMLInternal(data);

        // Filter out script tags if keepScripts is false
        if (keepScripts === false) {
            return nodes.filter((node) => !(node.type === 'element' && node.name === 'SCRIPT'));
        }

        return nodes;
    }

    // Browser environment
    const doc = (context as Document) || document;
    const parsed = doc.createElement('div');
    parsed.innerHTML = data;

    const nodes = Array.from(parsed.childNodes);

    // Filter out script elements if keepScripts is false
    if (keepScripts === false) {
        return nodes.filter((node) => node.nodeName !== 'SCRIPT');
    }

    return nodes;
}

/**
 * Takes a well-formed JSON string and returns the resulting JavaScript value.
 * @deprecated Use JSON.parse() instead.
 */
function parseJSON(json: string): any {
    return JSON.parse(json);
}

/**
 * Parses a string into an XML document.
 */
function parseXML(data: string): Document | null {
    if (!data || typeof data !== 'string') {
        return null;
    }

    let xml;

    // Browser environment
    if (typeof window !== 'undefined' && window.DOMParser) {
        xml = new window.DOMParser().parseFromString(data, 'text/xml');
    }
    // Node.js environment - parseXML is not fully supported server-side without jsdom
    else {
        return null;
    }

    if (!xml || xml.getElementsByTagName('parsererror').length) {
        throw new Error('Invalid XML: ' + data);
    }

    return xml;
}

/**
 * Remove the whitespace from the beginning and end of a string.
 * @deprecated Use String.prototype.trim() instead.
 */
function trim(str: string | null | undefined): string {
    return str == null ? '' : String(str).trim();
}

/**
 * Determine the internal JavaScript [[Class]] of an object.
 */
function type(obj: any): string {
    if (obj == null) {
        return String(obj);
    }

    const classToType: Record<string, string> = {
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regexp',
        '[object Object]': 'object',
        '[object Error]': 'error',
        '[object Symbol]': 'symbol',
    };

    const typeStr = Object.prototype.toString.call(obj);
    return classToType[typeStr] || 'object';
}

/**
 * Remove duplicate elements from an array.
 */
function unique<T>(array: T[]): T[] {
    // jQuery's unique is an alias for uniqueSort and modifies in-place
    return uniqueSort(array);
}

/**
 * Sort an array of DOM elements or nodes, removing duplicates.
 */
function uniqueSort(array: any[]): any[] {
    const uniqueItems = [...new Set(array)];
    array.length = 0;
    array.push(...uniqueItems);
    return array;
}

/**
 * Convert an array-like object into a true JavaScript array.
 */
function makeArray(obj: any): any[] {
    if (obj == null) {
        return [];
    }

    if (Array.isArray(obj)) {
        return obj.slice();
    }

    if (typeof obj === 'string') {
        return [obj];
    }

    // Handle array-like objects
    if (obj.length !== undefined && typeof obj.length === 'number') {
        return Array.prototype.slice.call(obj);
    }

    return [obj];
}

/**
 * Check to see if an object is a plain object.
 */
function isPlainObject(obj: any): boolean {
    if (!obj || type(obj) !== 'object') {
        return false;
    }

    // Not own constructor (e.g., Array, Date, RegExp)
    if (
        obj.constructor &&
        !Object.prototype.hasOwnProperty.call(obj.constructor.prototype, 'isPrototypeOf')
    ) {
        return false;
    }

    return true;
}

/**
 * Determines whether its argument represents a JavaScript number.
 */
function isNumeric(obj: any): boolean {
    return !isNaN(parseFloat(obj)) && isFinite(obj);
}

/**
 * Determine if the argument passed is a JavaScript function object.
 */
function isFunction(obj: any): boolean {
    return typeof obj === 'function';
}

/**
 * Check to see if an object is empty.
 */
function isEmptyObject(obj: any): boolean {
    if (!obj) {
        return true;
    }

    for (const name in obj) {
        if (obj.hasOwnProperty(name)) {
            return false;
        }
    }

    return true;
}

/**
 * Determine whether the argument is an array.
 */
function isArray(obj: any): boolean {
    return Array.isArray(obj);
}

/**
 * Search for a specified value within an array.
 */
function inArray<T>(value: T, array: T[], fromIndex: number = 0): number {
    return array.indexOf(value, fromIndex);
}

/**
 * Determine whether an element has any data associated with it.
 */
function hasData(element: HtmlNode): boolean {
    return !!(element && (element as any).data);
}

/**
 * Merge the contents of two or more objects together into the first object.
 */
function extend(target: any, ...sources: any[]): any {
    let deep = false;
    let targetObj = target;
    let sourceArgs = sources;

    // Handle deep copy
    if (typeof target === 'boolean') {
        deep = target;
        targetObj = sources[0] || {};
        sourceArgs = sources.slice(1);
    }

    if (!targetObj || typeof targetObj !== 'object') {
        targetObj = {};
    }

    for (const source of sourceArgs) {
        if (!source) continue;

        for (const key in source) {
            if (!source.hasOwnProperty(key)) continue;

            const src = targetObj[key];
            const copy = source[key];

            // Prevent infinite loop
            if (targetObj === copy) {
                continue;
            }

            // Deep copy
            if (deep && copy && (isPlainObject(copy) || isArray(copy))) {
                let clone;

                if (isArray(copy)) {
                    clone = src && isArray(src) ? src : [];
                } else {
                    clone = src && isPlainObject(src) ? src : {};
                }

                targetObj[key] = extend(deep, clone, copy);
            }
            // Shallow copy
            else if (copy !== undefined) {
                targetObj[key] = copy;
            }
        }
    }

    return targetObj;
}

/**
 * Escapes any character that has a special meaning in a CSS selector.
 */
function escapeSelector(selector: string): string {
    if (typeof CSS !== 'undefined' && CSS.escape) {
        return CSS.escape(selector);
    }

    // Fallback implementation
    return selector.replace(/([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g, (match, charCode) => {
        if (charCode) {
            // Handle NULL and control characters
            if (match === '\0') {
                return '\uFFFD';
            }
            // Escape with backslash and hex
            return '\\' + match.charCodeAt(0).toString(16) + ' ';
        }
        // Escape with backslash
        return '\\' + match;
    });
}

/**
 * Get the document title.
 */
function title(): string {
    // Lazy load JQFactory to avoid circular dependency
    const JQFactory = require('./index').default;

    // Use jqnode selector to find title element
    return JQFactory('head > title').text().trim();
}

/**
 * Normalize HTML by removing tabs, newlines, carriage returns, and collapsing multiple whitespace.
 */
function normalizeHTML(html: string): string {
    if (typeof html !== 'string') {
        return '';
    }
    return html
        .replace(/[\t\n\r]/gi, ' ') // Replace tabs, newlines, carriage returns with space
        .replace(/\s+/g, ' ') // Collapse multiple spaces into single space
        .trim(); // Remove leading and trailing whitespace
}

export {
    now,
    noop,
    param,
    parseHTML,
    parseJSON,
    parseXML,
    trim,
    type,
    unique,
    uniqueSort,
    makeArray,
    isPlainObject,
    isNumeric,
    isFunction,
    isEmptyObject,
    isArray,
    inArray,
    hasData,
    extend,
    escapeSelector,
    title,
    normalizeHTML,
};
