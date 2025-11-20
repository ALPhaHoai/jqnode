/**
 * Selects the last matched element.
 * @see https://api.jquery.com/last/
 * @returns {JQ} New JQ instance with the last element, or empty if no elements
 */
module.exports = function last() {
    return this.eq(-1);
};