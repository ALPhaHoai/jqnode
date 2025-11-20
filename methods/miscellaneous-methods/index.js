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
            let allMatches = [];

            // Check if we are in browser environment with document
            if (typeof document !== 'undefined') {
                const matches = document.querySelectorAll(arg);
                allMatches = Array.from(matches);
            } else {
                // Node environment - try to use internal selector engine
                const roots = this.constructor.allRootNodes || [];

                if (roots.length > 0) {
                    const { selectNodes } = require('../../selector');
                    roots.forEach(root => {
                        const matches = selectNodes([root], arg);
                        allMatches = allMatches.concat(matches);
                    });
                }
            }

            const target = first._originalElement || first;
            return allMatches.findIndex(match => {
                return match === target || match === first || (match._originalElement && match._originalElement === target);
            });
        } catch (e) {
            return -1;
        }
    }

    // Case 3: Argument is a DOM element or JQ object
    let target = arg;
    if (target instanceof this.constructor) {
        target = target.nodes[0];
    }

    // If target is a JQ node, it might have _originalElement
    // If target is a DOM element, it is the _originalElement
    const targetElem = target._originalElement || target;

    return this.nodes.findIndex(node => {
        return node === target || node === targetElem || (node._originalElement && node._originalElement === targetElem);
    });
};
