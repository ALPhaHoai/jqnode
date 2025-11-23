import type { JQ } from '../../types';

/**
 * Selects the last matched element.
 * @see https://api.jquery.com/last/
 */
function last(this: JQ): JQ {
    return this.eq(-1);
}

export = last;
