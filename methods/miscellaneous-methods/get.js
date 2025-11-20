/**
 * Retrieve the DOM elements matched by the jQuery object.
 * @see https://api.jquery.com/get/
 * @param {number} [index] - A zero-based integer indicating which element to retrieve.
 * @returns {Array|Element} The element at the specified index or an array of all elements.
 */
module.exports = function get(index) {
    if (index === undefined) {
        return this.nodes.map(node => node._originalElement || node);
    }
    let node;
    if (index < 0) {
        node = this.nodes[this.nodes.length + index];
    } else {
        node = this.nodes[index];
    }
    return node ? (node._originalElement || node) : undefined;
};
