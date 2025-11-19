/**
 * End the most recent filtering operation in the current chain and return the set of matched elements to its previous state.
 * @see https://api.jquery.com/end/
 * @returns {JQ} The previous set of matched elements
 */
module.exports = function end() {
    this.debugLog(`JQ.end: Ending current filtering operation, returning to previous selection`);

    // If we have a previous selection stored, return to it
    if (this._prevObject) {
        this.debugLog(`JQ.end: Returning to previous object with ${this._prevObject.nodes.length} elements`);
        return this._prevObject;
    }

    // If no previous selection, return current selection (no-op)
    this.debugLog(`JQ.end: No previous selection available, returning current selection`);
    return this;
};
