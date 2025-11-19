/**
 * Translate a set of elements into a new jQuery set or array.
 * @see https://api.jquery.com/map/
 * @param {Function} callback - Function called for each element (index, element)
 * @returns {JQ} New JQ instance containing the results of the callback function
 */
module.exports = function map(callback) {
    this.debugLog(`JQ.map: Mapping over ${this.nodes.length} elements`);
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
            this.debugLog(`JQ.map: Skipping element at index ${i} due to error: ${error.message}`);
            // Continue to next element without adding this result
        }
    }

    this.debugLog(`JQ.map: Mapped to ${results.length} results`);
    return new this.constructor(results);
};