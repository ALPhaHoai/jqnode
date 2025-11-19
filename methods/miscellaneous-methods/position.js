/**
 * Get the current coordinates of the first element in the set of matched elements, relative to the offset parent.
 * @see https://api.jquery.com/position/
 * @returns {Object} An object containing the properties top and left.
 */
module.exports = function position() {
    if (this.nodes.length === 0) {
        return undefined;
    }

    const node = this.nodes[0];

    // For browser DOM elements
    if (typeof document !== 'undefined' && node.nodeType === 1) {
        const elem = node;
        const offsetParent = elem.offsetParent || document.documentElement;

        let top = elem.offsetTop || 0;
        let left = elem.offsetLeft || 0;

        return { top, left };
    }

    // For internal nodes (server-side), return default position
    // Note: In server-side rendering, position calculations are not available
    return { top: 0, left: 0 };
};
