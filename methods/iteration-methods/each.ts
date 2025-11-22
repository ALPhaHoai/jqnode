import type { HtmlNode, JQ, EachCallback } from '../../types';

/**
 * Iterates over each element in the collection, similar to jQuery's .each().
 */
function each(this: JQ, callback: EachCallback): JQ {
    for (let i = 0; i < this.nodes.length; i++) {
        if (callback.call(this.nodes[i], i, this.nodes[i]) === false) {
            break;
        }
    }
    return this;
}

export = each;
