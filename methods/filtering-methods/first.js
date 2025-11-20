/**
 * Selects the first matched element.
 * @see https://api.jquery.com/first/
 * @returns {JQ} New JQ instance with the first element, or empty if no elements
 */
module.exports = function first() {
    return this.eq(0);
};