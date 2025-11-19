/**
 * Retrieve the DOM elements matched by the jQuery object.
 * @see https://api.jquery.com/get/
 * @param {number} [index] - A zero-based integer indicating which element to retrieve.
 * @returns {Array|Element} The element at the specified index or an array of all elements.
 */
module.exports = function get(index) {
    if (index === undefined) {
        return this.nodes.slice();
    }
    if (index < 0) {
        return this.nodes[this.nodes.length + index];
    }
    return this.nodes[index];
};
