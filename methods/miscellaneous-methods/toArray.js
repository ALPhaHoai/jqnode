/**
 * Retrieve all the elements contained in the jQuery set, as an array.
 * @see https://api.jquery.com/toArray/
 * @returns {Array} The set of matched elements as a standard JavaScript array
 */
module.exports = function toArray() {
    return this.nodes.slice();
};
