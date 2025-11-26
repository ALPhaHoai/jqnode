import type { JqElement, JQ } from '../../types';

/**
 * Sorts the elements in place.
 * @see https://api.jquery.com/sort/
 */
function sort(this: JQ, compareFn?: (a: JqElement, b: JqElement) => number): JQ {
    this.nodes.sort(compareFn);
    return this;
}

export default sort;
