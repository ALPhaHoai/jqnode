/**
 * End the most recent filtering operation in the current chain and return the set of matched elements to its previous state.
 * @see https://api.jquery.com/end/
 * @returns {JQ} The previous set of matched elements
 */
module.exports = function end() {
    // If we have a previous selection stored, return to it
    if (this._prevObject) {
        return this._prevObject;
    }

    // If no previous selection, return current selection (no-op)
    return this;
};
