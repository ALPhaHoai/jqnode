/**
 * jQuery-like HTML selector and manipulation library.
 *
 * This module provides a simple implementation of jQuery-style DOM manipulation
 * for HTML strings, including parsing, selection, and manipulation methods.
 */

const { parseHTML } = require('./html-parser');
const JQ = require('./jq');
const { isCSSSelector, selectNodes } = require('./selector');

/**
 * Converts a DOM element to the internal node format used by jqnode.
 * @param {Element} element - DOM element to convert
 * @returns {Object} Internal node object
 */
function domElementToNode(element) {
    if (!element || typeof element !== 'object' || !element.nodeType) {
        throw new Error('Invalid DOM element provided');
    }

    const node = {
        type: element.nodeType === 1 ? 'element' : 'text',
        tagName: element.nodeName ? element.nodeName.toUpperCase() : undefined,
        attributes: {},
        properties: {},
        children: [],
        parent: null,
        _originalElement: element
    };

    // Copy attributes
    if (element.attributes) {
        // List of boolean attributes that jQuery handles specially
        const booleanAttributes = ['checked', 'selected', 'disabled', 'readonly', 'required', 'multiple'];
        for (let i = 0; i < element.attributes.length; i++) {
            const attr = element.attributes[i];
            let value;
            if (booleanAttributes.includes(attr.name)) {
                // For boolean attributes, jQuery's attr() returns the attribute name if present
                value = attr.name;
            } else {
                // Ensure we get the string value, not the Attr object
                value = typeof attr.value === 'string' ? attr.value : String(attr.value);
            }
            node.attributes[attr.name] = value;
        }
    }

    // Copy properties for form elements and other elements with properties
    if (element.nodeType === 1) {
        // Common properties to copy
        const propNames = ['value', 'checked', 'selected', 'type', 'name', 'disabled', 'readonly'];
        for (const prop of propNames) {
            if (element[prop] !== undefined) {
                node.properties[prop] = element[prop];
            }
        }

        // Copy any other properties that exist on the element
        // This is a simplified approach - in a real implementation you'd want to be more selective
        for (const prop in element) {
            if (element.hasOwnProperty && element.hasOwnProperty(prop) &&
                typeof element[prop] !== 'function' &&
                typeof element[prop] !== 'object' &&
                !prop.startsWith('on') && // Skip event handlers
                prop !== 'attributes' &&
                prop !== 'childNodes' &&
                prop !== 'children' &&
                prop !== 'parentNode' &&
                prop !== 'ownerDocument') {
                node.properties[prop] = element[prop];
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
                node.children.push(childNode);
            } else if (child.nodeType === 3) {
                // Text node
                const textNode = {
                    type: 'text',
                    value: child.textContent || '',
                    parent: node
                };
                node.children.push(textNode);
            }
            // Skip other node types (comments, etc.)
        }
    }

    // For text nodes
    if (element.nodeType === 3) {
        node.value = element.textContent || '';
        delete node.attributes;
        delete node.properties;
        delete node.children;
    }

    return node;
}

// Export clearRootNodesRegistry method for testing
JQFactory.clearRootNodesRegistry = JQ.clearRootNodesRegistry;

/**
 * Factory function that creates JQ instances from HTML strings, CSS selectors, or node arrays.
 * Similar to jQuery's $ function.
 *
 * @param {string|Array} htmlOrSelectorOrNodes - HTML string, CSS selector, or array of nodes
 * @param {Array} [context] - Context nodes to search within for selectors (defaults to empty)
 * @returns {JQ} New JQ instance
 */
function JQFactory(htmlOrSelectorOrNodes, context) {
    if (typeof jest === 'undefined') {
        console.log(`[DEBUG] JQFactory: Called with input type: ${typeof htmlOrSelectorOrNodes}, context provided: ${!!context}`);
    }

    if (typeof htmlOrSelectorOrNodes === 'string') {
        const trimmed = htmlOrSelectorOrNodes.trim();
        if (trimmed.startsWith('<') && trimmed.endsWith('>')) {
            // HTML string - parse it
            if (typeof jest === 'undefined') {
                console.log(`[DEBUG] JQFactory: Detected HTML string, parsing...`);
            }
            let nodes = parseHTML(htmlOrSelectorOrNodes);
            if (typeof jest === 'undefined') {
                console.log(`[DEBUG] JQFactory: HTML parsing returned ${nodes.length} root nodes`);
            }
            // Filter out pure whitespace text nodes at the top level
            nodes = nodes.filter(node => {
                return !(node.type === 'text' && node.value.trim() === '');
            });
            if (typeof jest === 'undefined') {
                console.log(`[DEBUG] JQFactory: After filtering whitespace, ${nodes.length} root nodes`);
            }
            return new JQ(nodes);
        } else if (htmlOrSelectorOrNodes.startsWith('.') || htmlOrSelectorOrNodes.startsWith('#') ||
            htmlOrSelectorOrNodes.includes(' ') || htmlOrSelectorOrNodes.includes('>') ||
            htmlOrSelectorOrNodes.includes('+') || htmlOrSelectorOrNodes.includes('~') ||
            htmlOrSelectorOrNodes.includes('[') || htmlOrSelectorOrNodes.includes(']') ||
            htmlOrSelectorOrNodes.includes(':')) {
            // CSS selector - search within context or global root nodes
            // Validate that context is a valid array of nodes (or use global registry)
            let searchContext = context;
            if (context === undefined) {
                // No context provided, use global registry
                searchContext = JQ.allRootNodes;
            } else if (context === null) {
                // Explicitly null context provided, return empty
                if (typeof jest === 'undefined') {
                    console.log(`[DEBUG] JQFactory: Null context provided for selector "${htmlOrSelectorOrNodes}", returning empty result`);
                }
                return new JQ([]);
            } else if (!Array.isArray(searchContext)) {
                // Invalid context provided, return empty
                if (typeof jest === 'undefined') {
                    console.log(`[DEBUG] JQFactory: Invalid context provided for selector "${htmlOrSelectorOrNodes}", returning empty result`);
                }
                return new JQ([]);
            }
            if (typeof jest === 'undefined') {
                console.log(`[DEBUG] JQFactory: Detected CSS selector: "${htmlOrSelectorOrNodes}"`);
                console.log(`[DEBUG] JQFactory: Searching within ${searchContext.length} context nodes`);
            }
            const nodes = selectNodes(searchContext, htmlOrSelectorOrNodes);
            if (typeof jest === 'undefined') {
                console.log(`[DEBUG] JQFactory: Selector search returned ${nodes.length} nodes`);
            }
            return new JQ(nodes);
        } else {
            // Plain word - could be tag name or text content
            // Validate that context is a valid array of nodes (or use global registry)
            let searchContext = context;
            if (context === undefined) {
                // No context provided, use global registry
                searchContext = JQ.allRootNodes;
            } else if (context === null) {
                // Explicitly null context provided, return empty
                if (typeof jest === 'undefined') {
                    console.log(`[DEBUG] JQFactory: Null context provided for selector (tag): "${htmlOrSelectorOrNodes}", returning empty result`);
                }
                return new JQ([]);
            } else if (!Array.isArray(searchContext)) {
                // Invalid context provided, return empty
                if (typeof jest === 'undefined') {
                    console.log(`[DEBUG] JQFactory: Invalid context provided for selector (tag): "${htmlOrSelectorOrNodes}", returning empty result`);
                }
                return new JQ([]);
            }
            // Check if there are root nodes to search
            if (searchContext.length > 0) {
                // There are root nodes, treat as CSS selector (tag name)
                if (typeof jest === 'undefined') {
                    console.log(`[DEBUG] JQFactory: Detected CSS selector (tag): "${htmlOrSelectorOrNodes}"`);
                    console.log(`[DEBUG] JQFactory: Searching within ${searchContext.length} context nodes`);
                }
                const nodes = selectNodes(searchContext, htmlOrSelectorOrNodes);
                if (typeof jest === 'undefined') {
                    console.log(`[DEBUG] JQFactory: Selector search returned ${nodes.length} nodes`);
                }
                return new JQ(nodes);
            } else {
                // No root nodes, treat as HTML/text content
                if (typeof jest === 'undefined') {
                    console.log(`[DEBUG] JQFactory: No root nodes, treating as HTML content: "${htmlOrSelectorOrNodes}"`);
                }
                const nodes = parseHTML(htmlOrSelectorOrNodes);
                if (typeof jest === 'undefined') {
                    console.log(`[DEBUG] JQFactory: HTML parsing returned ${nodes.length} root nodes`);
                }
                return new JQ(nodes);
            }
        }
    } else if (Array.isArray(htmlOrSelectorOrNodes)) {
        if (typeof jest === 'undefined') {
            console.log(`[DEBUG] JQFactory: Received array of ${htmlOrSelectorOrNodes.length} nodes`);
        }
        return new JQ(htmlOrSelectorOrNodes);
    } else if (htmlOrSelectorOrNodes && typeof htmlOrSelectorOrNodes === 'object' && htmlOrSelectorOrNodes.type) {
        // Single node object
        if (typeof jest === 'undefined') {
            console.log(`[DEBUG] JQFactory: Received single node object`);
        }
        return new JQ([htmlOrSelectorOrNodes]);
    } else if (htmlOrSelectorOrNodes && typeof htmlOrSelectorOrNodes === 'object' && htmlOrSelectorOrNodes.nodeType) {
        // DOM element - convert to internal node format
        if (typeof jest === 'undefined') {
            console.log(`[DEBUG] JQFactory: Received DOM element, converting to internal format`);
        }
        const node = domElementToNode(htmlOrSelectorOrNodes);
        return new JQ([node]);
    }

    if (typeof jest === 'undefined') {
        console.log(`[DEBUG] JQFactory: Invalid input, creating empty JQ instance`);
    }
    return new JQ([]);
}

// Add fn property for jQuery-style plugin extensions
// This is an alias for JQ.prototype, allowing users to add methods like $.fn.myMethod = function() {...}
JQFactory.fn = JQ.prototype;

// Add clearRootNodesRegistry method for testing
JQFactory.clearRootNodesRegistry = JQ.clearRootNodesRegistry;

/**
 * Iterates over arrays and objects, similar to jQuery's $.each().
 * @param {Array|Object} collection - Array or object to iterate over
 * @param {Function} callback - Function called for each item (indexOrKey, value)
 * @returns {*} The collection that was iterated over
 */
JQFactory.each = function (collection, callback) {
    if (Array.isArray(collection)) {
        for (let i = 0; i < collection.length; i++) {
            if (callback.call(collection[i], i, collection[i]) === false) {
                break;
            }
        }
    } else if (collection && typeof collection === 'object') {
        for (let key in collection) {
            if (collection.hasOwnProperty(key)) {
                if (callback.call(collection[key], key, collection[key]) === false) {
                    break;
                }
            }
        }
    }
    return collection;
};

// Example custom method using $.fn pattern
// This demonstrates how users can extend the library with custom functionality
JQFactory.fn.yourFunctionName = function () {
    // 'this' inside the function refers to the JQ object (wrapped set of elements)
    // on which the method was called.
    console.log("Called yourFunctionName on " + this.nodes.length + " elements.");

    // Example functionality: add a custom attribute to demonstrate the method works
    this.nodes.forEach(element => {
        if (element.attributes) {
            element.attributes['data-custom-method-called'] = 'true';
        }
    });

    // To allow for chaining with other JQ methods, return 'this'.
    return this;
};

/**
 * Maps over arrays and objects, similar to jQuery's $.map().
 * @param {Array|Object} collection - Array or object to map over
 * @param {Function} callback - Function called for each item (value, indexOrKey)
 * @returns {Array} Array containing the results of the callback function
 */
JQFactory.map = function (collection, callback) {
    const results = [];

    if (Array.isArray(collection)) {
        for (let i = 0; i < collection.length; i++) {
            const result = callback.call(collection[i], collection[i], i);
            // Only include non-null and non-undefined values, flatten arrays
            if (result != null) {
                if (Array.isArray(result)) {
                    results.push(...result);
                } else {
                    results.push(result);
                }
            }
        }
    } else if (collection && typeof collection === 'object') {
        for (let key in collection) {
            if (collection.hasOwnProperty(key)) {
                const result = callback.call(collection[key], collection[key], key);
                // Only include non-null and non-undefined values, flatten arrays
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
 * This allows the returned object to be called as a function for finding elements.
 * @param {JQ} jqInstance - The JQ instance to wrap
 * @returns {Function} A callable function with all JQ methods attached
 * @private
 */
function makeCallable(jqInstance) {
    // Create a function that calls .find() on the JQ instance
    const callable = function (selector) {
        return jqInstance.find(selector);
    };

    // Copy all properties and methods from the JQ instance to the callable function
    // This includes all prototype methods and instance properties
    Object.setPrototypeOf(callable, Object.getPrototypeOf(jqInstance));

    // Copy instance properties
    for (let key in jqInstance) {
        if (jqInstance.hasOwnProperty(key)) {
            callable[key] = jqInstance[key];
        }
    }

    // Ensure the callable function has access to all JQ prototype methods
    for (let key of Object.getOwnPropertyNames(JQ.prototype)) {
        if (key !== 'constructor' && typeof jqInstance[key] === 'function') {
            callable[key] = jqInstance[key].bind(jqInstance);
        } else if (key !== 'constructor') {
            Object.defineProperty(callable, key, {
                get: function () { return jqInstance[key]; },
                set: function (value) { jqInstance[key] = value; },
                enumerable: true,
                configurable: true
            });
        }
    }

    // Copy special properties
    callable.nodes = jqInstance.nodes;
    callable.length = jqInstance.length;

    // Make it iterable
    callable[Symbol.iterator] = function () {
        return jqInstance.nodes[Symbol.iterator]();
    };

    // Array-like numeric access
    return new Proxy(callable, {
        get(target, prop) {
            // Handle numeric indices
            if (typeof prop === 'string' && /^\d+$/.test(prop)) {
                const index = parseInt(prop, 10);
                return jqInstance.nodes[index];
            }
            // Handle length property
            if (prop === 'length') {
                return jqInstance.nodes.length;
            }
            // Handle nodes property
            if (prop === 'nodes') {
                return jqInstance.nodes;
            }
            // Handle other properties
            return target[prop];
        },
        apply(target, thisArg, args) {
            // When called as a function, behave like JQFactory
            // If it's a string selector, use find() within the current context
            // If it's a node, array, or other input, use JQFactory to wrap it
            const input = args[0];

            if (typeof input === 'string') {
                // String: could be HTML or selector
                // If it looks like HTML, create new nodes (not within context)
                const trimmed = input.trim();
                if (trimmed.startsWith('<') && trimmed.endsWith('>')) {
                    // HTML string - use JQFactory to parse it
                    return JQFactory(input);
                } else {
                    // CSS selector - search within current context using find()
                    return jqInstance.find(input);
                }
            } else if (input && (typeof input === 'object' || Array.isArray(input))) {
                // Node object or array - wrap it using JQFactory
                return JQFactory(input);
            }

            // Default: return empty
            return JQFactory([]);
        }
    });
}

/**
 * Loads and parses HTML string, creating a callable JQ instance.
 * The returned object can be called as a function to find elements within the loaded HTML.
 * @param {string} html - HTML string to parse
 * @returns {Function} Callable JQ instance that supports both $("selector") and $.find("selector")
 * @example
 * const jq = require('@alphahoai/jqnode');
 * const $ = jq.load('<div><p>Hello</p></div>');
 * 
 * // Both syntaxes work:
 * const paragraphs1 = $('p');        // jQuery-like syntax
 * const paragraphs2 = $.find('p');   // Traditional syntax
 */
JQFactory.load = function (html) {
    if (typeof html !== 'string') {
        console.warn('[jqnode] .load() expects a string argument, received:', typeof html);
        return makeCallable(new JQ([]));
    }
    const jqInstance = JQFactory(html);
    return makeCallable(jqInstance);
};

// Attach static utility methods
const staticUtils = require('./utils-static');
JQFactory.now = staticUtils.now;
JQFactory.noop = staticUtils.noop;
JQFactory.param = staticUtils.param;
JQFactory.parseHTML = staticUtils.parseHTML;
JQFactory.parseJSON = staticUtils.parseJSON;
JQFactory.parseXML = staticUtils.parseXML;
JQFactory.trim = staticUtils.trim;
JQFactory.type = staticUtils.type;
JQFactory.unique = staticUtils.unique;
JQFactory.uniqueSort = staticUtils.uniqueSort;
JQFactory.makeArray = staticUtils.makeArray;
JQFactory.isPlainObject = staticUtils.isPlainObject;
JQFactory.isNumeric = staticUtils.isNumeric;
JQFactory.isFunction = staticUtils.isFunction;
JQFactory.isEmptyObject = staticUtils.isEmptyObject;
JQFactory.isArray = staticUtils.isArray;
JQFactory.inArray = staticUtils.inArray;
JQFactory.hasData = staticUtils.hasData;
JQFactory.extend = staticUtils.extend;
JQFactory.escapeSelector = staticUtils.escapeSelector;
JQFactory.title = staticUtils.title;

// Export the factory function as the main module interface
module.exports = JQFactory;
