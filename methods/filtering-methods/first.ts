import type { JQ } from '../../types';

/**
 * Selects the first matched element.
 */
function first(this: JQ): JQ {
    return this.eq(0);
}

export = first;
