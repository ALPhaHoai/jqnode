import type { JQ, EachCallback } from '../../types';

/**
 * Iterates over each element in the collection, similar to jQuery's .each().
 * @see https://api.jquery.com/each/
 */
function each(this: JQ, callback: EachCallback): JQ {
    for (let i = 0; i < this.nodes.length; i++) {
        if (callback.call(this.nodes[i], i, this.nodes[i]) === false) {
            break;
        }
    }
    return this;
}

export default each;
