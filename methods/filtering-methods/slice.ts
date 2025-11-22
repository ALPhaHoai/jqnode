import type { JQ } from '../../types';

/**
 * Creates a subset of matched elements using array slice.
 */
function slice(this: JQ, start?: number, end?: number): JQ {
    const sliced = this.nodes.slice(start, end);
    const result = Object.create(Object.getPrototypeOf(this));
    result.nodes = sliced;
    result.length = sliced.length;
    return result;
}

export = slice;
