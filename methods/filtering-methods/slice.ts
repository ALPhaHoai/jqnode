import type { JQ } from '../../types';

/**
 * Creates a subset of matched elements using array slice.
 * @param start - Zero-based index at which to begin extraction. Negative index counts from end.
 * @param end - Zero-based index before which to end extraction (exclusive). Negative index counts from end.
 * @see https://api.jquery.com/slice/
 */
function slice(this: JQ, start?: number, end?: number): JQ {
    const sliced = this.nodes.slice(start, end);
    return this.pushStack(sliced);
}

export default slice;
