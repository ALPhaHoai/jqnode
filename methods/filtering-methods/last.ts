import type { JQ } from '../../types';

/**
 * Selects the last matched element.
 */
function last(this: JQ): JQ {
    return this.eq(-1);
}

export = last;
