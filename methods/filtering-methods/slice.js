function slice(start, end) {
    this.debugLog(`JQ.slice: Slicing elements from ${start} to ${end || 'end'} in ${this.nodes.length} elements`);

    const sliced = this.nodes.slice(start, end);
    this.debugLog(`JQ.slice: Sliced to ${sliced.length} elements`);
    return new this.constructor(sliced);
}

module.exports = slice;