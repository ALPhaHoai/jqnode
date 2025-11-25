import type { JQ } from '../../types';

/**
 * Selects the first matched element.
 * @see https://api.jquery.com/first/
 */
function first(this: JQ): JQ {
    return this.eq(0);
}

export default first;
