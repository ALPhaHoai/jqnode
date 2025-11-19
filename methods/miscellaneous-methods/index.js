/**
 * Search for a given element from among the matched elements.
 * @see https://api.jquery.com/index/
 * @param {string|Element|JQ} [arg] - Selector, element, or JQ object to search for.
 * @returns {number} The index of the element.
 */
module.exports = function index(arg) {
    // Case 1: No argument - return index of first element among its siblings
    if (arg === undefined) {
        const first = this.nodes[0];
        if (!first) return -1;

        const parent = first.parent || first.parentNode;
        if (!parent) return -1;

        // Get siblings based on node type
        let siblings = [];
        if (parent.children) {
            // Internal nodes or DOM Element.children
            siblings = Array.from(parent.children);
            // Filter to ensure only elements are counted (internal nodes might have text nodes in children)
            siblings = siblings.filter(n => n.nodeType === 1 || n.type === 'element');
        } else if (parent.childNodes) {
            // DOM nodes fallback
            siblings = Array.from(parent.childNodes).filter(n => n.nodeType === 1);
        } else {
            return -1;
        }

        return siblings.indexOf(first);
    }

    // Case 2: Argument is a string (selector)
    if (typeof arg === 'string') {
        const first = this.nodes[0];
        if (!first) return -1;

        try {
            // Try to require selector engine if possible, or use global document
            // Note: In this project structure, we might need to be careful with circular deps
            // But since this is a method required by jq.js, and jq.js is required by index.js...
            // We can try lazy requiring selector.js

            let allMatches = [];

            // Check if we are in browser environment with document
            if (typeof document !== 'undefined') {
                const matches = document.querySelectorAll(arg);
                allMatches = Array.from(matches);
            } else {
                // Node environment - try to use internal selector engine
                // We need root nodes. JQ class has allRootNodes registry.
                const roots = this.constructor.allRootNodes || [];

                if (roots.length > 0) {
                    const { selectNodes } = require('../../selector');
                    roots.forEach(root => {
                        const matches = selectNodes([root], arg);
                        allMatches = allMatches.concat(matches);
                    });
                }
            }

            return allMatches.indexOf(first);
        } catch (e) {
            this.debugLog(`JQ.index: Error finding selector "${arg}": ${e.message}`);
            return -1;
        }
    }

    // Case 3: Argument is a DOM element or JQ object
    let target = arg;
    if (target instanceof this.constructor) {
        target = target.nodes[0];
    }
    return this.nodes.indexOf(target);
};
