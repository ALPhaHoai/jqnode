/**
 * Selects the element at a specific index from the matched set (0-based).
 * @see https://api.jquery.com/eq/
 * @param {number} index - The 0-based index of the element to select
 * @returns {JQ} New JQ instance with the element at the specified index, or empty if out of bounds
 */
module.exports = function eq(index) {
    this.debugLog(`JQ.eq: Selecting element at index ${index} from ${this.nodes.length} elements`);

    const originalIndex = index;

    // jQuery behavior:
    // - null becomes 0
    // - undefined becomes NaN, return empty collection
    // - Invalid strings become NaN, return empty collection
    // - Fractional numbers are truncated towards zero
    // - Negative indices wrap around

    let numericIndex = Number(index);

    // Special case: undefined becomes NaN, return empty
    if (index === undefined) {
        this.debugLog(`JQ.eq: Index ${originalIndex} is undefined, returning empty result`);
        return new this.constructor([]);
    }

    if (isNaN(numericIndex)) {
        this.debugLog(`JQ.eq: Index ${originalIndex} converts to NaN, returning empty result`);
        return new this.constructor([]);
    }

    // Truncate fractional numbers towards zero
    numericIndex = Math.trunc(numericIndex);

    // Handle negative indices - wrap around like jQuery does
    if (numericIndex < 0) {
        numericIndex = this.nodes.length + numericIndex;
    }

    // Check bounds
    if (numericIndex >= 0 && numericIndex < this.nodes.length) {
        let selectedNode = this.nodes[numericIndex];

        // For fractional indices, create a detached copy to match jQuery behavior
        if (typeof originalIndex === 'number' && originalIndex % 1 !== 0) {
            selectedNode = { ...selectedNode, _detached: true };
        }

        const result = new this.constructor([selectedNode]);
        result._prevObject = this;
        this.debugLog(`JQ.eq: Found element at index ${numericIndex}`);
        return result;
    }

    this.debugLog(`JQ.eq: Index ${originalIndex} is out of bounds, returning empty result`);
    const result = new this.constructor([]);
    result._prevObject = this;
    return result;
};
