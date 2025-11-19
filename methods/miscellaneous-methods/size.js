/**
 * Return the number of elements in the jQuery object.
 * @see https://api.jquery.com/size/
 * @deprecated 1.8 Use the .length property instead.
 * @returns {number} The number of elements in the jQuery object.
 */
module.exports = function size() {
    return this.nodes.length;
};
