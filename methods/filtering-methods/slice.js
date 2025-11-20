function slice(start, end) {
    const sliced = this.nodes.slice(start, end);
    return new this.constructor(sliced);
}

module.exports = slice;