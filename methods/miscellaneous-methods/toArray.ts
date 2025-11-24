import type { JqElement, JQ } from '../../types';

/**
 * Retrieve all the elements contained in the jQuery set, as an array.
 * @see https://api.jquery.com/toArray/
 */
function toArray(this: JQ): JqElement[] {
    return this.nodes.map((node: JqElement) => node._originalElement || node) as JqElement[];
}

export = toArray;
