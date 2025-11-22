/**
 * jQuery-like HTML selector and manipulation library.
 *
 * This module provides a simple implementation of jQuery-style DOM manipulation
 * for HTML strings, including parsing, selection, and manipulation methods.
 */

import { parseHTML } from './html-parser';
import JQ from './jq';
import { selectNodes } from './selector';
import type { HtmlNode, CssSelector, JQStatic } from './types';
import {
    now,
    noop,
    param,
    parseHTML as parseHTMLStatic,
    parseJSON,
    parseXML,
    trim,
    type as typeUtil,
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
    title as titleUtil,
    normalizeHTML as normalizeHTMLUtil
} from './utils-static';

/**
 * Converts a DOM element to the internal node format used by jqnode.
 */
function domElementToNode(element: any): HtmlNode {
    if (!element || typeof element !== 'object' || !element.nodeType) {
        throw new Error('Invalid DOM element provided');
    }

    const node: HtmlNode = {
        type: element.nodeType === 1 ? 'element' : 'text',
        name: element.nodeName ? element.nodeName.toUpperCase() : undefined,
        attribs: {},
        children: [],
        parent: undefined
    };

    // Copy attributes
    if (element.attributes) {
        // List of boolean attributes that jQuery handles specially
        const booleanAttributes = ['checked', 'selected', 'disabled', 'readonly', 'required', 'multiple'];
        for (let i = 0; i < element.attributes.length; i++) {
            const attr = element.attributes[i];
            let value: string;
            if (booleanAttributes.includes(attr.name)) {
                // For boolean attributes, jQuery's attr() returns the attribute name if present
                value = attr.name;
            } else {
                // Ensure we get the string value, not the Attr object
                value = typeof attr.value === 'string' ? attr.value : String(attr.value);
            }
            if (!node.attribs) node.attribs = {};
            node.attribs[attr.name] = value;
        }
    }

    // Copy properties for form elements
    if (element.nodeType === 1) {
        const propNames = ['value', 'checked', 'selected', 'type', 'name', 'disabled', 'readonly'];
        for (const prop of propNames) {
            if (element[prop] !== undefined) {
                (node as any)[prop] = element[prop];
            }
        }
    }

    // Convert child nodes
    if (element.childNodes) {
        for (let i = 0; i < element.childNodes.length; i++) {
            const child = element.childNodes[i];
            if (child.nodeType === 1) {
                // Element node
                const childNode = domElementToNode(child);
                childNode.parent = node;
                if (!node.children) node.children = [];
                node.children.push(childNode);
            } else if (child.nodeType === 3) {
                // Text node
                const textNode: HtmlNode = {
                    type: 'text',
                    data: child.textContent || '',
                    parent: node
                };
                if (!node.children) node.children = [];
                node.children.push(textNode);
            }
        }
    }

    // For text nodes
    if (element.nodeType === 3) {
        node.data = element.textContent || '';
        delete node.attribs;
        delete node.children;
    }

    return node;
}

/**
 * Factory function that creates JQ instances from HTML strings, CSS selectors, or node arrays.
 * Similar to jQuery's $ function.
 */
function JQFactory(htmlOrSelectorOrNodes: string | HtmlNode[] | HtmlNode | any, context?: HtmlNode[]): JQ {
    if (typeof htmlOrSelectorOrNodes === 'string') {
        const trimmed = htmlOrSelectorOrNodes.trim();
        if (trimmed.startsWith('<') && trimmed.endsWith('>')) {
            // HTML string - parse it
            let nodes = parseHTML(htmlOrSelectorOrNodes);
            // Filter out pure whitespace text nodes at the top level
            nodes = nodes.filter(node => {
                return !(node.type === 'text' && node.data && node.data.trim() === '');
            });
            return new JQ(nodes);
        } else if (htmlOrSelectorOrNodes.startsWith('.') || htmlOrSelectorOrNodes.startsWith('#') ||
            htmlOrSelectorOrNodes.includes(' ') || htmlOrSelectorOrNodes.includes('>') ||
            htmlOrSelectorOrNodes.includes('+') || htmlOrSelectorOrNodes.includes('~') ||
            htmlOrSelectorOrNodes.includes('[') || htmlOrSelectorOrNodes.includes(']') ||
            htmlOrSelectorOrNodes.includes(':')) {
            // CSS selector - search within context or global root nodes
            let searchContext = context;
            if (context === undefined) {
                searchContext = JQ.allRootNodes;
            } else if (context === null) {
                return new JQ([]);
            } else if (!Array.isArray(searchContext)) {
                return new JQ([]);
            }
            const nodes = selectNodes(searchContext, htmlOrSelectorOrNodes as CssSelector);
            return new JQ(nodes);
        } else {
            // Plain word - could be tag name or text content
            let searchContext = context;
            if (context === undefined) {
                searchContext = JQ.allRootNodes;
            } else if (context === null) {
                return new JQ([]);
            } else if (!Array.isArray(searchContext)) {
                return new JQ([]);
            }
            if (searchContext.length > 0) {
                // There are root nodes, treat as CSS selector (tag name)
                const nodes = selectNodes(searchContext, htmlOrSelectorOrNodes);
                return new JQ(nodes);
            } else {
                // No root nodes, treat as HTML/text content
                const nodes = parseHTML(htmlOrSelectorOrNodes);
                return new JQ(nodes);
            }
        }
    } else if (Array.isArray(htmlOrSelectorOrNodes)) {
        return new JQ(htmlOrSelectorOrNodes);
    } else if (htmlOrSelectorOrNodes && typeof htmlOrSelectorOrNodes === 'object' && htmlOrSelectorOrNodes.type) {
        // Single node object
        return new JQ([htmlOrSelectorOrNodes]);
    } else if (htmlOrSelectorOrNodes && typeof htmlOrSelectorOrNodes === 'object' && htmlOrSelectorOrNodes.nodeType) {
        // DOM element - convert to internal node format
        const node = domElementToNode(htmlOrSelectorOrNodes);
        return new JQ([node]);
    }

    return new JQ([]);
}

// Add fn property for jQuery-style plugin extensions
(JQFactory as any).fn = JQ.prototype;

// Add clearRootNodesRegistry method for testing
(JQFactory as any).clearRootNodesRegistry = JQ.clearRootNodesRegistry;

/**
 * Iterates over arrays and objects, similar to jQuery's $.each().
 */
(JQFactory as any).each = function (collection: any[] | Record<string, any>, callback: (indexOrKey: any, value: any) => any): any {
    if (Array.isArray(collection)) {
        for (let i = 0; i < collection.length; i++) {
            if (callback.call(collection[i], i, collection[i]) === false) {
                break;
            }
        }
    } else if (collection && typeof collection === 'object') {
        for (const key in collection) {
            if (collection.hasOwnProperty(key)) {
                if (callback.call(collection[key], key, collection[key]) === false) {
                    break;
                }
            }
        }
    }
    return collection;
};

/**
 * Example custom method using $.fn pattern
 */
(JQFactory as any).fn.yourFunctionName = function (this: JQ): JQ {
    console.log("Called yourFunctionName on " + this.nodes.length + " elements.");
    this.nodes.forEach(element => {
        if (element.attribs) {
            element.attribs['data-custom-method-called'] = 'true';
        }
    });
    return this;
};

/**
 * Maps over arrays and objects, similar to jQuery's $.map().
 */
(JQFactory as any).map = function (collection: any[] | Record<string, any>, callback: (value: any, indexOrKey: any) => any): any[] {
    const results: any[] = [];

    if (Array.isArray(collection)) {
        for (let i = 0; i < collection.length; i++) {
            const result = callback.call(collection[i], collection[i], i);
            if (result != null) {
                if (Array.isArray(result)) {
                    results.push(...result);
                } else {
                    results.push(result);
                }
            }
        }
    } else if (collection && typeof collection === 'object') {
        for (const key in collection) {
            if (collection.hasOwnProperty(key)) {
                const result = callback.call(collection[key], collection[key], key);
                if (result != null) {
                    if (Array.isArray(result)) {
                        results.push(...result);
                    } else {
                        results.push(result);
                    }
                }
            }
        }
    }

    return results;
};

/**
 * Creates a callable wrapper around a JQ instance.
 */
function makeCallable(jqInstance: JQ): any {
    const callable = function (selector: any) {
        return jqInstance.find(selector);
    };

    Object.setPrototypeOf(callable, Object.getPrototypeOf(jqInstance));

    for (const key in jqInstance) {
        if (jqInstance.hasOwnProperty(key)) {
            (callable as any)[key] = (jqInstance as any)[key];
        }
    }

    for (const key of Object.getOwnPropertyNames(JQ.prototype)) {
        if (key !== 'constructor' && typeof (jqInstance as any)[key] === 'function') {
            (callable as any)[key] = (jqInstance as any)[key].bind(jqInstance);
        } else if (key !== 'constructor') {
            Object.defineProperty(callable, key, {
                get: function () { return (jqInstance as any)[key]; },
                set: function (value) { (jqInstance as any)[key] = value; },
                enumerable: true,
                configurable: true
            });
        }
    }

    (callable as any).nodes = jqInstance.nodes;
    Object.defineProperty(callable, 'length', {
        value: jqInstance.length,
        writable: true,
        configurable: true
    });

    (callable as any)[Symbol.iterator] = function () {
        return jqInstance.nodes[Symbol.iterator]();
    };

    return new Proxy(callable, {
        get(target: any, prop: string | symbol): any {
            if (typeof prop === 'string' && /^\d+$/.test(prop)) {
                const index = parseInt(prop, 10);
                return jqInstance.nodes[index];
            }
            if (prop === 'length') {
                return jqInstance.nodes.length;
            }
            if (prop === 'nodes') {
                return jqInstance.nodes;
            }
            return target[prop];
        },
        apply(_target: any, _thisArg: any, args: any[]): any {
            const input = args[0];

            if (typeof input === 'string') {
                const trimmed = input.trim();
                if (trimmed.startsWith('<') && trimmed.endsWith('>')) {
                    return JQFactory(input);
                } else {
                    return jqInstance.find(input);
                }
            } else if (input && (typeof input === 'object' || Array.isArray(input))) {
                return JQFactory(input);
            }

            return JQFactory([]);
        }
    });
}

/**
 * Loads and parses an HTML string, creating a callable JQ instance.
 */
(JQFactory as any).load = function (html: string, options?: { normalize?: boolean }): any {
    if (typeof html !== 'string') {
        console.warn('[jqnode] .load() expects a string argument, received:', typeof html);
        return makeCallable(new JQ([]));
    }

    if (options && options.normalize) {
        html = (JQFactory as any).normalizeHTML(html);
    }

    const jqInstance = JQFactory(html);
    return makeCallable(jqInstance);
};

// Attach static utility methods
(JQFactory as any).now = now;
(JQFactory as any).noop = noop;
(JQFactory as any).param = param;
(JQFactory as any).parseHTML = parseHTMLStatic;
(JQFactory as any).parseJSON = parseJSON;
(JQFactory as any).parseXML = parseXML;
(JQFactory as any).trim = trim;
(JQFactory as any).type = typeUtil;
(JQFactory as any).unique = unique;
(JQFactory as any).uniqueSort = uniqueSort;
(JQFactory as any).makeArray = makeArray;
(JQFactory as any).isPlainObject = isPlainObject;
(JQFactory as any).isNumeric = isNumeric;
(JQFactory as any).isFunction = isFunction;
(JQFactory as any).isEmptyObject = isEmptyObject;
(JQFactory as any).isArray = isArray;
(JQFactory as any).inArray = inArray;
(JQFactory as any).hasData = hasData;
(JQFactory as any).extend = extend;
(JQFactory as any).escapeSelector = escapeSelector;
(JQFactory as any).title = titleUtil;
(JQFactory as any).normalizeHTML = normalizeHTMLUtil;


const JQExport = JQFactory as unknown as JQStatic;
export = JQExport;
