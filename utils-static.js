/**
 * Static utility methods for jQuery compatibility
 * These are utility functions that are attached to the jQuery/$ object itself
 */

/**
 * Return a number representing the current time.
 * @see https://api.jquery.com/jQuery.now/
 * @deprecated Use Date.now() instead.
 * @returns {number} Number representing current time
 */
function now() {
    return Date.now();
}

/**
 * An empty function.
 * @see https://api.jquery.com/jQuery.noop/
 * @returns {undefined}
 */
function noop() {
    // Empty function
}

/**
 * Create a serialized representation of an array, a plain object, or a jQuery object.
 * @see https://api.jquery.com/jQuery.param/
 * @param {Array|Object} obj - An array, a plain object, or a jQuery object to serialize.
 * @param {boolean} [traditional=false] - A Boolean indicating whether to perform a traditional "shallow" serialization.
 * @returns {string} Serialized string suitable for URL query string
 */
function param(obj, traditional = false) {
    const s = [];

    const add = (key, valueOrFunction) => {
        const value = typeof valueOrFunction === 'function' ? valueOrFunction() : valueOrFunction;
        s.push(encodeURIComponent(key) + '=' + encodeURIComponent(value == null ? '' : value));
    };

    const buildParams = (prefix, obj) => {
        if (Array.isArray(obj)) {
            obj.forEach((v, i) => {
                if (traditional || /\[\]$/.test(prefix)) {
                    add(prefix, v);
                } else {
                    buildParams(
                        prefix + '[' + (typeof v === 'object' && v != null ? i : '') + ']',
                        v
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
        obj.nodes.forEach(node => {
            if (node.tagName === 'INPUT' || node.tagName === 'SELECT' || node.tagName === 'TEXTAREA') {
                const name = node.attributes && node.attributes.name;
                const value = node.properties && node.properties.value !== undefined
                    ? node.properties.value
                    : (node.attributes && node.attributes.value);
                if (name) {
                    add(name, value || '');
                }
            }
        });
    } else if (Array.isArray(obj)) {
        // Handle array (from serializeArray format)
        obj.forEach(item => {
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
 * Parses a string into an array of DOM nodes.
 * @see https://api.jquery.com/jQuery.parseHTML/
 * @param {string} data - HTML string to be parsed
 * @param {Document} [context] - DOM document context
 * @param {boolean} [keepScripts=false] - Whether to include scripts
 * @returns {Array} Array of DOM nodes
 */
function parseHTML(data, context, keepScripts) {
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
        const nodes = parseHTMLInternal(data);

        // Filter out script tags if keepScripts is false
        if (keepScripts === false) {
            return nodes.filter(node =>
                !(node.type === 'element' && node.tagName === 'SCRIPT')
            );
        }

        return nodes;
    }

    // Browser environment
    const doc = context || document;
    const parsed = doc.createElement('div');
    parsed.innerHTML = data;

    const nodes = Array.from(parsed.childNodes);

    // Filter out script elements if keepScripts is false
    if (keepScripts === false) {
        return nodes.filter(node => node.nodeName !== 'SCRIPT');
    }

    return nodes;
}

/**
 * Takes a well-formed JSON string and returns the resulting JavaScript value.
 * @see https://api.jquery.com/jQuery.parseJSON/
 * @deprecated Use JSON.parse() instead.
 * @param {string} json - The JSON string to parse
 * @returns {*} Parsed JavaScript value
 */
function parseJSON(json) {
    return JSON.parse(json);
}

/**
 * Parses a string into an XML document.
 * @see https://api.jquery.com/jQuery.parseXML/
 * @param {string} data - XML string to be parsed
 * @returns {XMLDocument} XML document
 */
function parseXML(data) {
    if (!data || typeof data !== 'string') {
        return null;
    }

    let xml;

    // Browser environment
    if (typeof window !== 'undefined' && window.DOMParser) {
        xml = new window.DOMParser().parseFromString(data, 'text/xml');
    }
    // Node.js environment - parseXML is not fully supported server-side without jsdom
    // Users can install jsdom separately if needed
    else {
        // Return null for server-side, as XML parsing requires jsdom
        return null;
    }

    if (!xml || xml.getElementsByTagName('parsererror').length) {
        throw new Error('Invalid XML: ' + data);
    }

    return xml;
}

/**
 * Remove the whitespace from the beginning and end of a string.
 * @see https://api.jquery.com/jQuery.trim/
 * @deprecated Use String.prototype.trim() instead.
 * @param {string} str - The string to trim
 * @returns {string} Trimmed string
 */
function trim(str) {
    return str == null ? '' : String(str).trim();
}

/**
 * Determine the internal JavaScript [[Class]] of an object.
 * @see https://api.jquery.com/jQuery.type/
 * @param {*} obj - Object to get the internal JavaScript [[Class]] of
 * @returns {string} Type of object
 */
function type(obj) {
    if (obj == null) {
        return String(obj);
    }

    const class2type = {
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regexp',
        '[object Object]': 'object',
        '[object Error]': 'error',
        '[object Symbol]': 'symbol'
    };

    const type = typeof obj;
    if (type === 'object' || type === 'function') {
        const str = Object.prototype.toString.call(obj);
        return class2type[str] || 'object';
    }

    return type;
}

/**
 * Sorts an array of DOM elements, in place, with the duplicates removed.
 * @see https://api.jquery.com/jQuery.unique/
 * @deprecated Use jQuery.uniqueSort() instead.
 * @param {Array} arr - Array of DOM elements
 * @returns {Array} Sorted array with duplicates removed
 */
function unique(arr) {
    return uniqueSort(arr);
}

/**
 * Sorts an array of DOM elements, in place, with the duplicates removed.
 * @see https://api.jquery.com/jQuery.uniqueSort/
 * @param {Array} arr - Array of DOM elements
 * @returns {Array} Sorted array with duplicates removed
 */
function uniqueSort(arr) {
    if (!Array.isArray(arr)) {
        return [];
    }

    const seen = new Set();
    const result = [];

    for (let i = 0; i < arr.length; i++) {
        if (!seen.has(arr[i])) {
            seen.add(arr[i]);
            result.push(arr[i]);
        }
    }

    // Sort DOM elements by document order if they have compareDocumentPosition
    result.sort((a, b) => {
        if (a === b) {
            return 0;
        }

        // Try DOM comparison
        if (a.compareDocumentPosition) {
            return a.compareDocumentPosition(b) & 4 ? -1 : 1;
        }

        return 0;
    });

    // Replace original array contents
    arr.length = 0;
    arr.push(...result);

    return arr;
}

/**
 * Convert an array-like object into a true JavaScript array.
 * @see https://api.jquery.com/jQuery.makeArray/
 * @param {*} obj - Any object to turn into a native Array
 * @returns {Array} True JavaScript array
 */
function makeArray(obj) {
    if (obj == null) {
        return [];
    }

    if (Array.isArray(obj)) {
        return obj.slice();
    }

    // Check for array-like object
    if (typeof obj === 'object' && typeof obj.length === 'number') {
        return Array.prototype.slice.call(obj);
    }

    return [obj];
}

/**
 * Check to see if an object is a plain object.
 * @see https://api.jquery.com/jQuery.isPlainObject/
 * @param {*} obj - Object to test
 * @returns {boolean} True if plain object
 */
function isPlainObject(obj) {
    if (!obj || type(obj) !== 'object') {
        return false;
    }

    // Built-in objects like DOM nodes or window
    if (obj.nodeType || obj === obj.window) {
        return false;
    }

    // Object with no prototype (Object.create(null))
    const proto = Object.getPrototypeOf(obj);
    if (!proto) {
        return true;
    }

    // Objects with prototype are plain if they are constructed by Object
    const Ctor = Object.prototype.hasOwnProperty.call(proto, 'constructor') && proto.constructor;
    return typeof Ctor === 'function' && Ctor === Object;
}

/**
 * Determines whether its argument represents a JavaScript number.
 * @see https://api.jquery.com/jQuery.isNumeric/
 * @param {*} value - Value to test
 * @returns {boolean} True if numeric
 */
function isNumeric(value) {
    return !Array.isArray(value) && (value - parseFloat(value) + 1) >= 0;
}

/**
 * Determine if the argument passed is a JavaScript function object.
 * @see https://api.jquery.com/jQuery.isFunction/
 * @deprecated Use typeof x === "function" instead.
 * @param {*} obj - Object to test
 * @returns {boolean} True if function
 */
function isFunction(obj) {
    return typeof obj === 'function';
}

/**
 * Check to see if an object is empty (contains no enumerable properties).
 * @see https://api.jquery.com/jQuery.isEmptyObject/
 * @param {Object} obj - Object to test
 * @returns {boolean} True if object is empty
 */
function isEmptyObject(obj) {
    if (obj == null) {
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
 * @see https://api.jquery.com/jQuery.isArray/
 * @deprecated Use Array.isArray() instead.
 * @param {*} obj - Object to test
 * @returns {boolean} True if array
 */
function isArray(obj) {
    return Array.isArray(obj);
}

/**
 * Search for a specified value within an array and return its index (or -1 if not found).
 * @see https://api.jquery.com/jQuery.inArray/
 * @param {*} value - Value to search for
 * @param {Array} arr - Array to search in
 * @param {number} [fromIndex=0] - Index to start searching from
 * @returns {number} Index of value or -1
 */
function inArray(value, arr, fromIndex) {
    if (!Array.isArray(arr)) {
        return -1;
    }
    return arr.indexOf(value, fromIndex);
}

/**
 * Determine whether an element has any jQuery data associated with it.
 * @see https://api.jquery.com/jQuery.hasData/
 * @param {Element} element - DOM element to check for data
 * @returns {boolean} True if element has data
 */
function hasData(element) {
    return !!(element && element._jqData && !isEmptyObject(element._jqData));
}

/**
 * Merge the contents of two or more objects together into the first object.
 * @see https://api.jquery.com/jQuery.extend/
 * @param {boolean|Object} target - Target object or deep flag
 * @param {...Object} objects - Objects to merge
 * @returns {Object} Merged object
 */
function extend(...args) {
    let options, name, src, copy, copyIsArray, clone;
    let target = args[0] || {};
    let i = 1;
    let length = args.length;
    let deep = false;

    // Handle deep copy situation
    if (typeof target === 'boolean') {
        deep = target;
        target = args[i] || {};
        i++;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if (typeof target !== 'object' && !isFunction(target)) {
        target = {};
    }

    // Extend the object itself if only one argument is passed
    if (i === length) {
        target = this;
        i--;
    }

    for (; i < length; i++) {
        // Only deal with non-null/undefined values
        if ((options = args[i]) != null) {
            // Extend the base object
            for (name in options) {
                if (options.hasOwnProperty(name)) {
                    copy = options[name];

                    // Prevent never-ending loop
                    if (target === copy) {
                        continue;
                    }

                    // Recurse if we're merging plain objects or arrays
                    if (deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
                        src = target[name];

                        // Ensure proper type for the source value
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && Array.isArray(src) ? src : [];
                        } else {
                            clone = src && isPlainObject(src) ? src : {};
                        }

                        // Never move original objects, clone them
                        target[name] = extend(deep, clone, copy);
                    }
                    // Don't bring in undefined values
                    else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }
    }

    return target;
}

/**
 * Escapes any character that has a special meaning in a CSS selector.
 * @see https://api.jquery.com/jQuery.escapeSelector/
 * @param {string} selector - Selector string to escape
 * @returns {string} Escaped selector string
 */
function escapeSelector(selector) {
    if (typeof selector !== 'string') {
        return selector;
    }

    // CSS.escape is available in modern browsers
    if (typeof CSS !== 'undefined' && CSS.escape) {
        return CSS.escape(selector);
    }

    // Fallback implementation
    // Escape special characters: !"#$%&'()*+,./:;<=>?@[\]^`{|}~
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
 * Uses jqnode selector to find and return the text content of the <title> element.
 * @returns {string} The current document title, or empty string if not found
 */
function title() {
    // Lazy load JQFactory to avoid circular dependency
    const JQFactory = require('./index');

    // Use jqnode selector to find title element
    // This works in both Node.js (with parsed HTML) and browser environments
    return JQFactory("head > title").text().trim();
}

module.exports = {
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
    title
};
