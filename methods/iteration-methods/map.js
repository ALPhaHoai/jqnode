/**
 * Translate a set of elements into a new jQuery set or array.
 * @see https://api.jquery.com/map/
 * @param {Function} callback - Function called for each element (index, element)
 * @returns {JQ} New JQ instance containing the results of the callback function
 */
module.exports = function map(callback) {
    const results = [];

    for (let i = 0; i < this.nodes.length; i++) {
        try {
            const result = callback.call(this.nodes[i], i, this.nodes[i]);
            // Only include non-null and non-undefined values
            if (result != null) {
                // jQuery flattens array results
                if (Array.isArray(result)) {
                    results.push(...result);
                } else {
                    results.push(result);
                }
            }
        } catch (error) {
            // Continue to next element without adding this result
        }
    }
    return new this.constructor(results);
};