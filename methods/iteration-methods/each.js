/**
 * Iterates over each element in the collection, similar to jQuery's .each().
 * @see https://api.jquery.com/each/
 * @param {Function} callback - Function called for each element (index, element)
 * @returns {JQ} The JQ instance for chaining
 */
module.exports = function each(callback) {
    for (let i = 0; i < this.nodes.length; i++) {
        if (callback.call(this.nodes[i], i, this.nodes[i]) === false) {
            break;
        }
    }
    return this;
};