import type { JQ } from '../../types';
import JQClass from '../../jq';

/**
 * Creates a subset of matched elements using array slice.
 */
function slice(this: JQ, start?: number, end?: number): JQ {
    const sliced = this.nodes.slice(start, end);
    return new JQClass(sliced);
}

export = slice;
