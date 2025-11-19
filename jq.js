/**
 * Debug logging utility that checks for environment variable
 * Set JQNODE_DEBUG=1 or DEBUG=jqnode to enable debug logs
 */
const debugLog = (...args) => {
    if (process.env.JQNODE_DEBUG === '1' ||
        process.env.DEBUG === 'jqnode' ||
        (process.env.DEBUG && process.env.DEBUG.includes('jqnode'))) {
        console.log('[DEBUG]', ...args);
    }
};

/**
 * jQuery-style wrapper class for working with HTML node trees.
 * Provides methods similar to jQuery for DOM manipulation and traversal.
 */
class JQ {
    /**
     * Global registry of all root nodes for selector searches
     */
    static allRootNodes = [];

    /**
     * Static property to preserve the class name in browser environments
     * where constructor.name might be minified
     */
    static className = 'JQ';

    /**
     * Clear the global root nodes registry (mainly for testing)
     */
    static clearRootNodesRegistry() {
        JQ.allRootNodes = [];
    }

    /**
     * Creates a new JQ instance.
     * @param {Array} nodes - Array of HTML nodes to wrap
     */
    constructor(nodes) {
        this.nodes = nodes || [];
        // Set up parent references for the node tree only if nodes are DOM elements
        const { setupParentReferences } = require('./selector');
        const hasDomNodes = this.nodes.some(node =>
            node && typeof node === 'object' && (node.type === 'element' || node.type === 'text')
        );
        if (hasDomNodes) {
            setupParentReferences(this.nodes);
            // Add root nodes to global registry for selector searches (avoid duplicates)
            if (this.nodes.length > 0) {
                this.nodes.forEach(node => {
                    if (!JQ.allRootNodes.includes(node)) {
                        JQ.allRootNodes.push(node);
                    }
                });
            }
        }
        if (typeof jest === 'undefined') {
            debugLog(`JQ constructor: Created JQ instance with ${this.nodes.length} nodes`);
        }

        // Return a proxy to support array-like access
        return new Proxy(this, {
            get(target, prop) {
                // Handle numeric indices
                if (typeof prop === 'string' && /^\d+$/.test(prop)) {
                    const index = parseInt(prop, 10);
                    return target.nodes[index];
                }
                // Handle length property
                if (prop === 'length') {
                    return target.nodes.length;
                }
                // Handle other properties normally
                return target[prop];
            },
            set(target, prop, value) {
                // Prevent setting numeric indices
                if (typeof prop === 'string' && /^\d+$/.test(prop)) {
                    return false; // Don't allow setting
                }
                target[prop] = value;
                return true;
            }
        });
    }


    /**
     * Array-like access to nodes (jQuery compatibility)
     * @param {number} index - The index of the node to retrieve
     * @returns {Object|undefined} The node at the specified index, or undefined if out of bounds
     */
    [Symbol.iterator]() {
        return this.nodes[Symbol.iterator]();
    }

    /**
     * Support for numeric indexing like jQuery objects
     */
    get [Symbol.toStringTag]() {
        return 'JQ';
    }
}

// Set className on the constructor for browser compatibility
JQ.className = 'JQ';

// Attach all methods to the prototype
JQ.prototype.debugLog = debugLog;
JQ.prototype.find = require('./methods/selector-methods/find');
JQ.prototype.attr = require('./methods/attributes-methods/attr');
JQ.prototype.prop = require('./methods/attributes-methods/prop');
JQ.prototype.removeAttr = require('./methods/attributes-methods/removeAttr');
JQ.prototype.removeProp = require('./methods/attributes-methods/removeProp');
JQ.prototype.val = require('./methods/attributes-methods/val');
JQ.prototype.addClass = require('./methods/attributes-methods/addClass');
JQ.prototype.removeClass = require('./methods/attributes-methods/removeClass');
JQ.prototype.toggleClass = require('./methods/attributes-methods/toggleClass');
JQ.prototype.hasClass = require('./methods/attributes-methods/hasClass');
JQ.prototype.text = require('./methods/content-methods/text');
JQ.prototype.html = require('./methods/content-methods/html');
JQ.prototype.table2json = require('./methods/content-methods/table2json');
JQ.prototype.each = require('./methods/iteration-methods/each');
JQ.prototype.map = require('./methods/iteration-methods/map');
JQ.prototype.parent = require('./methods/traversal-methods/ancestor/parent');
JQ.prototype.parents = require('./methods/traversal-methods/ancestor/parents');
JQ.prototype.parentsUntil = require('./methods/traversal-methods/ancestor/parentsUntil');
JQ.prototype.closest = require('./methods/traversal-methods/ancestor/closest');
JQ.prototype.children = require('./methods/traversal-methods/descendant/children');
JQ.prototype.contents = require('./methods/traversal-methods/descendant/contents');
JQ.prototype.siblings = require('./methods/traversal-methods/sibling/siblings');
JQ.prototype.next = require('./methods/traversal-methods/sibling/next');
JQ.prototype.nextAll = require('./methods/traversal-methods/sibling/nextAll');
JQ.prototype.nextUntil = require('./methods/traversal-methods/sibling/nextUntil');
JQ.prototype.prev = require('./methods/traversal-methods/sibling/prev');
JQ.prototype.prevAll = require('./methods/traversal-methods/sibling/prevAll');
JQ.prototype.prevUntil = require('./methods/traversal-methods/sibling/prevUntil');
JQ.prototype.eq = require('./methods/filtering-methods/eq');
JQ.prototype.end = require('./methods/traversal-methods/end');
JQ.prototype.first = require('./methods/filtering-methods/first');
JQ.prototype.last = require('./methods/filtering-methods/last');
JQ.prototype.filter = require('./methods/filtering-methods/filter');
JQ.prototype.not = require('./methods/filtering-methods/not');
JQ.prototype.has = require('./methods/filtering-methods/has');
JQ.prototype.is = require('./methods/filtering-methods/is');
JQ.prototype.slice = require('./methods/filtering-methods/slice');
JQ.prototype.append = require('./methods/insertion-methods/inside/append');
JQ.prototype.appendTo = require('./methods/insertion-methods/inside/appendTo');
JQ.prototype.prepend = require('./methods/insertion-methods/inside/prepend');
JQ.prototype.prependTo = require('./methods/insertion-methods/inside/prependTo');
JQ.prototype.before = require('./methods/insertion-methods/outside/before');
JQ.prototype.insertBefore = require('./methods/insertion-methods/outside/insertBefore');
JQ.prototype.after = require('./methods/insertion-methods/outside/after');
JQ.prototype.insertAfter = require('./methods/insertion-methods/outside/insertAfter');
JQ.prototype.wrap = require('./methods/insertion-methods/wrapping/wrap');
JQ.prototype.wrapAll = require('./methods/insertion-methods/wrapping/wrapAll');
JQ.prototype.wrapInner = require('./methods/insertion-methods/wrapping/wrapInner');
JQ.prototype.toArray = require('./methods/miscellaneous-methods/toArray');
JQ.prototype.get = require('./methods/miscellaneous-methods/get');
JQ.prototype.size = require('./methods/miscellaneous-methods/size');
JQ.prototype.index = require('./methods/miscellaneous-methods/index');
JQ.prototype.data = require('./methods/data-methods/data');
JQ.prototype.removeData = require('./methods/data-methods/removeData');
JQ.prototype.remove = require('./methods/miscellaneous-methods/remove');
JQ.prototype.position = require('./methods/miscellaneous-methods/position');



// Attach private helpers (prefixed with _)
JQ.prototype._normalizeContent = require('./helpers/normalizeContent');
JQ.prototype._cloneNode = require('./helpers/cloneNode');
JQ.prototype._hasDescendant = require('./helpers/hasDescendant');
JQ.prototype._findCommonRoots = require('./helpers/findCommonRoots');

module.exports = JQ;
module.exports.debugLog = debugLog;
